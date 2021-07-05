import React, { useState, useEffect } from 'react'
import { useLoginStore } from '../context'

function HomeScreen({history}) {
    
    const loginState = useLoginStore()
    const {userInfo} = loginState

    useEffect(() => {
       
        history.push('/login')
        
    }, [])

    return (
        <>
            <h1>Home Page</h1>
        </>
    )
}

export default HomeScreen
