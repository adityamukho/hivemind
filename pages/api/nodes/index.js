import { map } from 'lodash'
import db, { rg } from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import { hasWriteAccess, hasDeleteAccess } from '../../../utils/auth/access'
import { pick } from 'lodash'
import { aql } from 'arangojs'

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

        if (await hasWriteAccess(parentId, userId)) {
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
        }
        else {
          return res.status(401).json({ message: 'Access Denied.' })
        }

      case 'PATCH':
        if (await hasWriteAccess(req.body._id, userId)) {
          node = pick(req.body, 'summary', 'content', '_rev', '_id')
          node.lastUpdatedBy = userId

          response = await rg.patch('/document/nodes', node,
            {
              keepNull: false,
              ignoreRevs: false
            })

          return res.status(response.statusCode).json(response.body)
        }
        else {
          return res.status(401).json({ message: 'Access Denied.' })
        }

      case 'DELETE':
        if (await hasDeleteAccess(req.body._id, userId)) {
          let query = aql`
            return merge(
              let nodes = flatten(
                for v, e in 1..${Number.MAX_SAFE_INTEGER}
                outbound ${req.body._id}
                graph 'mindmaps'
                
                return (
                    for node in [v, e]
                    
                    return keep(node, '_id', '_key', '_rev')
                )
              )
              
              for node in nodes
              let idParts = parse_identifier(node)
              collect coll = idParts.collection aggregate n = unique(node)
              
              return {[coll]: n}
            )
          `
          let cursor = await db.query(query)
          const data = await cursor.next()

          let coll = req.body._id.split('/')[0]
          if (!data[coll]) {
            data[coll] = []
          }
          data[coll].unshift(pick(req.body, '_id', '_key', '_rev'))

          query = aql`
            for v, e, p in 1
            inbound ${req.body._id}
            graph 'mindmaps'
            
            filter !p.vertices[0].isRoot
            
            return keep(e, '_id', '_key', '_rev')
          `
          cursor = await db.query(query)
          if (cursor.hasNext) {
            const incoming = await cursor.next()

            coll = incoming._id.split('/')[0]
            if (!data[coll]) {
              data[coll] = []
            }
            data[coll].unshift(incoming)
          }

          const nKeys = {}
          for (const coll in data) {
            const nodes = data[coll]
            nKeys[coll] = []
            nKeys[coll].push(...map(nodes, '_key'))

            response = await rg.delete(`/document/${coll}`, nodes, {
              ignoreRevs: false,
              silent: true
            })

            if (response.statusCode !== 200) {
              const path = createNodeBracepath(nKeys)
              await rg.post('/document/_restore', { path }, { silent: true })

              break
            }
          }

          return res.status(200).json({ message: 'Nodes deleted.' })
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

export default NodesAPI
