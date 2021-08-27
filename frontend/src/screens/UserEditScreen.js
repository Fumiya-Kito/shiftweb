import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

import { useLoginStore } from '../context'

import FormContainer from '../components/FormContainer'


function UserEditScreen({ match, history }) {

    const userId = match.params.id
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const loginState = useLoginStore()
    const {userInfo} = loginState
    
    useEffect(() => {
        if ( !name || !email ) {
            async function fetchUser() { 
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization : `Bearer ${userInfo.token}`
                    }
                }
                const { data } = await axios.get(
                    `/api/users/${userId}/`,
                    config
                )
                setName(data.name)
                setEmail(data.email)
                setIsAdmin(data.isAdmin)
            }
            fetchUser()
        }
    }, [userInfo, history, userId])

    const submitHandler = async(e) => {
        e.preventDefault()
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }
    
        const { data } = await axios.put(
            `api/users/admin/updateuser/${userId}/`,
            {
                'name': name,
                'email': email,
                'isAdmin': isAdmin
            },
            config
        )
        history.push('/admin/userlist')
    }

    return (
        <div>
            <Link to={'/admin/userlist'} className='btn my-2' style={{ background: '#999999'}}>
                ＜ 戻る
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
    
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='idAdmin'>
                        <Form.Label>IsAdmin</Form.Label>
                        <Form.Check
                            type='checkbox'
                            placeholder='Is Admin'
                            value={isAdmin}
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        ></Form.Check>
                    </Form.Group>


                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
                
            </FormContainer>
        </div>
    )
}

export default UserEditScreen