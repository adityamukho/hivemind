const { last, map } = require('lodash')
const { db, rg } = require('./arangoWrapper')
const { aql } = require('arangojs')

const compoundEvents = db.collection('compound_events')
const skeletonGraph = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton`
const skeletonVertices = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton_vertices`

function createNodeBracePath (nKeys) {
  const pathSegments = map(nKeys, (keys, coll) => {
    let pathSegment = `${coll}/`

    keys = Array.isArray(keys) ? keys : Array.from(keys)
    if (keys.length > 1) {
      pathSegment += `{${keys.join(',')}}`
    }
    else {
      pathSegment += keys[0]
    }

    return pathSegment
  })

  let path = '/n/'

  if (pathSegments.length > 1) {
    path += `{${pathSegments.join(',')}}`
  }
  else if (pathSegments.length === 1) {
    path += pathSegments[0]
  }

  return path
}

async function recordCompoundEvent (event, userId, nodeMetas) {
  if (nodeMetas.length) {
    const svid = `${skeletonVertices}/${userId.replace('/', '.')}`
    const vertexMeta = nodeMetas.find(meta => ['mindmaps', 'nodes'].includes(meta._id.split('/')[0]))
    const evid = `${skeletonVertices}/${vertexMeta._id.replace('/', '.')}`
    const query = aql`
      for v, e in outbound shortest_path
      ${svid} to ${evid}
      graph ${skeletonGraph}
      
      filter v._key like 'mindmaps%'
      
      return v.meta.id
    `
    const cursor = await db.query(query)
    if (cursor.hasNext) {
      const mid = await cursor.next()
      const nKeys = {}
      const revs = []
      for (const nMeta of nodeMetas) {
        const [coll] = nMeta._id.split('/')
        if (!nKeys[coll]) {
          nKeys[coll] = new Set()
        }

        nKeys[coll].add(nMeta._key)

        let revEntry = revs.find(entry => entry[0] === nMeta._id)
        if (revEntry) {
          revEntry[1].push(nMeta._rev)
        }
        else {
          revEntry = [nMeta._id, [nMeta._rev]]
          revs.push(revEntry)
        }
      }

      const path = createNodeBracePath(nKeys)
      const postFilter = `event === '${event}' && fromPairs(${JSON.stringify(
        revs)})[meta.id].includes(meta.rev)`
      const response = await rg.post('/event/log', { path, postFilter }, { sort: 'asc' })
      const events = response.body

      const compoundEvent = {
        fctime: events[0].ctime,
        lctime: last(events).ctime,
        eids: map(events, '_id'),
        nids: map(events, 'meta.id'),
        mid,
        event
      }

      return await compoundEvents.save(compoundEvent)
    }
    else {
      return 'Could not link nodes to mindmap.'
    }
  }

  return Promise.resolve(null)
}

module.exports = {
  createNodeBracePath,
  recordCompoundEvent
}
