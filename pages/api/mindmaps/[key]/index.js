import { aql } from 'arangojs'
import { hasReadAccess } from '../../../../utils/auth/access'
import { verifyIdToken } from '../../../../utils/auth/firebaseAdmin'
import { rg2cy } from '../../../../utils/cyHelpers'
import { chain, get } from 'lodash'

const { db, rg } = require('../../../../utils/arangoWrapper')
const updateMindMap = async (database, mindmapKey, name) => {
  return database.query({
    query: `UPDATE @mindmapKey WITH { name: @name } IN mindmaps`,
    bindVars: { name, mindmapKey }
  });
}

const MindMapAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    const { key, timestamp } = req.query
    const id = `mindmaps/${key}`

    let mindmap, query, cursor, edgeStartIdx

    switch (req.method) {
      case 'GET':
        if (timestamp && await hasReadAccess(id, userId)) {
          const response = await rg.post('/history/traverse', {
            edges: { access: 'outbound', links: 'outbound' }
          }, {
            timestamp,
            svid: id,
            minDepth: 0,
            maxDepth: Number.MAX_SAFE_INTEGER,
            uniqueVertices: 'global',
            returnPaths: false
          })

          mindmap = response.body
          edgeStartIdx = 0
        }
        else {
          query = aql`
            for v, e, p in 1..${Number.MAX_SAFE_INTEGER}
            any ${userId}
            graph 'mindmaps'
            
            options { uniqueVertices: 'global', bfs: true }
            
            filter p.vertices[1]._id == ${id}
            
            collect aggregate vertices = unique(v), edges = unique(e)
            
            return { vertices, edges }
          `
          cursor = await db.query(query)
          mindmap = await cursor.next()
          edgeStartIdx = 1
        }

        if (get(mindmap, ['vertices', 'length'])) {
          const meta = mindmap.vertices[0]
          const access = mindmap.edges[0]
          const vertices = [], edges = []

          for (let i = 0; i < mindmap.vertices.length; i++) {
            vertices.push(mindmap.vertices[i])
          }
          for (let i = edgeStartIdx; i < mindmap.edges.length; i++) {
            edges.push(mindmap.edges[i])
          }

          const userIds = chain(vertices)
            .flatMap(v => [v.createdBy, v.lastUpdatedBy])
            .compact()
            .uniq()
            .value()
          query = aql`
            for u in users
            filter u._id in ${userIds}
            
            return keep(u, '_id', 'displayName', 'email')
          `
          cursor = await db.query(query)
          const users = await cursor.all()

          for (const v of vertices) {
            for (const field of ['createdBy', 'lastUpdatedBy']) {
              if (v[field]) {
                const user = users.find(u => u._id === v[field])
                v[field] = user.displayName || user.email
              }
            }
          }

          const result = {
            meta,
            access,
            elements: rg2cy([
              {
                type: 'vertex',
                nodes: vertices
              },
              {
                type: 'edge',
                nodes: edges
              }
            ])
          }

          return res.status(200).json(result)
        }
      case 'POST':
        const { name } = req.body
        if (!name || 0 === name.length) {
          return res.status(400).json({"message": "name is required"})
        }
        await updateMindMap(db, key, name)
        return res.status(200).json({"message": "updated"})
      default:
      return res.status(401).json({ message: 'Access Denied.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default MindMapAPI
