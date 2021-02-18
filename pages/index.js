import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Spinner } from 'reactstrap'
import { useUser } from '../utils/auth/useUser'
import AuthPrompt from '../components/auth/AuthPrompt'

const Page = () => {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/mmaps')
    }
  }, [user])

  return (typeof user === 'undefined') ? <Spinner/> : (user ? <p>Redirecting...</p> : <AuthPrompt/>)
}

export default Page