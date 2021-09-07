import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useProfileDispatch, useProfileStore, useLoginStore } from '../context'
import { getProfile } from '../actions/userActions'
import { Form, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'

import { TimePickerComponent } from '@syncfusion/ej2-react-calendars'


function ProfileUpdateScreen({history}) {
    //local states
    const [name, setName] = useState('')
    const [duty, setDuty] = useState('')
    const [section, setSection] = useState('')
    const [employment, setEmployment] = useState('')
    const [isRookie, setIsRookie] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isPreClose, setIsPreClose] = useState(false)
    const [isClose, setIsClose] = useState(false)
    const [startDefault, setStartDefault] = useState('')
    const [endDefault, setEndDefault] = useState('')
    const [weeklyWork, setWeeklyWork] = useState('')
    const [workTime, setWorkTime] = useState('')
    const [commute, setCommute] = useState('')
    const [station, setStation] = useState('')
    const [submitLoading, setSubmitLoading] = useState(false)

    //global states
    const loginState = useLoginStore()
    const {userInfo} = loginState
    const dispatch = useProfileDispatch()
    const profileState = useProfileStore()
    const { profile } = profileState

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            getProfile(dispatch, userInfo)

            profile.name ? setName(profile.name) : setName('名前がありません')
            profile.duty ? setDuty(profile.duty) : setDuty('')
            profile.employment_status ? setEmployment(profile.employment_status) : setEmployment('')
            profile.section ? setSection(profile.section) : setSection('')
            profile.is_rookie ? setIsRookie(profile.is_rookie) : setIsRookie(false)
            profile.is_open_staff ? setIsOpen(profile.is_open_staff) : setIsOpen(false)
            profile.is_pre_close_staff ? setIsPreClose(profile.is_pre_close_staff) : setIsPreClose(false)
            profile.is_close_staff ? setIsClose(profile.is_close_staff) : setIsClose(false)
            profile.start_default ? setStartDefault(profile.start_default) : setStartDefault('')
            profile.end_default ? setEndDefault(profile.end_default) : setEndDefault('')
            profile.desired_times_per_week ? setWeeklyWork(profile.desired_times_per_week) : setWeeklyWork(0)
            profile.desired_working_time ? setWorkTime(profile.desired_working_time) : setWorkTime(0)
            profile.commute ? setCommute(profile.commute) : setCommute('')
            profile.station ? setStation(profile.station) : setStation('')
        }

        if(!startDefault && !endDefault) {
            setStartDefault(profile.start_default.substring(0,5))
            setEndDefault(profile.end_default.substring(0,5))
        }
    }, [history, userInfo, dispatch])

    const submitHandler = async(e) => {
        e.preventDefault()
        setSubmitLoading(true)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
    
        const { data } = await axios.put(
            `/api/users/update/profile/`,
            {
                "name": name,
                "duty": duty,
                "employment": employment,
                "section": section,
                "isRookie": isRookie,
                "isOpen": isOpen,
                "isPreClose": isPreClose,
                "isClose": isClose,
                "startDefault": startDefault,
                "endDefault": endDefault,
                "weeklyTime": weeklyWork,
                "workTime": workTime,
                "commute": commute,
                "station": station
            },
            config
        )
        history.push('/profile')
    }

    return (
        <>
            <Link to='/profile' className='btn my-2' style={{ background: '#999999'}}>
                ＜ 戻る
            </Link>
            
            <FormContainer>
                <Form onSubmit={submitHandler} className='border p-3'>
                    <Form.Group controlId='name'>
                        <Form.Label className='mt-3 mb-0'>名前</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='名前を記入'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='duty'>
                        <Form.Label className='mt-3 mb-0'>職務</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={duty}
                            onChange={(e) => setDuty(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={'正社員'}>正社員</option>
                            <option value={'アルバイトリーダー'}>アルバイトリーダー</option>
                            <option value={'アルバイト'}>アルバイト</option>
                            <option value={''}>「職務」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='employment'>
                        <Form.Label className='mt-3 mb-0'>雇用形態</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={employment}
                            onChange={(e) => setEmployment(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={'正社員'}>正社員</option>
                            <option value={'フリーター（週40時間）'}>フリーター（週40時間）</option>
                            <option value={'フリーター（週20時間）'}>フリーター（週20時間）</option>
                            <option value={'学生'}>学生</option>
                            <option value={''}>「雇用形態」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='section'>
                        <Form.Label className='mt-3 mb-0'>セクション</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={'フロント'}>フロント</option>
                            <option value={'映写'}>映写</option>
                            <option value={'コンセッション'}>コンセッション</option>
                            <option value={'ボックス'}>ボックス</option>
                            <option value={'ショップ'}>ショップ</option>
                            <option value={''}>「セクション」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isRookie'>
                        <Form.Label className='mt-3 mb-0'>研修</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={isRookie}
                            onChange={() => setIsRookie(!isRookie)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={true}>研修中</option>
                            <option value={false}>完了</option>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='isOpen'>
                        <Form.Label className={'mt-3 mb-0'}>オープン</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={isOpen}
                            onChange={() => setIsOpen(!isOpen)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={true}>可</option>
                            <option value={false}>不可</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isPreClose'>
                        <Form.Label className='mt-3 mb-0'>10時締め</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={isPreClose}
                            onChange={() => setIsPreClose(!isPreClose)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={true}>可</option>
                            <option value={false}>不可</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isClose'>
                        <Form.Label className={'mt-3 mb-0'}>締め</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={isClose}
                            onChange={() => setIsClose(!isClose)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={true}>可</option>
                            <option value={false}>不可</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Label className='mt-3 mb-0'>通常業務開始時間</Form.Label>
                    <TimePickerComponent
                        placeholder='開始時間を選択'
                        value={startDefault}
                        min={new Date('01/01/2021 07:00 AM')}
                        format="HH:mm"
                        step={30}
                        change={(e) => setStartDefault(e.text)}
                        openOnFocus={true}
                        strictMode={true}
                        showClearButton={false}
                        allowEdit={false}
                        style={{cursor: 'pointer'}}
                    ></TimePickerComponent>

                    <Form.Label className='mt-3 mb-0'>通常業務終了時間</Form.Label>
                    <TimePickerComponent
                        placeholder='終了時間を選択'
                        value={endDefault}
                        min={new Date('01/01/2021 ' + startDefault)}
                        format="HH:mm"
                        step={30}
                        change={(e) => setEndDefault(e.text)}
                        openOnFocus={true}
                        strictMode={true}
                        showClearButton={false}
                        allowEdit={false}
                        style={{ cursor: 'pointer' }}
                    ></TimePickerComponent>

                    <Form.Group controlId='weeklyWork'>
                        <Form.Label className={'mt-3 mb-0'}>週間希望シフト回数</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={weeklyWork}
                            onChange={(e) => setWeeklyWork(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={1}>1回</option>
                            <option value={2}>2回</option>
                            <option value={3}>3回</option>
                            <option value={4}>4回</option>
                            <option value={5}>5回</option>
                            <option value={0}>「週間希望シフト回数」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='workTime'>
                        <Form.Label className='mt-3 mb-0'>希望就労時間</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={workTime}
                            onChange={(e) => setWorkTime(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={3}>3h</option>
                            <option value={4}>4h</option>
                            <option value={5}>5h</option>
                            <option value={6}>6h</option>
                            <option value={7}>7h</option>
                            <option value={8}>8h</option>
                            <option value={0}>「希望就労時間」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='commute'>
                        <Form.Label className='mt-3 mb-0'>通勤方法</Form.Label>
                        <Form.Control
                            required
                            as='select'
                            value={commute}
                            onChange={(e) => setCommute(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={'電車'}>電車</option>
                            <option value={'バス'}>バス</option>
                            <option value={'徒歩'}>徒歩</option>
                            <option value={'自転車'}>自転車</option>
                            <option value={''}>「」を選択してください</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='station'>
                        <Form.Label className='mt-3 mb-0'>最寄り駅</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='最寄り駅を入力'
                            value={station}
                            onChange={(e) => setStation(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    {submitLoading ? <Loader /> : 
                        <Button type='submit' variant='primary' size='lg' className='mt-4'>
                            更新
                        </Button>
                    }

                </Form>
            </FormContainer>
        </>
    )
}

export default ProfileUpdateScreen
