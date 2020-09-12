import Head from 'next/head'
import Link from 'next/link'
import React, { Component } from 'react'
import { GitHub, HelpCircle } from 'react-feather'
import { Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavLink, Row } from 'reactstrap'
import NavItemLogin from './nav/NavItemLogin'
import NavItemUser from './nav/NavItemUser'

class Layout extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <Container fluid>
        <Head>
          <script type="text/javascript" src='/js/pace.min.js'></script>
        </Head>
        <Navbar color="inverse" light expand="md" className="border-bottom mb-2">
          <Link href='/' passHref>
            <NavbarBrand className="text-wrap">{this.props.title}</NavbarBrand>
          </Link>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
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
          <Row>
            <Col>
              {this.props.children}
            </Col>
          </Row>
        </Container>
      </Container>
    )
  }
}

export default Layout
