import Link from 'next/link'
import React from 'react'

const AuthPrompt = () => (
  <>
    <p>Hi there!</p>
    <p>
      You are not signed in.{' '}
      <Link href={'/auth'}>
        <a>Sign in</a>
      </Link>
    </p>
  </>
)

export default AuthPrompt