import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FormContainer from './FormContainer'
import { Form, ButtonGroup, ToggleButton, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import  Loader from './Loader'
import { useLoginStore, useProfileStore, useShiftDispatch, useShiftStore } from '../context'

import { TimePickerComponent } from '@syncfusion/ej2-react-calendars'
import { addShiftItem, removeShiftItem, updateShiftItem } from '../actions/shiftActions'
import { set, setISODay } from 'date-fns'


function ShiftFormTest({ history, match }) {

    const shiftItemId = match.params.id
    // const shiftItemId = shiftItem._id

    //States    
    const [ shiftItem, setShiftItem ] = useState('') 
    const [ date, setDate ] = useState('') 
    const [ isWork, setIsWork ] = useState(false) 
    const [ isAllDay, setIsAllDay ] = useState(false) 
    const [ startTime, setStartTime ] = useState('')
    const [endTime, setEndTime] = useState('')
    // const [ isWork, setIsWork ] = useState(shiftItem.isWork) 
    // const [ isAllDay, setIsAllDay ] = useState(shiftItem.isAllDay) 
    // const [ startTime, setStartTime ] = useState(shiftItem.startTime)
    // const [ endTime, setEndTime] = useState(shiftItem.endTime)

    
    //Global States
    const loginState = useLoginStore()
    const { userInfo, loading, error } = loginState
    
    //checkbox
    const radios = [
        { name:'終日', value:true},
        { name:'時間指定', value:false}
    ]

    
    
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
            if (!shiftItem) {
                async function fetchShiftItem() { 
                    const { data } = await axios.get(
                        `/api/shifts/shiftItem/confirm/${shiftItemId}`,
                        config
                    )
                    setShiftItem(data)
                }        
                fetchShiftItem()
            } else if (isAllDay) {
                setStartTime('07:00')
                setEndTime('23:30')
            }
            else {
                setDate(shiftItem.date)
                setStartTime(String(shiftItem.start_time).substring(0,5))
                setEndTime(String(shiftItem.end_time).substring(0,5))
                setIsWork(shiftItem.is_work)
                setIsAllDay(shiftItem.is_all_day)
            }
        }
        
    }, [history, userInfo, isAllDay, shiftItem])
    
    const submitHandler = (e) => {
        e.preventDefault()
    }

        return (
            
            <>
                {console.log(shiftItem)}
                {console.log(isWork)}
                {console.log(startTime)}
                {loading && <Loader />}

                <Container>
                    <Form.Group >
                        <Form.Label className={'m-0'}>日付</Form.Label>
                        <Form.Control
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={'mb-3'}
                            required
                            // style={{display: 'none'}}
                        >
                        </Form.Control>

                        <Form.Label className={'m-0'}>出欠</Form.Label>
                        <Form.Control
                            as='select'
                            value={isWork}
                            onChange={(e) => {
                                setIsWork(!isWork)
                                // if (e.target.value) {
                                //     removeShiftItem(shiftDispatch, date)
                                //     console.log('remove item')
                                // }
                            }}
                            className={'mb-3'}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={false}>☓</option>
                            <option value={true}>○</option>
                        </Form.Control>

                        {isWork &&
                            <div>

                                <Form.Label className={'mb-0'}>開始時間</Form.Label>
                                <TimePickerComponent
                                    placeholder='開始時間を選択'
                                    value={startTime}
                                    min={new Date('01/01/2021 07:00 AM')}
                                    format="HH:mm"
                                    step={30}
                                    change={(e) => setStartTime(e.text)}
                                    enabled={!isAllDay}
                                    openOnFocus={!isAllDay}
                                    strictMode={true}
                                    showClearButton={false}
                                    allowEdit={false}
                                    style={{cursor: 'pointer'}}
                                ></TimePickerComponent>
            
                                <Form.Label className={'mt-3 mb-0'}>終了時間</Form.Label>
                                <TimePickerComponent
                                    placeholder='終了時間を選択'
                                    value={endTime}
                                    min={new Date('01/01/2021 '+ startTime)}
                                    format="HH:mm"
                                    step={30}
                                    change={(e) => setEndTime(e.text)}
                                    enabled={!isAllDay}
                                    openOnFocus={!isAllDay}
                                    strictMode={true}
                                    showClearButton={false}
                                    allowEdit={false}
                                    style={{cursor: 'pointer'}}
                                ></TimePickerComponent>
                                    
                                <Form.Group className="my-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="終日"
                                        onChange={() => setIsAllDay(!isAllDay)}
                                        className='text-left'
                                    />
                                </Form.Group>
                                
                                
                            </div>
                        }
                    </Form.Group>
                </Container>
            </>
    )
}

export default ShiftFormTest
