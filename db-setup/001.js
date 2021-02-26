const { db } = require('./init')
const { map, difference, get } = require('lodash')

const documentCollections = [
  {
    name: 'compound_events',
    indexes: [
      {
        type: 'persistent',
        fields: ['mid'],
        name: 'mid'
      }
    ]
  },
  { name: 'mindmaps' },
  { name: 'nodes' },
  { name: 'users' }
]

const edgeCollections = [
  { name: 'access' },
  { name: 'links' }
]

module.exports = db.listCollections()
  .then(collections => {
    const collNames = map(collections, 'name')
    const docCollNames = map(documentCollections, 'name')
    const edgeCollNames = map(edgeCollections, 'name')
    const creates = []

    for (const coll of difference(docCollNames, collNames)) {
      const create = db.createCollection(coll)
        .then(c => console.log(`Created document collection ${c.name}.`))

      creates.push(create)
    }

    for (const coll of difference(edgeCollNames, collNames)) {
      const create = db.createEdgeCollection(coll)
        .then(c => console.log(`Created document collection ${c.name}.`))

      creates.push(create)
    }

    return creates
  })
  .then(creates => Promise.all(creates))
  .then(() => {
    const indexDefs = []

    for (const entry of documentCollections.concat(edgeCollections)) {
      const coll = db.collection(entry.name)
      for (const index of get(entry, ['indexes'], [])) {
        indexDefs.push(coll.ensureIndex(index).then(
          () => console.log(`Ensured index '${index.name}' on collection '${coll.name}'.`)))
      }
    }

    return indexDefs
  })
  .then(indexDefs => Promise.all(indexDefs))
  .then(() => console.log('Finished creating collections and indexes.\n'))