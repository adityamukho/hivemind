import db from '../arangoWrapper'
import { aql } from 'arangojs'

async function hasPath (nid, userId, roles) {
  const query = aql`
    for p in outbound k_shortest_paths
    ${userId} to ${nid}
    graph 'mindmaps'
    
    filter p.edges[0].access in ${roles}
    
    limit 1
    
    collect with count into total
    
    return total
  `
  const cursor = await db.query(query)
  const count = await cursor.next()

  return !!count
}

export async function hasWriteAccess(nid, userId) {
  const [coll] = nid.split('/')
  const roles = []

  if (['mindmaps', 'access', 'nodes', 'links'].includes(coll)) {
    roles.push('admin')
  }

  if (['mindmaps', 'nodes', 'links'].includes(coll)) {
    roles.push('write')
  }

  return await hasPath(nid, userId, roles)
}

export async function hasDeleteAccess(nid, userId) {
  const [coll] = nid.split('/')
  const roles = []

  if (['mindmaps', 'access', 'nodes', 'links'].includes(coll)) {
    roles.push('admin')
  }

  if (['nodes', 'links'].includes(coll)) {
    roles.push('write')
  }

  if (!roles.length) {
    return false
  }

  return await hasPath(nid, userId, roles)
}