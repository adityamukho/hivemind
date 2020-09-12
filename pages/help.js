import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <p>
        This page is static because it does not fetch any data or include the
        authed user info.
      </p>
      <Link href={'/'}>
        <a>Home</a>
      </Link>
    </div>
  )
}

export default Page
