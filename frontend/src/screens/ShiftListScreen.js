import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'

import { useLoginStore } from '../context'
import { takeMonth } from '../constants/month'

import axios from 'axios'

import Message from '../components/Message'
import Loader from '../components/Loader'

import SearchBox from '../components/SearchBox'

function ShiftListScreen({ history }) {

    const loginState = useLoginStore()
    const { userInfo } = loginState
    
    const [shifts, setShifts] = useState([])
    const [month, setMonth] = useState([])

    // const month = takeMonth(new Date())()
    const getStringDate = (dt = new Date()) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1)).slice(-2) + '-' + ('0'+dt.getDate()).slice(-2)
    }


    let keyword = history.location.search

    const checkHandler = (e) => {
        e.preventDefault()
    }

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
            }
            fetchShifts()

        } else {
            history.push('/login')
        }
    }, [history, userInfo, keyword])
    
    return (
        <div>
            <h1>Shifts</h1>
            <SearchBox/>

            {!keyword && <Message variant='primary'>全シフト表示中（セクション＆期間を選択）</Message>}
            <Table striped hover responsive className='table-sm border text-center align-middle' bordered>
                <thead>
                    <tr>
                        <th>USER</th>
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

            {shifts.length === 0 && <Message variant='info'>シフトが存在しません</Message>}
        </div>
    )
}

export default ShiftListScreen
