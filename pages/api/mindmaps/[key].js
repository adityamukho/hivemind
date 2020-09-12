import { aql } from 'arangojs'
import db from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

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
          
          return { v, e }
        `
        const cursor = await db.query(query)
        const mindmap = await cursor.all()
        if (mindmap.length) {
          return res.status(200).json(mindmap)
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
