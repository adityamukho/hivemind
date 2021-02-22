const { db } = require('./init')
const { map, difference } = require('lodash')

const documentCollections = ['mindmaps', 'nodes', 'users']
const edgeCollections = ['access', 'links']

db.listCollections().then(collections => {
  const collNames = map(collections, 'name')

  for (const coll of difference(documentCollections, collNames)) {
    db.createCollection(coll).then(c => console.log(`Created document collection ${c.name}`))
  }

  for (const coll of difference(edgeCollections, collNames)) {
    db.createEdgeCollection(coll).then(c => console.log(`Created edge collection ${c.name}`))
  }
})