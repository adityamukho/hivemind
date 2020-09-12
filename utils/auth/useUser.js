import firebase from 'firebase/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { saveUser } from '../db'
import '../initFirebase'
import { mapUserData } from './mapUserData'
import { getUserFromCookie, removeUserCookie, setUserCookie } from './userCookies'

const useUser = () => {
  const [user, setUser] = useState()
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

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        const userData = mapUserData(user)
        setUserCookie(userData)
        setUser(userData)
        saveUser(userData)
      }
      else {
        removeUserCookie()
        setUser()
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      router.push('/')
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, logout }
}

export { useUser }
