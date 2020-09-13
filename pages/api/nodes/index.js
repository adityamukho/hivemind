import { map } from 'lodash'
import { rg } from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

function createNodeBracepath (nKeys) {
  const pathSegments = map(nKeys, (keys, coll) => {
    let pathSegment = `${coll}/`

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

const NodesAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const key = claims.uid
    const userId = `users/${key}`
    const { title } = req.body
    let node, response, message

    switch (req.method) {
      case 'POST':
        const { parentId } = req.query
        node = { title, createdBy: userId }
        response = await rg.post('/document/nodes', node)

        if (response.statusCode === 201) {
          node = response.body

          const link = {
            _from: parentId,
            _to: node._id,
            createdBy: userId
          }
          response = await rg.post('/document/links', link, { silent: true })
          message = response.statusCode === 201 ? 'Node created.' : response.body

        }
        else {
          message = response.body
        }

        return res.status(response.statusCode).json({ message })

      case 'PATCH':
        const { summary, content, _rev, _id } = req.body
        node = {
          _id,
          title,
          summary,
          content,
          _rev,
          lastUpdatedBy: userId
        }

        response = await rg.patch('/document/nodes', node,
          {
            keepNull: false,
            ignoreRevs: false
          })

        return res.status(response.statusCode).json(response.body)

      case 'DELETE':
        const data = req.body
        const nKeys = {}

        for (const coll in data) {
          const nodes = data[coll]
          nKeys[coll] = []
          nKeys[coll].push(...map(nodes, '_key'))

          response = await rg.delete(`/document/${coll}`, nodes, { ignoreRevs: false, silent: true })
          if (response.statusCode !== 200) {
            const path = createNodeBracepath(nKeys)
            await rg.post('/document/_restore', { path }, { silent: true })

            break
          }
        }

        return res.status(200).json({ message: 'Nodes deleted.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default NodesAPI
