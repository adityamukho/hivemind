import Head from 'next/head'
import Link from 'next/link'
import React, { forwardRef, useCallback, useContext, useState } from 'react'
import { HelpCircle } from 'react-feather'
import NotificationAlert from 'react-notification-alert'
import {
  Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavLink, Row,
  Spinner
} from 'reactstrap'
import GlobalContext from '../GlobalContext'
import MainNav from './nav/MainNav'
import NavItemLogin from './nav/NavItemLogin'
import NavItemUser from './nav/NavItemUser'

const ForwardedNavbarBrand = forwardRef((props, ref) => <NavbarBrand href={ref} {...props}/>)

const Layout = ({ children }) => {
  const [isOpen, setOpen] = useState(false)
  const { pageVars } = useContext(GlobalContext)
  const notifyRef = useCallback((node) => {
    if (typeof window !== 'undefined') {
      if (node) {
        window.notify = node.notificationAlert.bind(node)
      }
      else {
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
        <link rel="apple-touch-icon" sizes="57x57" href="/img/logo/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/img/logo/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/img/logo/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/img/logo/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/img/logo/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/img/logo/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/img/logo/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/img/logo/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/img/logo/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192"
              href="/img/logo/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/img/logo/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/img/logo/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/img/logo/favicon-16x16.png"/>
        <link rel="manifest" href="/img/logo/manifest.json"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="msapplication-TileImage" content="/img/logo/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>
      <Navbar color="inverse" light expand="md" className="border-bottom mb-2">
        <Link href='/' passHref>
          <ForwardedNavbarBrand className="text-wrap">
            <img src="/img/logo/Logo.svg" style={{ height: '35px' }} alt="Logo"/>&nbsp;
          </ForwardedNavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle}/>
        <Collapse isOpen={isOpen} navbar>
          <MainNav/>
          <Nav className="ml-auto" navbar>
            <NavbarText>
              <Spinner type="grow" color="dark" id={'loading'} className={'invisible mx-2'}/>
            </NavbarText>
            <NavItemUser/>
            <Link href={'/help'} passHref>
              <NavLink><HelpCircle/></NavLink>
            </Link>
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
