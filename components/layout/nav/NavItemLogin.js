import Link from 'next/link'
import React from 'react'
import { LogIn, LogOut } from 'react-feather'
import { NavbarText, NavItem, NavLink, Spinner } from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'

const NavItemLogin = () => {
  const { user, logout } = useUser()

  return (typeof user === 'undefined') ? <NavItem>
    <NavbarText><Spinner size={'sm'}/></NavbarText>
  </NavItem> : (user ?
      <NavItem><NavLink href={'#'} onClick={logout}><LogOut/></NavLink></NavItem> :
      <NavItem>
        <Link href={'/auth'} passHref>
          <NavLink><LogIn/></NavLink>
        </Link>
      </NavItem>
  )
}

export default NavItemLogin