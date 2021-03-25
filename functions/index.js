const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Database } = require("arangojs");

admin.initializeApp();

const { arango } = functions.config();
const {
  protocol = "http",
  host,
  port,
  username,
  password,
  databaseName,
} = arango;
const db = new Database({
  url: `${protocol}://${host}:${port}`,
  arangoVersion: 30603,
  databaseName,
  auth: { username, password },
  precaptureStackTraces: true,
});
const rg = db.route(arango.svc.mount);

exports.createArangoUser = functions.auth.user().onCreate((user) => {
  const arangoUser = user.toJSON()
  arangoUser._key = user.uid

  return rg.post('/document/users', arangoUser)
    .then(response => console.log('Successfully wrote user: %o', response.body))
})
