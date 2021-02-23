const tasks = []
tasks.push(require('./001'))
tasks.push(require('./002'))
tasks.push(require('./003'))

Promise.all(tasks).then(() => console.log('Finished DB setup.'))