import React, { useEffect, useState } from 'react'
import { Form, Button,Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import { useLoginStore, useLoginDispatch } from '../context'


function LoginScreen({history, location}) {
    // const [state, dispatch] = useUserLoginReducer()
    const state = useLoginStore()
    const dispatch = useLoginDispatch()
    const {userInfo, error, loading} = state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'


    useEffect(() => {
        if (userInfo) {
            history.push('/profile')
        }
    },[history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        login(email, password, dispatch)
    }


    return (
        <>
            <FormContainer>
                <h1>ログイン</h1>
                
                {error && <Message variant='danger'>'メールアドレスかパスワードが間違っています'</Message>}
                
                {loading ? <Loader /> :
                    <>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='email'>
                                <Form.Label className='mb-0'>メールアドレス</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='eメールアドレスを入力'
                                    value={email}
                                    onChange={
                                        (e) => setEmail(e.target.value) 
                                    }
                                ></Form.Control>
                            </Form.Group>


                            <Form.Group controlId='password'>
                                <Form.Label className='mb-0 mt-3'>パスワード</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='パスワードを入力'
                                    value={password}
                                    onChange={
                                        (e) => setPassword(e.target.value)
                                    }
                                ></Form.Control>
                            </Form.Group>
                            
                            <Button type='submit' variant='primary' className='mt-2 mb-3'>
                                ログイン
                            </Button>
                        </Form>
                    </>
                }

                <Row className="py-3">
                    <Col>
                        アカウントをお持ちでない方：
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            {' '} 登録
                        </Link>
                    </Col>
                </Row>

            </FormContainer>

            <FormContainer>
                <Message variant='info'>
                    デモはこちら（ユーザーの登録・ログインをせずに体験できます）
                    <br></br>
                    <Link to={'/demo/profile'}>Demoユーザーでログイン</Link>
                </Message>
            </FormContainer>
        </>
    )
}

export default LoginScreen
