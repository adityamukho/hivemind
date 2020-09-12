import { rg } from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

const NodesAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const key = claims.uid
    const userId = `users/${key}`

    switch (req.method) {
      case 'POST':
        const { title } = req.body
        const { parentId } = req.query
        let node = { title, createdBy: userId }
        let response = await rg.post('/document/nodes', node)
        node = response.body

        const link = {
          _from: parentId,
          _to: node._id,
          createdBy: userId
        }
        await rg.post('/document/links', link)

        return res.status(201).json({ message: 'Node created.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default NodesAPI
