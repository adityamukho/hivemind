const { db } = require('./init')

module.exports = new Promise(resolve => {
  const mindmaps = db.graph('mindmaps')
  mindmaps.exists().then(exists => {
    let check
    if (exists) {
      check = mindmaps.drop()
    }
    else {
      check = Promise.resolve()
    }

    return check
  }).then(() => {
    mindmaps.create([
      {
        collection: 'access',
        from: ['users'],
        to: ['mindmaps']
      },
      {
        collection: 'links',
        from: ['mindmaps', 'nodes'],
        to: ['nodes']
      }
    ]).then(() => {
      console.log('Created graph \'mindmaps\'.')
      resolve()
    })
  })
})


