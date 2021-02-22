import { aql } from 'arangojs'
import db, { rg } from '../../../utils/arangoWrapper'
import { hasReadAccess } from '../../../utils/auth/access'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import { inverse, patch } from 'jiff'

const commands = db.collection(`${process.env.ARANGO_SVC_MOUNT_POINT}_commands`)

async function getReversedDiff (eid) {
  const query = aql`
    for e in ${commands}
    filter e._to == ${eid}
    
    return e.command
  `
  const cursor = await db.query(query)
  const command = await cursor.next()

  return inverse(command)
}

const DiffAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    let response, diff
    const { nid, eid, timestamp, event } = req.query

    if (await hasReadAccess(nid, userId)) {
      switch (req.method) {
        case 'GET':
          const output = {}

          switch (event) {
            case 'created':
            case 'restored':
              output.v1 = {}
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp })
              output.v2 = response.body[0]

              break

            case 'deleted':
              output.v2 = {}
              diff = await getReversedDiff(eid)
              output.v1 = patch(diff, {})

              break

            case 'updated':
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp })
              output.v2 = response.body[0]

              diff = await getReversedDiff(eid)
              output.v1 = patch(diff, response.body[0])
          }

          return res.status(200).json(output)
      }
    }
    else {
      return res.status(401).json({ message: 'Access Denied.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)

    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default DiffAPI
