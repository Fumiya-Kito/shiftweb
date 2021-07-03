import React, { useState, useEffect } from 'react'
import { Form, Container } from 'react-bootstrap'
import  Loader from './Loader'
import { useProfileStore, useShiftDispatch, useShiftStore } from '../context'

import { TimePickerComponent } from '@syncfusion/ej2-react-calendars'
import { addShiftItem, removeShiftItem, updateShiftItem } from '../actions/shiftActions'


function ShiftItemForm({history, date}) {
    //States 引数にdate
    const [ isWork, setIsWork ] = useState(false) 
    const [ isAllDay, setIsAllDay ] = useState(false) 
    const [ startTime, setStartTime ] = useState('')
    const [endTime, setEndTime] = useState('')

    
    //Global States
    const profileState = useProfileStore()
    const { profile } = profileState
    const shiftState = useShiftStore()
    const shiftDispatch = useShiftDispatch()
    
    //checkbox
    const radios = [
        { name:'終日', value:true},
        { name:'時間指定', value:false}
    ]

    const changeColor = (flag) => {
        if (flag) return 'dodgerblue'
        return ''
    }
    const chooseCursor = (flag) => {
        if (flag) return 'pointer'
        return 'not-allowed'
    }
    
    useEffect(() => {

        if (isAllDay) {
            setStartTime('07:00')
            setEndTime('23:30')
        } else if(!startTime && !endTime) {
            setStartTime(profile.start_default.substring(0,5))
            setEndTime(profile.end_default.substring(0,5))
        }

        if (date && !isWork) {
            removeShiftItem(shiftDispatch, date)
            console.log('remove item')
        }
        
        if (isWork && date&& startTime && endTime) {
            addShiftItem(shiftDispatch, date, isWork, startTime, endTime, isAllDay)
            console.log('success for dispatch')
        }
        
    }, [history, isAllDay, isWork, date, startTime, endTime])
    
    // const submitHandler = (e) => {
    //     e.preventDefault()
    
    //     const config = {
    //         headers: {
    //             'Content-type': 'application/json',
    //             Authorization : `Bearer ${userInfo.token}`
    //         }
    //     }
    //     async function postShiftItem() { 
    //         const { data } = await axios.post(
    //             `/api/shifts/shiftItem/create/`,
    //             {'date': date, 'isWork': isWork, 'isAllDay': isAllDay, 'startTime': startTime, 'endTime': endTime},
    //             config
    //         )
    //     }
    //     postShiftItem()
    // }

        return (
            
            <>

                <Container style={{color: changeColor(isWork)}}>
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

                        <Form.Label className={'m-0'}>出欠</Form.Label>
                        <Form.Control
                            as='select'
                            value={isWork}
                            onChange={(e) => {
                                setIsWork(!isWork)
                            }}
                            className={'mb-3'}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={false}>☓</option>
                            <option value={true}>○</option>
                        </Form.Control>

                        {!startTime && !endTime ? <Loader /> :
                            <div>
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
                                    style={{cursor: chooseCursor(isWork)}}
                                ></TimePickerComponent>
            
                                <Form.Label className={'mt-3 mb-0'}>終了時間</Form.Label>
                                <TimePickerComponent
                                    placeholder='終了時間を選択'
                                    value={endTime}
                                    min={new Date('01/01/2021 '+ startTime)}
                                    format="HH:mm"
                                    step={30}
                                    change={(e) => setEndTime(e.text)}
                                    enabled={!isAllDay && isWork}
                                    openOnFocus={!isAllDay}
                                    strictMode={true}
                                    showClearButton={false}
                                    allowEdit={false}
                                    style={{cursor: chooseCursor(isWork)}}
                                ></TimePickerComponent>
                                    
                                <Form.Group className="my-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        disabled={!isWork}
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

export default ShiftItemForm
