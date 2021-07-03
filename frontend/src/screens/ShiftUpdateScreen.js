import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLoginStore, useShiftStore, useProfileStore} from '../context'

import { takeMonth } from '../constants/month'
import  ShiftItemUpdateForm from '../components/ShiftItemUpdateForm'

import Loader from '../components/Loader'


function ShiftUpdateScreen({ history, match }) {
    
    //global State
    const loginState = useLoginStore()
    const { userInfo } = loginState
    const shiftState = useShiftStore()
    const { shiftItems } = shiftState
    
    //local
    const shiftId = match.params.id
    const [shift, setShift] = useState([])


    //for Calender
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    
    const month = takeMonth(new Date(String(shift.period_start)))()

    //functions
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
            
            async function fetchShift() { 
                const { data } = await axios.get(
                    `/api/shifts/confirm/${shiftId}`,
                    config
                )
                setShift(data)
                // console.log('shift: ', data)
            }        
            fetchShift()
        }
        
    }, [userInfo, history, match])
    
    const submitHandler = async(e) => {
        e.preventDefault()
        if (window.confirm('このシフトを更新しますか?')) {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }
        
    
            const { data } = await axios.put(
                `/api/shifts/shift-update/${shiftId}/`,
               {
                    'shiftItems': shiftItems,
                    'remarks': "",
                },
                config
            )
            history.push('/profile')
        }
    } 

    return (
        <div>
            <Link to='/profile' className='btn my-2' style={{ background: '#999999'}}>
                ＜ 戻る
            </Link>
            <h1 className='p-4'>シフト更新</h1>
            
            {!month[0][6].getMonth() ? <Loader /> :
            
                <div className='text-center'> 
                    <h4 style={{ borderBottom: '1px solid', display: 'inline-block' }}>
                        {month[0][6].getFullYear()}/{month[0][6].getMonth() + 1}
                    </h4>

                    <Form onSubmit={submitHandler}>
                        
                        <Row className='my-5 border' >
                            {month.map((week, i) => (
                                <React.Fragment key={i}> 
                                    {week.map((date, j) => (
                                        <React.Fragment key={j}>
                                            {date.getMonth() === month[0][6].getMonth() &&
                                                <Col className='my-1' xs={6} sm={6} md={4} lg={3} xl={2}>                                            
                                                    <Card  className='mx-auto my-2'>
                                                        <Card.Header>
                                                            {date.getMonth() + 1} / {date.getDate()} ({ days[date.getDay()]})
                                                        </Card.Header>
                                                        <Card.Body >
                                                            <ShiftItemUpdateForm
                                                                date={getStringDate(date)}
                                                                shiftItem={shift.shiftItems.find(element => element.date === getStringDate(date))}
                                                            />
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
            }
            
        </div>
    )
}

export default ShiftUpdateScreen
