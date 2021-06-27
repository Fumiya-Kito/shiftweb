import React, { useEffect, useState, useReducer } from 'react'
import { Form, Button, Row, Col, Table, Card, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import axios from 'axios'
import { useLoginStore, useProfileDispatch, useProfileStore } from '../context'
import { getProfile } from '../actions/userActions'


import Message from '../components/Message'
import Loader from '../components/Loader'

function ProfileScreen({ history }) {
    
    // const [profile, setProfile] = useState([])
    const [shifts, setShifts] = useState([])


    const loginState = useLoginStore()
    const {userInfo} = loginState
    const dispatch = useProfileDispatch()
    const profileState = useProfileStore()
    const {profile} =  profileState


    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            getProfile(dispatch, userInfo)
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }
            async function fetchShifts() { 
                const { data } = await axios.get(
                    `/api/shifts/myshifts/`,
                    config
                )
                setShifts(data)
                console.log('shifts: ', data)
            }        
            fetchShifts()
        }
        
        // console.log('profile: ', profile)
    }, [history, userInfo])

    return (
        <div>
            <h1>ようこそ! {profile.name} さん</h1>
            <Row className='py-3'>
                <Col md={4} className='py-2'>
                    <h2>My Profile</h2>
                    <ListGroup >
                        <ListGroup.Item>
                            ID: {profile._id}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Name: {profile.name}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Duty: {profile.duty}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Section: {profile.section} 
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Employment: {profile.employment_status}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Rokie?: {String(profile.is_rookie)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Commute: {profile.commute} 
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Default-Start: {profile.start_default}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Default-End: {profile.end_default}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Default-Work: {profile.desired_times_per_week} times
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Default-Time: {profile.desired_working_time} hours
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Station: {profile.station}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={8} className='py-2'>
                    <h4>My Shifts</h4>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>PERIOD</th>
                                <th>STATUS</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((shift) => (
                                <tr key={shift._id}>
                                    <td>{shift._id}</td>
                                    <td>{shift.period_start} {' '} ~ {' '}{shift.period_end}</td>
                                    <td>モデル変更</td>
                                    <td>
                                        <LinkContainer to={`/shifts/confirm/${shift._id}`}>
                                            <Button className='btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    <h2>Shift Submit</h2>
                    <LinkContainer to='/shifts/submit' className='d-grid gap-2 my-2 p-3'>
                        <Button size='lg' varinat='primary'>シフト提出</Button>
                    </LinkContainer>
                </Col>
            </Row>
        </div>
    )
}

export default ProfileScreen
