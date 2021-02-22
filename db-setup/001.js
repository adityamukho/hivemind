const { db } = require('./init')
const { map, difference } = require('lodash')

const documentCollections = ['mindmaps', 'nodes', 'users']
const edgeCollections = ['access', 'links']

module.exports = new Promise(resolve => {
  db.listCollections().then(collections => {
    const collNames = map(collections, 'name')
    const creates = []

    for (const coll of difference(documentCollections, collNames)) {
      const create = db.createCollection(coll).then(
        c => console.log(`Created document collection ${c.name}`))
      creates.push(create)
    }

    for (const coll of difference(edgeCollections, collNames)) {
      db.createEdgeCollection(coll).then(c => console.log(`Created edge collection ${c.name}`))
      creates.push(create)
    }

    Promise.all(creates).then(resolve)
  })
})
