import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useLoginStore, useShiftStore} from '../context'

import { takeMonth } from '../constants/month'
import  ShiftItemUpdateForm from '../components/ShiftItemUpdateForm'

import Loader from '../components/Loader'
import BackToDemoProfile from '../components/BackToDemoProfile'


function DemoShiftUpdateScreen({ history, match }) {
    
    //global State
    const loginState = useLoginStore()
    const { userInfo } = loginState
    const shiftState = useShiftStore()
    const { shiftItems } = shiftState
    
    //local
    const shiftId = match.params.id
    const [shift, setShift] = useState([])
    const [remarks, setRemarks] = useState([])
    const [month, setMonth] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)


    //for Calender
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    

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
                    `/api/shifts/confirm/${shiftId}/`,
                    config
                )
                setShift(data)
                setRemarks(data.remarks)
                setMonth(takeMonth(new Date(String(data.period_start)))())
                setLoading(false)
            }        
            fetchShift()
        }

        
    }, [userInfo, history, match, shiftId])
    
    const submitHandler = async(e) => {
        e.preventDefault()
        setSubmitLoading(true)
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
                'remarks': remarks,
            },
            config
        )
        history.push('/demo/profile')
    } 

    return (
        <div>
            <BackToDemoProfile/>
            <h1 className='p-4'>シフト更新</h1>
            
            {loading ? <Loader /> :
            
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

                        <Row className='p-3 mb-5'>
                            <Col md={8} >
                                <Form.Group controlId='remarks'>
                                    <Form.Label>備考</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        row='5'
                                        placeholder='今回のシフトに関してなにか希望があれば記述してください'
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4} className='d-grid gap-2 mt-4'>
                                {submitLoading ? <Loader /> :
                                    <Button type='submit' variant='primary' size='lg'>
                                        提出
                                    </Button>
                                }
                            </Col>
                        </Row>

                    </Form>

                
                </div>
            }
            
        </div>
    )
}

export default DemoShiftUpdateScreen
