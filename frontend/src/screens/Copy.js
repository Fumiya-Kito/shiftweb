import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLoginStore } from '../context'

import { takeMonth } from '../constants/month'
import {format} from 'date-fns'

// import  useMediaQuery  from 'react-response'


function ShiftMyListScreen({ history, match }) {
    
    //for API
    const shiftId = match.params.id
    const [shift, setShift] = useState([])

    const loginState = useLoginStore()
    const { userInfo } = loginState
    
    //for Calender
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    let month = []

    if (shift != undefined) {
        month = takeMonth(new Date(String(shift.period_start)))()
    }

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }
            async function fetchShift() { 
                const { data } = await axios.get(
                    `/api/shifts/confirm/${shiftId}/`,
                    config
                )
                setShift(data)
            }
            fetchShift()
        }
    }, [userInfo, history, match])

    return (
        <div>
            <Link to='/profile' className='btn my-2' style={{ background: '#999999'}}>
                ＜ Go Back to Profile
            </Link>
            <h1 className='p-4'>My Shift</h1>
            {shift.shiftItems &&
            <div className='text-center'> 
                <h5>{ month[0][6].getFullYear()} / {month[0][6].getMonth() + 1}</h5>
                <Row style={{ display:'none', background: '#c0c0c0' }} >

                    {days.map((day) => (
                        <Col key={day} style={{ border: 'solid 1px', margin: '0 0 0 -1px' }}>
                            <div className='p-2'>{day}</div>
                        </Col>
                    ))}
                </Row>
                
                <div>
                    {month.map((week) => (
                        <Row key={week} className='text-center' style={{height: '210px'}}>
                            {week.map((x) => (
                                <Col key={x} style={{ border: 'solid 1px', margin: '0 0 -1px -1px' }} >
                                    
                                    <p className='my-2' style={{borderBottom: 'solid 1px'}}>
                                        {x.getMonth() + 1} / {x.getDate()} ({ days[x.getDay()]})
                                    </p>
                                    
                                    {shift.shiftItems.map((item) => (
                                        <div key={item._id}>
                                            {item.date === format(x, 'yyyy-MM-dd') &&
                                                <div>
                                                    <h4 className='my-4'>出勤</h4>
                                                    
                                                    <div>{item.start_time.substring(0, 5)}</div>
                                                    ~
                                                    <div>{item.end_time.substring(0, 5)}</div>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </Col>
                            ))}
                        </Row>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}

export default ShiftMyListScreen
