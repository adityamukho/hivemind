import { aql } from 'arangojs'
import { hasReadAccess } from '../../../utils/auth/access'
import db, { rg } from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

const skeletonGraph = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton`
const svPrefix = `${skeletonGraph}_vertices`

function createNodeBracepath (nodeGroups) {
  const pathSegments = nodeGroups.map(group => {
    let pathSegment = `${group.coll}/`

    const keys = group.keys
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

const EventsAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    const { key } = req.query
    let response

    switch (req.method) {
      case 'GET':
        const mid = `mindmaps/${key}`

        if (await hasReadAccess(mid, userId)) {
          const svSuffix = `mindmaps.${key}`
          const svid = `${svPrefix}/${svSuffix}`

          let query = aql`
          for v, e, p in 0..${Number.MAX_SAFE_INTEGER}
          any ${svid}
          graph ${skeletonGraph}
          
          prune v.collection == 'access'
          
          options {uniqueVertices: 'global', bfs: true}
          
          filter v.collection not in ['access', 'links']
          
          collect coll = v.collection into keys = v.meta.key
          
          return {coll, keys}
        `
          let cursor = await db.query(query)
          const groups = await cursor.all()
          const path = createNodeBracepath(groups)

          response = await rg.post('/event/log', { path }, { sort: 'asc' })

          return res.status(response.statusCode).json(response.body)
        }
        else {
          return res.status(401).json({ message: 'Access Denied.' })
        }
    }
  }
  catch (error) {
    console.error(error.message, error.stack)

    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default EventsAPI
