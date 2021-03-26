import Link from 'next/link'
import React from 'react'
import { Nav, NavItem, NavLink, Spinner } from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'

const navItems = {
  auth: [
    <NavItem key='mmaps'>
      <Link href={'/mmaps'} passHref><NavLink>Mind Maps</NavLink></Link>
    </NavItem>
  ],
  anon: [],
  unknown: [<Spinner key={'loading'}/>]
}

const MainNav = () => {
  const { user } = useUser()

  return (typeof user === 'undefined') ?
    <Nav className="mr-auto" navbar>{navItems.unknown}</Nav> :
    (user ?
        <Nav className="mr-auto" navbar>{navItems.anon.concat(navItems.auth)}</Nav> :
        <Nav className="mr-auto" navbar>{navItems.anon}</Nav>
    )
}

export default MainNav