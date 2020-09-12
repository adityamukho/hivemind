import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { GitHub, HelpCircle } from 'react-feather'
import NotificationAlert from 'react-notification-alert'
import { Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavLink, Row } from 'reactstrap'
import GlobalContext from '../GlobalContext'
import MainNav from './nav/MainNav'
import NavItemLogin from './nav/NavItemLogin'
import NavItemUser from './nav/NavItemUser'

const ForwardedNavbarBrand = React.forwardRef(
  (props, ref) => <NavbarBrand href={ref} {...props}/>
  )

const Layout = ({ title, children }) => {
  const [isOpen, setOpen] = useState(false)
  const { notify, pageTitle } = useContext(GlobalContext)

  function toggle () {
    setOpen(!isOpen)
  }

  return (
    <Container fluid>
      <Head>
        <script type="text/javascript" src='/js/pace.min.js'/>
        <title>{pageTitle}</title>
      </Head>
      <Navbar color="inverse" light expand="md" className="border-bottom mb-2">
        <Link href='/' passHref>
          <ForwardedNavbarBrand className="text-wrap">{title}</ForwardedNavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle}/>
        <Collapse isOpen={isOpen} navbar>
          <MainNav/>
          <Nav className="ml-auto" navbar>
            <NavItemUser/>
            <Link href={'/help'} passHref>
              <NavLink><HelpCircle/></NavLink>
            </Link>
            <NavLink href='https://github.com/adityamukho/next.js-firebase-template' target='_blank'>
              <GitHub/>
            </NavLink>
            <NavItemLogin/>
          </Nav>
        </Collapse>
      </Navbar>
      <Container fluid>
        <NotificationAlert ref={notify}/>
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </Container>
    </Container>
  )
}

export default Layout
