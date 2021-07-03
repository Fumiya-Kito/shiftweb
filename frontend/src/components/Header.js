import React, { useState, useEffect } from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useLoginStore, useLoginDispatch, useProfileDispatch, useShiftDispatch, useShiftStore } from '../context'
import { logout } from '../actions/userActions'
import { SHIFT_RESET } from '../constants/shiftConstants'


function Header() {
    const state = useLoginStore()
    const loginDispatch = useLoginDispatch()
    const { userInfo, loading } = state
    const shiftDispatch = useShiftDispatch()
    const shiftState = useShiftStore()
    const { isSubmitted } = shiftState

    const logoutHandler = () => {
        // logout(loginDispatch, profileDispatch)
        logout(loginDispatch)
        shiftDispatch({type: SHIFT_RESET})
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' collapseOnSelect>
                <Container>
                    <Navbar.Brand>Shift Web</Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />  */}
                        <Nav className='mr-auto p-1'>

                            <LinkContainer to='/'>
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username' className='px-4'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>                        
                                    <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
