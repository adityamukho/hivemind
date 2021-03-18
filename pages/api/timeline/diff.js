import { hasReadAccess } from '../../../utils/auth/access'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'
import { patch } from 'jiff'
import { chain, isNull, findIndex } from 'lodash'
import {createNodeBracePath} from '../../../utils/rgHelpers'

const { db, rg } = require('../../../utils/arangoWrapper')
const compoundEvents = db.collection(`compound_events`)

async function getReversedDiff (nid, eid, fctime, lctime) {
  const until = lctime + 0.0001
  const response = await rg.get('/event/diff',
    { path: `/n/${nid}`, reverse: true, since: fctime, until })
  const result = response.body[0]
  const idx = findIndex(result.events, { _id: eid })

  return result.commands[idx]
}

async function getReversedDiffs (nids, eids, fctime, lctime) {
  const until = lctime + 0.0001
  const nKeys = {}

  for (const nid of nids) {
    const [coll, key] = nid.split('/')
    if (!nKeys[coll]) {
      nKeys[coll] = []
    }
    nKeys[coll].push(key)
  }
  const path = createNodeBracePath(nKeys)

  const response = await rg.get('/event/diff',
    { path, reverse: true, since: fctime, until })
  const result = response.body
  const commands = []

  for (let i = 0; i < eids.length; ++i) {
    const idx = findIndex(result[i].events, { _id: eids[i] })
    commands.push(result[i].commands[idx])
  }

  return commands
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
    const { mid, event, fctime, lctime, nids, eids } = cEvent
    if (await hasReadAccess(mid, userId)) {
      switch (req.method) {
        case 'GET':
          const output = {}

          switch (event) {
            case 'created':
            case 'restored':
              output.v1 = {}
              nid = nids.find(nid => nid.startsWith('nodes/')) || mid
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp: lctime })
              output.v2 = response.body[0]

              break

            case 'deleted':
              const indexes = chain(nids)
                .map((nid, idx) => /^(nodes|mindmaps)\//.test(nid) ? idx : null)
                .reject(isNull)
                .value()
              output.v2 = indexes.map(() => ({}))

              const filteredNids = nids.filter((nid, idx) => indexes.includes(idx))
              const filteresEids = eids.filter((eid, idx) => indexes.includes(idx))
              diff = await getReversedDiffs(filteredNids, filteresEids, fctime, lctime)
              output.v1 = diff.map(d => patch(d, {}))

              break

            case 'updated':
              nid = nids[0]
              response = await rg.get('/history/show', { path: `/n/${nid}`, timestamp: lctime })
              output.v2 = response.body[0]

              diff = await getReversedDiff(nid, eids[0], fctime, lctime)
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
