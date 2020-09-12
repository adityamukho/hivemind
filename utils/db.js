import firebase from 'firebase/app'
import '../utils/initFirebase'

const database = firebase.database()

export async function saveUser (userData) {
  return database.ref(`/users/${userData.id}/email`).set(userData.email)
}

export function getMindMaps(userId) {
  return database.ref(`/users/${userId}/maps`).once('value')
    .then(snapshot => snapshot.val() || {})
}

export function createMindMap(userId, name) {
  return database.ref(`/users/${userId}/maps`).push({
    name,
    ctime: new Date().getTime()
  })
}