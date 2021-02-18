import firebase from 'firebase/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../initFirebase'
import mapUserData from './mapUserData'
import useSWR from 'swr'

function getUser (cancelListeners) {
  return new Promise(resolve => {
    const cancelAuthListener = firebase.auth()
      .onAuthStateChanged(user => user ? mapUserData(user).then(
        userData => resolve(userData)) : resolve(null))

    cancelListeners.push(cancelAuthListener)
  })
}

const useUser = () => {
  // TODO: Probably Hacky! Find a better way to get a per-invocation array.
  const [cancelListeners] = useState([])

  const { data: user, error, mutate } = useSWR('user', () => getUser(cancelListeners))
  const router = useRouter()

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to authenticate user!',
      type: 'danger',
      autoDismiss: 7
    }

    window.notify(options)
  }

  const logout = () => {
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
    const cancelIdTokenListener = firebase.auth()
      .onIdTokenChanged(user => mutate(mapUserData(user), false))
    cancelListeners.push(cancelIdTokenListener)

    return () => {
      cancelListeners.forEach(cancelListener => cancelListener())
    }
  }, [])

  return { user, logout }
}

export { useUser }
