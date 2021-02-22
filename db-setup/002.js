const { db } = require('./init')
const { map, difference } = require('lodash')

const documentCollections = [{
  name: 'compound_events',
  indexes: [
    {
      type: 'persistent',
      fields: ['mid'],
      name: 'mid'
    }
  ]
}]

module.exports = new Promise(resolve => {
  db.listCollections().then(collections => {
    const collNames = map(collections, 'name')
    const docCollNames = map(documentCollections, 'name')
    const creates = []

    for (const coll of difference(docCollNames, collNames)) {
      const create = db.createCollection(coll).then(c => {
        const { name } = c
        console.log(`Created document collection ${name}`)
      })

      creates.push(create)
    }

    Promise.all(creates).then(() => {
      const indexDefs = []

      for (const entry of documentCollections) {
        const coll = db.collection(entry.name)
        for (const index of entry.indexes) {
          indexDefs.push(coll.ensureIndex(index).then(
            () => console.log(`Ensured index '${index.name}' on collection '${coll.name}'`)))
        }
      }

      Promise.all(indexDefs).then(resolve)
    })
  })
})