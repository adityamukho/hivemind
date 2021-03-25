const { Database } = require('arangojs')
const {
  ARANGO_PROTOCOL: protocol = "http",
  ARANGO_HOST: host,
  ARANGO_PORT: port,
  ARANGO_DB: databaseName,
  ARANGO_USER: username,
  ARANGO_PASSWORD: password,
} = process.env;
const db = new Database({
  url: `${protocol}://${host}:${port}/`,
  arangoVersion: 30603,
  databaseName,
  auth: { username, password },
  precaptureStackTraces: true
})
exports.db = db
exports.rg = db.route(process.env.ARANGO_SVC_MOUNT_POINT)