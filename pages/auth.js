import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Spinner } from 'reactstrap'
import FirebaseAuth from '../components/auth/FirebaseAuth'
import { useUser } from '../utils/auth/useUser'

const Page = () => {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  return typeof user === 'undefined' ? (
    <Spinner />
  ) : user ? (
    <p>Redirecting...</p>
  ) : (
    <FirebaseAuth />
  )
}

export default Page
