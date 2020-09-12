import { aql } from 'arangojs'
import db from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import {rg2cy} from '../../../utils/cyHelpers'

const MindMapAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    const { key } = req.query
    const id = `mindmaps/${key}`

    switch (req.method) {
      case 'GET':
        const query = aql`
          for v, e, p in 1..${Number.MAX_SAFE_INTEGER}
          any ${userId}
          graph 'mindmaps'
          
          filter p.vertices[1]._id == ${id}
          
          collect aggregate vertices = unique(v), edges = unique(e)
          
          return { vertices, edges }
        `
        const cursor = await db.query(query)
        const mindmap = await cursor.next()
        if (mindmap.vertices.length) {
          const meta = mindmap.vertices[0]
          const access = mindmap.edges[0]
          const vertices = [], edges = []

          for (let i = 0; i < mindmap.vertices.length; i++) {
            vertices.push(mindmap.vertices[i])
          }
          for (let i = 1; i < mindmap.edges.length; i++) {
            edges.push(mindmap.edges[i])
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

        return res.status(404).json({ message: 'Not Found.' })
    }

  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default MindMapAPI
