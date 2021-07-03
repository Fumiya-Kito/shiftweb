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


function ShiftItemUpdateForm({ shiftItem, date }) {

    //States    
    const [ isWork, setIsWork ] = useState(false) 
    const [ isAllDay, setIsAllDay ] = useState(false) 
    const [ startTime, setStartTime ] = useState('')
    const [ endTime, setEndTime] = useState('')
    const [ isDefault, setIsDefault] = useState(true)
    
    //Global States
    const shiftDispatch = useShiftDispatch()
    const profileState = useProfileStore()
    const { profile } = profileState

    
    //checkbox
    const radios = [
        { name:'終日', value:true},
        { name:'時間指定', value:false}
    ]
    
    const changeColor = (flag) => {
        if (flag) return 'dodgerblue'
        return ''
    }
    
    useEffect(() => {
            
            if (shiftItem && isDefault) {
                setIsWork(shiftItem.is_work) 
                setIsAllDay(shiftItem.is_all_day) 
                setStartTime(String(shiftItem.start_time).substring(0,5))
                setEndTime(String(shiftItem.end_time).substring(0, 5))
                setIsDefault(false)
            } else {
                if (isAllDay) {
                    setStartTime('07:00')
                    setEndTime('23:30')
                } else if(!startTime && !endTime) {
                    setStartTime(profile.start_default.substring(0,5))
                    setEndTime(profile.end_default.substring(0,5))
                }
            }
        
            if (date && !isWork) {
                removeShiftItem(shiftDispatch, date)
            }
            
            if (isWork && date && startTime && endTime) {
                addShiftItem(shiftDispatch, date, isWork, startTime, endTime, isAllDay)
            }



            // if (isAllDay) {
            //     setStartTime('07:00')
            //     setEndTime('23:30')
            // }
            // else {
            //     // setDate(shiftItem.date)
            //     setStartTime(String(shiftItem.start_time).substring(0,5))
            //     setEndTime(String(shiftItem.end_time).substring(0,5))
            //     setIsWork(shiftItem.is_work)
            //     setIsAllDay(shiftItem.is_all_day)
            // }
            // console.log(shiftItem.is_work)
        
        
    }, [  isAllDay, isWork, date, startTime, endTime])
    

        return (
            
            <>

                <Container style={{ color : changeColor(isWork)}}>
                    <Form.Group >
                        {/* <Form.Label className={'m-0'}>日付</Form.Label>
                        <Form.Control
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={'mb-3'}
                            required
                            // style={{display: 'none'}}
                            >
                        </Form.Control> */}
                        {!startTime && !endTime ? <Loader /> :

                        <div>
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


                                <Form.Label className={'mb-0'}>開始時間</Form.Label>
                                <TimePickerComponent
                                    placeholder='開始時間を選択'
                                    value={startTime}
                                    min={new Date('01/01/2021 07:00 AM')}
                                    format="HH:mm"
                                    step={30}
                                    change={(e) => setStartTime(e.text)}
                                    enabled={!isAllDay && isWork}
                                    openOnFocus={!isAllDay}
                                    strictMode={true}
                                    showClearButton={false}
                                    allowEdit={false}
                                    style={{ cursor: 'pointer' }}
                                ></TimePickerComponent>
            
                                <Form.Label className={'mt-3 mb-0'}>終了時間</Form.Label>
                                <TimePickerComponent
                                    placeholder='終了時間を選択'
                                    value={endTime}
                                    min={new Date('01/01/2021 ' + startTime)}
                                    format="HH:mm"
                                    step={30}
                                    change={(e) => setEndTime(e.text)}
                                    enabled={!isAllDay && isWork}
                                    openOnFocus={!isAllDay}
                                    strictMode={true}
                                    showClearButton={false}
                                    allowEdit={false}
                                    style={{ cursor: 'pointer' }}
                                ></TimePickerComponent>
                                    
                                <Form.Group className="my-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        disabled={!isWork}
                                        type="checkbox"
                                        label="終日"
                                        checked={isAllDay}
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

export default ShiftItemUpdateForm