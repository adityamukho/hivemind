import { aql } from 'arangojs'
import { hasReadAccess } from '../../../utils/auth/access'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

const { db } = require('../../../utils/arangoWrapper')

const EventsAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    const { key } = req.query

    switch (req.method) {
      case 'GET':
        const mid = `mindmaps/${key}`

        if (await hasReadAccess(mid, userId)) {
          const query = aql`
            for e in compound_events
            filter e.mid == ${mid}
            sort e.lctime asc

            return e
          `
          const cursor = await db.query(query)

          return res.status(200).json(await cursor.all())
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
