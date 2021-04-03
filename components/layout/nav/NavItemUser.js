import React from 'react'
import { NavbarText, NavItem, Spinner } from "reactstrap";
import { useUser } from '../../../utils/auth/useUser'

const NavItemUser = () => {
  const { user } = useUser()

  return typeof user === 'undefined' ? (
    <NavItem>
      <NavbarText>
        <Spinner size={'sm'} />
      </NavbarText>
    </NavItem>
  ) : user ? (
    <NavItem>
      <NavbarText>{user.email}</NavbarText>
    </NavItem>

  ) : null
}

export default NavItemUser
