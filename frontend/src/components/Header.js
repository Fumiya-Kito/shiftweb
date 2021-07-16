import React from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useLoginStore, useLoginDispatch, useProfileDispatch, useShiftDispatch, useProfileStore } from '../context'
import { logout } from '../actions/userActions'
import { SHIFT_RESET } from '../constants/shiftConstants'
import { USER_PROFILE_RESET } from '../constants/userConstants'


function Header() {
    const state = useLoginStore()
    const loginDispatch = useLoginDispatch()
    const { userInfo } = state
    const shiftDispatch = useShiftDispatch()
    const profileState = useProfileStore()
    const {profile} = profileState
    const profileDispatch = useProfileDispatch()
    

    const logoutHandler = () => {
        logout(loginDispatch)
        shiftDispatch({type: SHIFT_RESET})
        profileDispatch({ type: USER_PROFILE_RESET })
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' collapseOnSelect>
                <Container>
                    <Navbar.Brand>Shift Web</Navbar.Brand>
                        <Nav className='mr-auto p-1'>

                            {userInfo ? (
                                <NavDropdown title={profile.name} id='username' className='px-4'>
                                {userInfo.email === 'demo@email.com' ?
                                    <>
                                        <LinkContainer to='/demo/profile'>
                                            <NavDropdown.Item>ホーム</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/login'>
                                            <NavDropdown.Item onClick={logoutHandler}>ログアウト</NavDropdown.Item>
                                        </LinkContainer>
                                    </>
                                    :
                                    <>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>ホーム</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>ログアウト</NavDropdown.Item>
                                    </>
                                    }
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>                        
                                    <Nav.Link><i className="fas fa-user"></i>ログイン</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
