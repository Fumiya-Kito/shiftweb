import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLoginStore } from '../context'

import { takeMonth } from '../constants/month'
import { format } from 'date-fns'
import  ShiftItemForm  from '../components/ShiftItemForm'

import { useShiftStore } from '../context'

// import  useMediaQuery  from 'react-response'


function ShiftSubmitScreen({ history, match }) {
    
    //global State
    const loginState = useLoginStore()
    const { userInfo } = loginState
    const shiftState = useShiftStore()
    const { shiftItems } = shiftState
    
    //for Calender
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    let month = []
    month = takeMonth(new Date())()

    const getStringDate = (dt = new Date()) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1)).slice(-2) + '-' + ('0'+dt.getDate()).slice(-2)
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

        }
    }, [userInfo, history, match])

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(shiftItems)
    } 

    return (
        <div>
            {/* {console.log(shiftItems)} */}

            <Link to='/profile' className='btn my-2' style={{ background: '#999999'}}>
                ＜ Go Back to Profile
            </Link>
            <h1 className='p-4'>Shift Submit</h1>
            
            <div className='text-center'> 
                <h4 style={{ borderBottom: '1px solid', display: 'inline-block' }}>
                    {month[0][6].getFullYear()}/{month[0][6].getMonth() + 1}
                </h4>

                <Form onSubmit={submitHandler}>
                    
                    <Row className='my-5 border' >
                        {month.map((week) => (
                            <React.Fragment key={week}> 
                                {week.map((date) => (
                                    <React.Fragment key={date}>
                                        {date.getMonth() === month[0][6].getMonth() &&
                                            <Col className='my-1' xs={6} sm={6} md={4} lg={3} xl={2}>                                            
                                                <Card  className='mx-auto my-2'>
                                                    <Card.Header>
                                                        {date.getMonth() + 1} / {date.getDate()} ({ days[date.getDay()]})
                                                    </Card.Header>
                                                    <Card.Body >    
                                                    <ShiftItemForm date={getStringDate(date)}/>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                    }
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </Row>

                    <Button type='submit' variant='primary'>
                        送信
                    </Button>
                </Form>

            
            </div>
            
        </div>
    )
}
//空タグでkey属性をもたせたい場合、Fragmentを使う

export default ShiftSubmitScreen
