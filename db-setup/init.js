const { resolve } = require('path')
const { config } = require('dotenv')
const { Database } = require('arangojs')

config({ path: resolve(process.cwd(), '.env.local') })
const {
  ARANGO_PROTOCOL: protocol = 'http',
  ARANGO_HOST: host,
  ARANGO_PORT: port,
  ARANGO_DB: databaseName,
  ARANGO_USER: username,
  ARANGO_PASSWORD: password,
} = process.env
const db = new Database({
  url: `${protocol}://${host}:${port}/`,
  arangoVersion: 30603,
  databaseName,
  auth: { username, password: password.replaceAll('\\', '') },
  precaptureStackTraces: true,
})

exports.db = db
exports.rg = db.route(process.env.ARANGO_SVC_MOUNT_POINT)
