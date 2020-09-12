import Link from 'next/link'
import React from 'react'
import AuthPrompt from '../components/auth/AuthPrompt'
import { useUser } from '../utils/auth/useUser'
import fetchWrapper from '../utils/fetchWrapper'

const Index = () => {
  const { user, logout } = useUser()
  const { data, error } = fetchWrapper(user, '/api/getFood')

  if (!user) {
    return <AuthPrompt/>
  }

  return (
    <div>
      <div>
        <p>You're signed in. Email: {user.email}</p>
        <p
          style={{
            display: 'inline-block',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={() => logout()}
        >
          Log out
        </p>
      </div>
      <div>
        <Link href={'/example'}>
          <a>Another example page</a>
        </Link>
      </div>
      {error && <div>Failed to fetch food!</div>}
      {data && !error ? (
        <div>Your favorite food is {data.food}.</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Index
