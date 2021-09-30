import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_RESET,
} from '../constants/userConstants'

const userInfoFromStrage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const profileFromStrage = localStorage.getItem('profile') ?
    JSON.parse(localStorage.getItem('profile')) : {}

//initial state
export const loginInitialState = {
    userInfo: userInfoFromStrage,
    error: false,
    loading: false
}
export const profileInitialState = {
    profile: profileFromStrage,
    error: false,
    loading: true,
}

//reducer
export const userLoginReducer = (state, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo : action.payload}
        case USER_LOGIN_FAIL:
            return { loading: false, error: true}
        case USER_LOGOUT:
            return { loading: false, userInfo: null }
        default:
            return state
    }
}


    
export const userProfileReducer = (state, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { ...state, loading: true }
        case USER_PROFILE_SUCCESS:
            return { ...state, loading: false, profile : action.payload}
        case USER_PROFILE_FAIL:
            return { ...state, loading: false, error: true}
        case USER_PROFILE_RESET:
            return profileInitialState
        default:
            return state
    }
}