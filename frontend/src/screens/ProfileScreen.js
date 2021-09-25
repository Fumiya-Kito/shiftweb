import React, { useEffect, useState, useReducer } from 'react'
import { Button, Row, Col, Table, Container } from 'react-bootstrap'
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
    
    const [shifts, setShifts] = useState([])


    const loginState = useLoginStore()
    const {userInfo} = loginState
    const dispatch = useProfileDispatch()
    const profileState = useProfileStore()
    const { profile, loading: profileLoading } = profileState
    const shiftState = useShiftStore()
    const { period, deadline, isSubmitted, loading } = shiftState
    const shiftDispatch = useShiftDispatch()

    const getStringDate = (dt = new Date()) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1)).slice(-2) + '-' + ('0'+dt.getDate()).slice(-2)
    }

    useEffect(() => {
        //for iOS/Safari bfCache
        window.addEventListener('popstate', (e) => {
            if (history.action === 'POP') {
                history.go(0)
            }
        })

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
                
                for (let i = 0; i < data.length; i++){
                    if (data[i].period_start === getStringDate(period[0])) {
                        changeSubmitStatus(shiftDispatch, true)
                    }
                }
                
                shiftDispatch({type: SHIFT_SUCCESS})
            }
            fetchShifts()
        }
        
    }, [history, userInfo, dispatch, shiftDispatch])

    return (
        <div>
            <h1>ようこそ {profile.name} さん</h1>
            <Row className='py-3'> 

                {loading ? <Loader />
                    :
                    <Col md={5} sm={12} className='py-2'>
                        <h4>シフト提出</h4>
                        <Container className='border'>
                            <LinkContainer to='/shifts/submit' className='d-grid gap-2 my-3 p-1'>
                                <Button size='lg' variant='primary' disabled={isSubmitted || (new Date() > deadline)}>今月分はこちらから <p className='m-0'>{getStringDate(period[0])} ~ { getStringDate(period[1])}</p></Button>
                            </LinkContainer>
                            <p className='my-0 py-0'>提出状態： {isSubmitted ?　<i style={{color: 'blue'}}>提出済み</i> : <i style={{color: 'red'}}>未提出</i>}</p>
                            <p className='my-0 py-0'>提出期限： {String(format(deadline, "yyyy-MM-dd' 'HH:mm"))} まで</p>
                            {(!isSubmitted && (new Date() > deadline)) &&
                                <Message variant='danger'>期限内に提出できていません → 担当マネージャーに連絡！</Message>
                            }
                        </Container>

                        
                        <h4 className='mt-5'>シフト管理</h4>
                        {shifts.length === 0 ? <Message variant='info'>シフトがありません</Message> :
                            <Table striped hover responsive className='table-sm border' >
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
                                                { shift.is_confirmed ? 
                                                    <LinkContainer to={`/shifts/confirm/${shift._id}`}>
                                                        <Button className='btn-sm' variant='outline-primary'>詳細</Button>
                                                    </LinkContainer> 
                                                    :
                                                    <LinkContainer to={`/shifts/update/${shift._id}`}>
                                                        <Button className='btn-sm' variant='outline-info'>更新</Button>
                                                    </LinkContainer> 
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>          
                        }
                        
                    </Col>
                }



                {profileLoading ? <Loader /> :
                    <Col md={7} sm={12} className='py-2'>

                    <Row>
                        <Col md ={10} sm={10} xs={10}>
                            <h4>プロフィール</h4>
                        </Col>
                        <Col md={2} sm={2} xs={2} className='m-0 px-0 pb-2 text-center'>
                            <LinkContainer to={'/update/profile'}>
                                    <Button variant='outline-secondary'className='btn-sm'>編集</Button>
                            </LinkContainer>
                        </Col>
                    </Row>
                        


                        <Table striped hover responsive size='sm' className='border'>
                            <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td>{profile._id}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>名前</td>
                                    <td>{profile.name}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>職務</td>
                                    <td>{profile.duty}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>セクション</td>
                                    <td>{profile.section}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>雇用形態</td>
                                    <td>{profile.employment_status}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>研修中</td>
                                    <td>{profile.is_rookie ? '研修中' : '修了'}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>オープン</td>
                                    <td>{profile.is_open_staff ? '可' : '不可'}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>10時締め</td>
                                    <td>{profile.is_pre_close_staff ? '可' : '不可'}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>締め</td>
                                    <td>{profile.is_close_staff ? '可' : '不可'}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td> 業務開始時間</td>
                                    <td> {profile.start_default.substring(0,5)}</td>
                                    <td>提出時に自動入力される値です</td>
                                </tr>
                                <tr>
                                    <td> 業務終了時間</td>
                                    <td> {profile.end_default.substring(0,5)}</td>
                                    <td>提出時に自動入力される値です</td>
                                </tr>
                                <tr>
                                    <td> 週間希望シフト回数</td>
                                    <td> 週{profile.desired_times_per_week}</td>
                                    <td>シフト作成の参考にします</td>
                                </tr>
                                <tr>
                                    <td> 希望就労時間</td>
                                    <td> {profile.desired_working_time}h</td>
                                    <td>シフト作成の参考にします</td>
                                </tr>
                                <tr>
                                    <td> 通勤方法</td>
                                    <td> {profile.commute}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td> 最寄り駅</td>
                                    <td> {profile.station}</td>
                                    <td> 最短経路が交通費支給額です</td>
                                </tr>
                            
                            </tbody>
                        </Table>
                    </Col>
                } 


            </Row>
        </div>
    )
}

export default ProfileScreen
