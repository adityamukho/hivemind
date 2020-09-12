import React from 'react'
import { NavbarText } from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'

const NavItemUser = () => {
  const { user } = useUser()

  return  user ? <NavbarText>{`${user.email} | `}</NavbarText> : null
}

export default NavItemUser