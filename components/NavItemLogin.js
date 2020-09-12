import Link from 'next/link'
import React from 'react'
import { LogIn, LogOut } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'
import { useUser } from '../utils/auth/useUser'

const NavItemLogin = () => {
  const { user, logout } = useUser()

  if (!user) {
    return <NavItem>
      <Link href={'/auth'} passHref>
        <NavLink>Login <LogIn/></NavLink>
      </Link>
    </NavItem>
  }

  console.log(user)

  return <NavItem>
    <NavLink href={'#'} onClick={() => logout()}>({user.email}) Logout <LogOut/></NavLink>
  </NavItem>
}

export default NavItemLogin