import Link from 'next/link'
import Head from 'next/head'
import React, { Component } from 'react'
import { Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, Row } from 'reactstrap'
import NavItemLogin from './NavItemLogin'

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
          <script type="text/javascript" src='/js/polyfills.js'></script>
        </Head>
        <Navbar
          color="inverse"
          light
          expand="md"
          className="border-bottom mb-2"
        >
          <Link href='/' passHref>
            <NavbarBrand className="text-wrap">
              {this.props.title}
              <span
                className="spinner-grow mx-2 text-danger invisible"
                role="status"
                id="loading"
              >
              <span className="sr-only">Loading...</span>
            </span>
            </NavbarBrand>
          </Link>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
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
