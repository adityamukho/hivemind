const { map, filter, zip, find, chain, last, reject } = require('lodash')
const { db, rg } = require('./init')
const { aql } = require('arangojs')
const { createNodeBracePath } = require('../utils/rgHelpers')

const compoundEvents = db.collection('compound_events')
const skeletonGraph = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton`
const skeletonVertices = db.collection(`${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton_vertices`)

function insertSaveEvents (path, mid) {
  return rg.post('/event/log', { path, postFilter: '(["created", "updated"]).includes(event)' },
    { groupBy: 'event', groupSort: 'asc' })
    .then(response => {
      const eventGroups = response.body
      const saves = []
      for (const eventGroup of eventGroups) {
        const { event, events } = eventGroup
        const cEvents = []

        switch (event) {
          case 'updated':
            for (const ev of reject(events, { collection: 'links' })) {
              const cEvent = {
                fctime: ev.ctime,
                lctime: ev.ctime,
                eids: [ev._id],
                nids: [ev.meta.id],
                mid,
                event: 'updated'
              }

              cEvents.push(cEvent)
            }

            break
          case 'created':
            const nodeEvents = filter(events, { collection: 'nodes' })
            const linkEvents = filter(events, { collection: 'links' })
            const groupedEvents = zip(nodeEvents, linkEvents)

            for (const eGroup of groupedEvents) {
              const ctimes = chain(eGroup).map('ctime').sortBy().value()
              const cEvent = {
                fctime: ctimes[0],
                lctime: ctimes[1],
                eids: map(eGroup, '_id'),
                nids: map(eGroup, 'meta.id'),
                mid,
                event: 'created'
              }

              cEvents.push(cEvent)
            }

            const mindmapEvent = find(events, { collection: 'mindmaps' })
            cEvents.push({
              fctime: mindmapEvent.ctime,
              lctime: mindmapEvent.ctime,
              eids: [mindmapEvent._id],
              nids: [],
              mid,
              event: 'created'
            })

            break

          default:
            console.log(`Not yet supported: ${event}`)
        }

        if (cEvents.length) {
          saves.push(compoundEvents.saveAll(cEvents)
            .then(result => console.log(
              `Inserted ${result.length} compound events for event: ${event}, mid: ${mid}`)))
        }
      }

      return saves
    })
    .then(saves => Promise.all(saves))
}

function insertDeleteEvents (path, mid) {
  return rg.post('/event/log', { path, postFilter: 'events[0].event === "deleted"' },
    { groupBy: 'node', groupLimit: 1 })
    .then(response => {
      const eventGroups = response.body
      const flatEvents = chain(eventGroups).map('events').flatten().sortBy('ctime').value()

      function delSubTree () {
        const nodeEvents = flatEvents.filter(
          event => ['mindmaps', 'nodes'].includes(event.collection))
        const root = nodeEvents[0]
        const svid = `${skeletonVertices.name}/${root.collection}.${root.meta.key}`
        const query = aql`
            let children = (
              for v in 0..${Number.MAX_SAFE_INTEGER}
              outbound ${svid}
              graph ${skeletonGraph}
              
              options {uniqueVertices: 'global', bfs: true}
          
              return {coll: v.collection, key: v.meta.key, id: v.meta.id}
            )
            
            let sColl = ${root.collection}
            let incoming = sColl == 'mindmaps' ? [] : (
              for v in 1
              inbound ${svid}
              graph ${skeletonGraph}
              
              return {coll: v.collection, key: v.meta.key, id: v.meta.id}
            )
            
            return append(children, incoming)
          `
        return db.query(query)
          .then(cursor => cursor.next())
          .then(nodeMetas => {
            const events = chain(flatEvents)
              .remove(ev => find(nodeMetas, { id: ev.meta.id }))
              .sortBy('ctime')
              .value()
            const ctimes = map(events, 'ctime')
            const cEvent = {
              fctime: ctimes[0],
              lctime: last(ctimes),
              eids: map(events, '_id'),
              nids: map(events, 'meta.id'),
              mid,
              event: 'deleted'
            }

            const save1 = compoundEvents.save(cEvent).then(() => console.log(
              `Inserted 1 compound events for event: deleted, mid: ${mid}`))

            let save2
            if (flatEvents.length) {
              save2 = delSubTree()
            } else {
              save2 = Promise.resolve()
            }

            return Promise.all([save1, save2])
          })
      }

      if (flatEvents.length) {
        return delSubTree()
      } else {
        return Promise.resolve()
      }
    })
}

module.exports = compoundEvents.truncate()
  .then(() => {
    console.log(`Truncated ${compoundEvents.name}.`)

    const query = aql`
      let msvids = (
        for v in ${skeletonVertices}
        filter v.collection == 'mindmaps'
        
        return v._id
      )
      
      for svid in msvids
      let nodes = (
        for v in 0..${Number.MAX_SAFE_INTEGER}
        outbound svid
        graph ${skeletonGraph}
    
        options {uniqueVertices: 'global', bfs: true}
    
        return {id: v.meta.id, key: v.meta.key, collection: v.collection}
      )
      
      let mid = (nodes[* filter CURRENT.collection == 'mindmaps'])[0].id
      
      let nodeGroups = merge(
        for node in nodes
        
        collect coll = node.collection into keys = node.key
        
        return {[coll]: keys}
      )
      
      return {mid, nodeGroups}
    `

    return db.query(query)
  })
  .then(cursor => cursor.all())
  .then(result => {
    const ops = []

    for (const meta of result) {
      const { mid, nodeGroups } = meta
      const path = createNodeBracePath(nodeGroups)

      // Creates and Updates
      ops.push(insertSaveEvents(path, mid))

      // Deletes
      ops.push(insertDeleteEvents(path, mid))
    }

    return ops
  })
  .then(ops => Promise.all(ops))
  .then(() => console.log('Finished generating compound events.\n'))