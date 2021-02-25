import { aql } from 'arangojs'
import { hasReadAccess } from '../../../utils/auth/access'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import { inverse, patch } from 'jiff'
import { get, chain, isNull } from 'lodash'

const { db, rg } = require('../../../utils/arangoWrapper')

const commands = db.collection(`${process.env.ARANGO_SVC_MOUNT_POINT}_commands`)
const compoundEvents = db.collection(`compound_events`)

async function getReversedDiff (eid) {
  const command = await commands.firstExample({ _to: eid })

  return inverse(command.command)
}

async function getReversedDiffs (eids) {
  console.log(eids)
  const query = aql`
    for e in ${commands}
    filter e._to in ${eids}
    
    return e.command
  `
  const cursor = await db.query(query)
  const cmds = await cursor.all()

  console.log(cmds)

  return cmds.map(inverse)
}

const DiffAPI = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const ukey = claims.uid
    const userId = `users/${ukey}`
    let response, diff, nid
    const { eid } = req.query

    const cEvent = await compoundEvents.document(eid)
    const { mid, event, lctime: timestamp, nids, eids } = cEvent
    if (await hasReadAccess(mid, userId)) {
      switch (req.method) {
        case 'GET':
          const output = {}

          switch (event) {
            case 'created':
            case 'restored':
              output.v1 = {}
              nid = nids.find(nid => nid.startsWith('nodes/')) || mid
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp })
              output.v2 = response.body[0]

              break

            case 'deleted':
              const indexes = chain(nids)
                .map((nid, idx) => /^(nodes|mindmaps)\//.test(nid) ? idx : null)
                .reject(isNull)
                .value()
              output.v2 = indexes.map(() => ({}))
              diff = await getReversedDiffs(eids.filter((eid, idx) => indexes.includes(idx)))
              output.v1 = diff.map(d => patch(d, {}))

              break

            case 'updated':
              nid = get(nids, [0], mid)
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp })
              output.v2 = response.body[0]

              diff = await getReversedDiff(eids[0])
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
