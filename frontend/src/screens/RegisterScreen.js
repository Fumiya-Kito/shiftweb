import React, {useState, useEffect, useReducer} from 'react'
import { Form, Button } from 'react-bootstrap'
import { login, register } from '../actions/userActions'

import axios from 'axios'

import FormContainer from '../components/FormContainer'
import Message from '../components/Message'

import { useRegisterStore, useLoginStore, useLoginDispatch } from '../context'

function RegisterScreen({history}) {
    //useState
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')


    const loginState = useLoginStore()
    const loginDispatch = useLoginDispatch()
    const {userInfo} = loginState

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    },[history, userInfo])

    const submitHandler = async(e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Password do not match')
        } else {
            await axios.post(
                '/api/users/register/',
                { 'name': name, 'email': email, 'password': password },
            )
            login(email, password, loginDispatch)
        }
    }



    return (
        <FormContainer>
            <h1>アカウント登録</h1>
            {message && <Message variant='danger'>{message}</Message>}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='mb-4'>
                    <Form.Label>名前</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='名前を入力'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='mb-4'>
                    <Form.Label>メールアドレス</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='メールアドレスを入力'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='mb-4'>
                    <Form.Label>パスワード</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='パスワードを入力'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm' className='mb-4'>
                    <Form.Label>パスワード確認</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='パスワードをもう一度入力'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    登録
                </Button>
            </Form>

        </FormContainer>
    )
}

export default RegisterScreen
