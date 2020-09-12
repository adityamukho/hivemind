const { Database } = require('arangojs')

const db = new Database({
  url: `http://${process.env.ARANGO_HOST}:${process.env.ARANGO_PORT}`,
  arangoVersion: 30603,
  databaseName: process.env.ARANGO_DB,
  auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PASSWORD },
  precaptureStackTraces: true
})

export default db
export const rg = db.route(process.env.ARANGO_SVC_MOUNT_POINT)
