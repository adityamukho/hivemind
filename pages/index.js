import React from 'react'
import AuthPrompt from '../components/auth/AuthPrompt'
import { useUser } from '../utils/auth/useUser'
import fetchWrapper from '../utils/fetchWrapper'

const MindMaps = () => {
  const { user } = useUser()
  const { data, error } = fetchWrapper(user, '/api/getFood')

  if (!user) {
    return <AuthPrompt/>
  }

  return <>
    {error && <div>Failed to fetch food!</div>}
    {data && !error ? (
      <div>Your favorite food is {data.food}.</div>
    ) : (
      <div>Loading...</div>
    )}
  </>
}

export default MindMaps