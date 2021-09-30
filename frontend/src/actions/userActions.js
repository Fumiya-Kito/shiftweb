import axios from 'axios'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
 } from '../constants/userConstants'



export const login = async (email, password, dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await axios.post(
            '/api/users/login/',
            { 'username': email, 'password': password },
            config
        )
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch(error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                :error.message,
        })
    }
}



export const logout = (loginDispatch) => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('profile')
    loginDispatch({ type: USER_LOGOUT })
}


export const register = async (name, email, password, dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(
            '/api/users/register/',
            { 'name': name, 'email': email, 'password': password },
            config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getProfile = async (dispatch, userInfo) => {
    dispatch({ type: USER_PROFILE_REQUEST })
    
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization : `Bearer ${userInfo.token}`
        }
    }
    const { data } = await axios.get(
        '/api/users/profile/',
        config
    )
    dispatch({
        type: USER_PROFILE_SUCCESS,
        payload: data
    })

    localStorage.setItem('profile', JSON.stringify(data))
}