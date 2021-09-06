import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useLoginStore } from '../context'


function DemoShiftListScreen({ history }) {

    const loginState = useLoginStore()
    const {userInfo} = loginState

    useEffect(() => {
        if (userInfo && userInfo.email === 'demo@email.com') {
            //api call
            console.log('useEffect')
        } else {
            history.push('/login')
        }
    }, [history, userInfo])
    
    return (
        <div>
            <Link to={'/demo/profile'} className='btn my-2' style={{ background: '#999999'}}>
                ＜ 戻る
            </Link>
            <h1>Shifts（開発中）</h1>
        </div>
    )
}

export default DemoShiftListScreen
