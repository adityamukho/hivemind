import React from 'react'
import { NavbarText, Spinner } from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'

const NavItemUser = () => {
  const { user } = useUser()

  return (typeof user === 'undefined') ? <NavbarText><Spinner size={'sm'}/></NavbarText> : user ?
    <NavbarText>{user.email}</NavbarText> : null
}

export default NavItemUser