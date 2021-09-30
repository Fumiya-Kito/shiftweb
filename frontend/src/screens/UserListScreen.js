import React, { useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import axios from 'axios'
import { useLoginStore } from '../context'
import Loader from '../components/Loader'
import { set } from 'date-fns'

function UserListScreen({ history }) {
    
    const [users, setUsers] = useState([])
    const [successDelete, setSuccessDelete] = useState(false)
    const [loading, setLoading] = useState(true)

    const loginState = useLoginStore()
    const {userInfo} = loginState

    useEffect(() => {
        //for iOS/Safari bfCache
        window.addEventListener('popstate', (e) => {
            if (history.action === 'POP') {
                history.go(0)
            }
        })
        
        if (userInfo && userInfo.isAdmin) {
            setLoading(true)
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
                setSuccessDelete(false)
                setLoading(false)
            }
            fetchUsers()
        } else {
            history.push('/login')
        }
    }, [history, userInfo, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm(`このユーザー（ID=${id}）を削除してよろしいですか？`)) {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }
            async function fetchDeleteUser() { 
                const { data } = await axios.delete(
                    `/api/users/admin/deleteuser/${id}/`,
                    config
                )
                setSuccessDelete(true)
            }
            fetchDeleteUser()
        }
    }

    return (
        <div>
            <h1>ユーザー管理</h1>
            {loading ? <Loader /> :
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

                                    <Button  className='btn-sm mx-2' onClick={() => deleteHandler(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}        
                    </tbody>
                </Table>
            }
        </div>
    )
}

export default UserListScreen
