import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useUser } from '../utils/auth/useUser'

const Index = () => {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    } else {
      router.replace('/mmaps')
    }
  }, [user])

  return <p>Redirecting...</p>
}

export default Index