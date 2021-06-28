import React, { useEffect, useState, useReducer } from 'react'
import { Form, Button, Row, Col, Table, Card, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import axios from 'axios'
import { useLoginStore, useProfileDispatch, useProfileStore, useShiftDispatch, useShiftStore} from '../context'
import { getProfile } from '../actions/userActions'
import { changeSubmitStatus } from '../actions/shiftActions'
import { SHIFT_REQUEST, SHIFT_SUCCESS } from '../constants/shiftConstants'


import Message from '../components/Message'
import Loader from '../components/Loader'
import { format } from 'date-fns'

function ProfileScreen({ history }) {
    
    // const [profile, setProfile] = useState([])
    const [shifts, setShifts] = useState([])
    // const [isSubmitted, setIsSubmitted] = useState(false)


    const loginState = useLoginStore()
    const {userInfo} = loginState
    const dispatch = useProfileDispatch()
    const profileState = useProfileStore()
    const { profile } = profileState
    const shiftState = useShiftStore()
    const { period, deadline, isSubmitted, loading } = shiftState
    const shiftDispatch = useShiftDispatch()

    const getStringDate = (dt = new Date()) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1)).slice(-2) + '-' + ('0'+dt.getDate()).slice(-2)
    }

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
                shiftDispatch({type: SHIFT_REQUEST})
                const { data } = await axios.get(
                    `/api/shifts/myshifts/`,
                    config
                )
                setShifts(data)
                console.log('shifts: ', data)
                
                for (let i = 0; i < data.length; i++){
                    if (data[i].period_start === getStringDate(period[0])) {
                        changeSubmitStatus(shiftDispatch)
                    }
                }
                
                shiftDispatch({type: SHIFT_SUCCESS})
            }
            fetchShifts()
        }
        
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

                {loading ? <Loader />
                    :
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
                                        <td>{shift.is_confirmed ? '確定' : '未確定'}</td>
                                        <td>
                                            <LinkContainer to={`/shifts/confirm/${shift._id}`}>
                                                { shift.is_confirmed ? 
                                                    <Button className='btn-sm' variant='primary'>Details</Button>
                                                    :<Button className='btn-sm' variant='info'>Update</Button>
                                                }
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                        <h2>Shift Submit</h2>
                        
                        <LinkContainer to='/shifts/submit' className='d-grid gap-2 my-2 p-3'>
                            <Button size='lg' varinat='primary' disabled={isSubmitted || (new Date() > deadline)}>シフト提出： {getStringDate(period[0])} ~ { getStringDate(period[1])}</Button>
                        </LinkContainer>
                        <p>提出状態： {isSubmitted ?　<i style={{color: 'blue'}}>提出済み</i> : <i style={{color: 'red'}}>未提出</i>}</p>
                        <p>提出期限： {String(format(deadline, "yyyy-MM-dd' 'HH:mm"))} まで</p>
                        {(!isSubmitted && (new Date() > deadline)) &&
                            <Message variant='danger'>期限内に提出できていません → 担当マネージャーに連絡！</Message>
                        }
                    </Col>
                }
            </Row>
        </div>
    )
}

export default ProfileScreen
