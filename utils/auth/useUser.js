import firebase from 'firebase/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../initFirebase'
import mapUserData, { mapCachedUserData } from './mapUserData'

const useUser = () => {
  const [user, setUser] = useState(mapCachedUserData(firebase.auth().currentUser))
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/auth')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() =>
    firebase.auth().onIdTokenChanged(async (user) => {
      const userData = await mapUserData(user)
      setUser(userData)
    }), [])

  return { user, logout }
}

export { useUser }
