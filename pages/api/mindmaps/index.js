import { aql } from 'arangojs'
import db, { rg } from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

const MindMapsAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const key = claims.uid
    const userId = `users/${key}`

    switch (req.method) {
      case 'GET':
        const query = aql`
          for v, e in 1
          outbound ${userId}
          graph 'mindmaps'
          
          return { mindmap: v, access: e }
        `
        const cursor = await db.query(query)
        const mindmaps = await cursor.all()

        return res.status(200).json(mindmaps)

      case 'POST':
        const { name } = req.body
        let mindmap = { name, isRoot: true, title: name }
        let response = await rg.post('/document/mindmaps', mindmap)
        mindmap = response.body

        const access = {
          _from: `users/${key}`,
          _to: mindmap._id,
          access: 'admin'
        }
        await rg.post('/document/access', access)

        return res.status(201).json({ message: 'Mindmap created.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default MindMapsAPI
