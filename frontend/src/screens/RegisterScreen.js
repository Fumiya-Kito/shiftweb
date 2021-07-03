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
    const {userInfo, loading, error} = loginState

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
            <h1>Sign Up</h1>
            {message && <Message variant='danger'>{message}</Message>}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='mb-4'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='mb-4'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='mb-4'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm' className='mb-4'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Register
                </Button>
            </Form>

        </FormContainer>
    )
}

export default RegisterScreen
