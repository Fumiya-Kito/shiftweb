import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card } from 'react-bootstrap'
import { format } from 'date-fns'

import { useLoginStore } from '../context'
import { takeMonth } from '../constants/month'

import BackToDemoProfile from '../components/BackToDemoProfile'
import Loader from '../components/Loader'

function DemoShiftConfirmScreen({ history, match }) {
    
    //for API
    const shiftId = match.params.id
    const [shift, setShift] = useState([])
    const [loading, setLoading] = useState(true)


    const loginState = useLoginStore()
    const { userInfo } = loginState
    
    //for Calender
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    const month = takeMonth(new Date(String(shift.period_start)))()
    

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
                setLoading(true)
                const { data } = await axios.get(
                    `/api/shifts/confirm/${shiftId}/`,
                    config
                )
                setShift(data)
                setLoading(false)
            }
            fetchShift()
        }
    }, [userInfo, history, match, shiftId])

    return (
        <div>
            <BackToDemoProfile />

            <h1 className='p-4'>シフト確認</h1>
            {loading ? <Loader/> :
            <div className='text-center'> 
                <h4 style={{borderBottom:'1px solid', display:'inline-block'}}>{ month[0][6].getFullYear()}/{month[0][6].getMonth() + 1}</h4>
                
                <div>
                    <Row className='text-center my-4' >
                        {month.map((week, i) => (
                            <React.Fragment key={i}>
                            {week.map((date, j) => (
                                <React.Fragment key={j}>
                                    {date.getMonth() === month[0][6].getMonth() &&
                                        <Col key={j} className='my-1' xs={6} sm={6} md={4} lg={3} xl={2}>
                                            
                                            <Card style={{width: '11rem', height:'10rem'}}>
                                                <Card.Header>
                                                    {date.getMonth() + 1} / {date.getDate()} ({ days[date.getDay()]})
                                                </Card.Header>
                                                <Card.Body>
                                                    {shift.shiftItems.map((item) => (
                                                        <div key={item._id}>
                                                            {item.date === format(date, 'yyyy-MM-dd') &&
                                                                <div>
                                                                    <Card.Title style={{color: '#0405B5'}}><b>出勤</b></Card.Title>
                                                                    <Card.Text>
                                                                        {item.start_time.substring(0, 5)}
                                                                        {' '}~{' '}
                                                                        {item.end_time.substring(0, 5)}
                                                                    </Card.Text>
                                                                </div>
                                                            }
                                                        </div>
                                                    ))}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    }
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                    </Row>
                </div>
            </div>
            }
        </div>
    )
}

export default DemoShiftConfirmScreen
