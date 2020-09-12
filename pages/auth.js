import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useUser } from '../utils/auth/useUser'
import FirebaseAuth from '../components/auth/FirebaseAuth'

const Page = () => {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  return user ? <p>Redirecting...</p> : <FirebaseAuth/>
}

export default Page
