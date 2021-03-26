import { aql } from 'arangojs'
import { chain, isNil, isEmpty } from 'lodash'
import { hasWriteAccess } from '../../../utils/auth/access'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import { recordCompoundEvent } from '../../../utils/rgHelpers'

const { db, rg } = require('../../../utils/arangoWrapper')

const MindMapsAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const key = claims.uid
    const userId = `users/${key}`

    let mindmap, response, message

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
        mindmap = {
          name,
          isRoot: true,
          title: name,
          createdBy: userId
        }
        response = await rg.post('/document/mindmaps', mindmap)

        if (response.statusCode === 201) {
          mindmap = response.body

          const access = {
            _from: `users/${key}`,
            _to: mindmap._id,
            access: 'admin'
          }
          response = await rg.post('/document/access', access)
          if (response.statusCode === 201) {
            message = 'Mindmap created.'

            await recordCompoundEvent('created', userId, [mindmap])
          }
          else {
            message = response.body

            await rg.delete('/history/purge', { path: `/n/${mindmap._id}` },
              { silent: true, deleteUserObjects: true })
          }
        }
        else {
          message = response.body
        }

        return res.status(response.statusCode).json({ message })

      case 'PATCH':
        if (isEmpty(req.body._id)) {
          return res.status(400).json({message: 'Mindmap id is required'})
        }

        if (await hasWriteAccess(req.body._id, userId)) {
          mindmap = chain(req.body)
            .pick('summary', 'content', '_rev', '_id', 'title', 'name')
            .omitBy(isNil)
            .value()
          mindmap.lastUpdatedBy = userId

          response = await rg.patch('/document/mindmaps', mindmap,
            {
              keepNull: false,
              ignoreRevs: false
            })

          await recordCompoundEvent('updated', userId, [response.body])

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

export default MindMapsAPI
