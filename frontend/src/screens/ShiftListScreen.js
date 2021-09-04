import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'

import { useLoginStore } from '../context'

import Message from '../components/Message'
import Loader from '../components/Loader'

function ShiftListScreen({ history }) {

    const loginState = useLoginStore()
    const {userInfo} = loginState

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            //api call
            console.log('useEffect')
        } else {
            history.push('/login')
        }
    }, [history, userInfo])
    
    return (
        <div>
            <h1>Shifts（開発中）</h1>
            {/* {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL PRICE</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}</td>

                                <td>{order.isPaid ? (
                                    order.paidAt.substring(0,10)
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                )}
                                </td>

                                <td>{order.isDelivered ? (
                                    order.deliveredAt.substring(0,10)
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                )}
                                </td>

                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}        
                    </tbody>
                </Table>
            )} */}
        </div>
    )
}

export default ShiftListScreen
