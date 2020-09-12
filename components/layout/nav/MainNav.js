import Link from 'next/link'
import React from 'react'
import { NavItem, NavLink, Nav } from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'

const navItems = {
  auth: [
    <NavItem key='mmaps'>
      <Link href={'/mmaps'} passHref><NavLink>Mind Maps</NavLink></Link>
    </NavItem>
  ],
  anon: [
  ]
}

const MainNav = () => {
  const { user } = useUser()

  if (user) {
    return <Nav className="mr-auto" navbar>{navItems.anon.concat(navItems.auth)}</Nav>
  }

  return <Nav className="mr-auto" navbar>{navItems.anon}</Nav>
}

export default MainNav