const { db } = require('./init')

const mindmaps = db.graph('mindmaps')

module.exports = mindmaps
  .exists()
  .then((exists) => {
    let check
    if (exists) {
      check = mindmaps.drop()
    } else {
      check = Promise.resolve()
    }

    return check
  })
  .then(() =>
    mindmaps.create([
      {
        collection: 'access',
        from: ['users'],
        to: ['mindmaps'],
      },
      {
        collection: 'links',
        from: ['mindmaps', 'nodes'],
        to: ['nodes'],
      },
    ])
  )
  .then(() => console.log("Finished creating graph 'mindmaps'.\n"))
