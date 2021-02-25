import { aql } from 'arangojs'

const { db } = require('../arangoWrapper')

const skeletonGraph = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton`
const skeletonVertices = `${process.env.ARANGO_SVC_MOUNT_POINT}_skeleton_vertices`

async function hasPath (nid, userId, roles) {
  const query = aql`
    for v, e in outbound shortest_path
    ${userId} to ${nid}
    graph 'mindmaps'
    
    filter e.access in ${roles}
    
    return 1
  `
  const cursor = await db.query(query)

  return cursor.hasNext
}

async function hasHistoricPath (nid, userId, roles) {
  const svid = `${skeletonVertices}/${userId.replace('/', '.')}`
  const evid = `${skeletonVertices}/${nid.replace('/', '.')}`
  const query = aql`
    for v, e in outbound shortest_path
    ${svid} to ${evid}
    graph ${skeletonGraph}
    
    filter v._key like 'mindmaps%'
    
    return v.meta.id
  `
  const cursor = await db.query(query)
  if (cursor.hasNext) {
    const mid = cursor.next()

    return await hasPath(mid, userId, roles)
  }

  return false
}

export async function hasWriteAccess (nid, userId) {
  const [coll] = nid.split('/')
  const roles = []

  if (['mindmaps', 'nodes'].includes(coll)) {
    roles.push('admin', 'write')
  }

  if (!roles.length) {
    return false
  }

  return await hasPath(nid, userId, roles)
}

export async function hasDeleteAccess (nid, userId) {
  const [coll] = nid.split('/')
  const roles = []

  if (['mindmaps', 'nodes'].includes(coll)) {
    roles.push('admin')
  }

  if (['nodes'].includes(coll)) {
    roles.push('write')
  }

  if (!roles.length) {
    return false
  }

  return await hasPath(nid, userId, roles)
}

export async function hasReadAccess (nid, userId) {
  const [coll] = nid.split('/')
  const roles = []

  if (['mindmaps', 'nodes'].includes(coll)) {
    roles.push('admin', 'write', 'read')
  }

  if (!roles.length) {
    return false
  }

  return await hasHistoricPath(nid, userId, roles)
}