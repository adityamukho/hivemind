import firebase from 'firebase/app'
import '../utils/initFirebase'

const database = firebase.database()

export async function saveUser (userData) {
  return database.ref(`/users/${userData.id}/email`).set(userData.email)
}