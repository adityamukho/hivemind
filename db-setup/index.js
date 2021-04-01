const tasks = ['./001', './002', './003']

tasks
  .reduce(
    (prev, current) => prev.then(() => require(current)),
    Promise.resolve()
  )
  .then(() => console.log('Finished DB setup.'))
