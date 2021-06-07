import React, { useState, useEffect } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


function Header() {
    return (
        <header>
            <Navbar bg='dark' variant='dark'>
                <Container>
                    <Navbar.Brand>Header</Navbar.Brand>
                    <Nav className='mr-auto p-1'>
                        <LinkContainer to='/home'>
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/feture'>
                            <Nav.Link>Features</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/pricing'>
                            <Nav.Link>Pricing</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/comfirm'>
                            <Nav.Link>Comfirm</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
