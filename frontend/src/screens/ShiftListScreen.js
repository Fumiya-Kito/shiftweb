import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'

import { useLoginStore } from '../context'
import { takeMonth } from '../constants/month'


import Message from '../components/Message'
import Loader from '../components/Loader'
import SearchBox from '../components/SearchBox'

function ShiftListScreen({ history }) {

    const loginState = useLoginStore()
    const { userInfo } = loginState
    
    const [shifts, setShifts] = useState([])
    const [month, setMonth] = useState([])

    const [successUpdate, setSuccessUpdate] = useState(false)
    const [loading, setLoading] = useState(true)


    // const month = takeMonth(new Date())()
    const getStringDate = (dt = new Date()) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1)).slice(-2) + '-' + ('0'+dt.getDate()).slice(-2)
    }

    let keyword = history.location.search

    useEffect(() => {


        if (userInfo && userInfo.isAdmin) {
            //api call
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization : `Bearer ${userInfo.token}`
                }
            }

            async function fetchShifts() {
                setLoading(true)
                const { data } = await axios.get(
                    `/api/shifts/admin/shifts${keyword}`,
                    config
                )
                setShifts(data)
                if (!keyword) {
                    setMonth(takeMonth(new Date())())
                }
                else if (data[0]) {
                    setMonth(takeMonth(new Date(String(data[0].period_start)))())
                } else {
                    setMonth(takeMonth(new Date(history.location.search.split('period=')[1]))())
                }
                setLoading(false)
            }
            fetchShifts()
        } else {
            history.push('/login')
        }
    }, [history, userInfo, keyword, successUpdate])


    const checkHandler = (id) => {
        const config= {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }
        async function fetchUpdateIsConfirmed() { 
            const { data } = await axios.put(
                `/api/shifts/confirmed-update/${id}/`,
                config
            )
            setSuccessUpdate(!successUpdate)
        }
        fetchUpdateIsConfirmed()
    }
    
    return (
        <>
            <h1>Shifts</h1>
            <Row>
                <Col lg={6} md={6} sm={8} xs={8} className='pt-2'>
                    <SearchBox/>
                </Col>
                <Col lg={4} md={4} sm={12}>
                    {!keyword && <Message variant='primary'>全シフト表示中（セクション＆期間を選択）</Message>}
                </Col>
                <Col lg={2} md={2} sm={12}>
                    {loading ? <Loader /> :
                        shifts.length === 0 && <Message variant='info'>シフトが存在しません</Message> 
                    }
                </Col>
            </Row>

            
            <Table striped hover responsive className='table-sm border text-center align-middle' bordered>
                <thead>
                    <tr>
                        <th>USER</th>
                        <th className='bg-dark'></th>
                        {month.map((week, i) => (
                            <React.Fragment key={i}>
                                {week.map((date, j) => (
                                    <React.Fragment key={j}>
                                        {date.getMonth() === month[0][6].getMonth() &&
                                            <th>
                                                {date.getMonth()+1}/{date.getDate()}
                                            </th>
                                        }
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                        <th>Edit</th>
                        <th className='px-4'>Confirm</th>
                    </tr>
                </thead>
                <tbody>

                    {shifts.map((shift) => (
                        <tr key={shift._id}>
                            <td>{shift.user_name ? (shift.user_name) : 'ー'}</td>
                            <td className='bg-dark'></td>
                            {month.map((week, i) => (
                                <React.Fragment key={i}>
                                    {week.map((date, j) => (
                                        <React.Fragment key={j}>
                                            {date.getMonth() === month[0][6].getMonth() &&
                                                <td>
                                                    {shift.shiftItems.map((item, k) => (
                                                        <React.Fragment key={k}>
                                                            {item.date === getStringDate(date) &&
                                                                <div>
                                                                    {item.start_time.substring(0, 5)}
                                                                    <br></br>
                                                                    {item.end_time.substring(0, 5)}
                                                                </div>
                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </td>
                                            }
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                            <td>
                                <LinkContainer to={`/shifts/update/${shift._id}`}>
                                    {!shift.is_confirmed ? 
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                        :
                                        <Button disabled variant='light' className='btn-sm'>
                                            <i className='fas fa-check'></i>
                                        </Button>
                                    }
                                </LinkContainer>
                            </td>
                            <td>
                                {!shift.is_confirmed ? 
                                    <Button variant='outline-danger' className='btn-sm' onClick={() => checkHandler(shift._id)}>
                                        確定させる
                                    </Button>
                                    :
                                    <Button variant='outline-info' className='btn-sm ' onClick={() => checkHandler(shift._id)}>
                                        未確定へ
                                    </Button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
        </>
    )
}

export default ShiftListScreen
