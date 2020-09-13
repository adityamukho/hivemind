import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useState, forwardRef, useCallback } from 'react'
import { GitHub, HelpCircle } from 'react-feather'
import NotificationAlert from 'react-notification-alert'
import { Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavLink, Row } from 'reactstrap'
import GlobalContext from '../GlobalContext'
import MainNav from './nav/MainNav'
import NavItemLogin from './nav/NavItemLogin'
import NavItemUser from './nav/NavItemUser'

const ForwardedNavbarBrand = forwardRef((props, ref) => <NavbarBrand href={ref} {...props}/>)

const Layout = ({ title, children }) => {
  const [isOpen, setOpen] = useState(false)
  const { pageVars } = useContext(GlobalContext)
  const notifyRef = useCallback((node) => {
    if (typeof window !== 'undefined') {
      if (node) {
        window.notify = node.notificationAlert.bind(node)
      } else {
        window.notify = null
      }
    }
  }, [])

  function toggle () {
    setOpen(!isOpen)
  }

  return (
    <Container fluid>
      <Head>
        <script type="text/javascript" src='/js/pace.min.js'/>
        <title>{pageVars.title}</title>
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
            <NavLink href='https://github.com/adityamukho/hivemind' target='_blank'>
              <GitHub/>
            </NavLink>
            <NavItemLogin/>
          </Nav>
        </Collapse>
      </Navbar>
      <Container fluid>
        <NotificationAlert ref={notifyRef}/>
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
