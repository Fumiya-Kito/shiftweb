import React, { useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'

import axios from 'axios'

import { useLoginStore } from '../context'


import Message from '../components/Message'
import Loader from '../components/Loader'

function UserListScreen({ history }) {
    
    const [users, setUsers] = useState([])

    const loginState = useLoginStore()
    const {userInfo} = loginState

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }
            async function fetchUsers() { 
                const { data } = await axios.get(
                    `/api/users/admin/getusers/`,
                    config
                )
                setUsers(data)
            }
            fetchUsers()
        } else {
            history.push('/login')
        }
    }, [history, userInfo])

    return (
        <div>
            <h1>USERS</h1>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                        <th>EDIT/DELETE</th>
                    </tr>
                </thead>
                
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {/* <td>{String(user.isAdmin)}</td> */}
                            <td>{user.isAdmin ? (
                                <i className='fas fa-check' ></i>
                            ) : (
                                <i className='fas fa-times' ></i>
                            )}</td>

                            <td>
                                <LinkContainer to={`user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm mx-2'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>

                                <Button  className='btn-sm mx-2'>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}        
                </tbody>
            </Table>
        </div>
    )
}

export default UserListScreen
