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
    loading: false,
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
            return { userInfo: null}
        default:
            return state
    }
}


export const userRegisterReducer = (state, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
                return { loading: false, userInfo : action.payload}
        case USER_REGISTER_FAIL:
            return { loading: false, error: true}
        case USER_LOGOUT:
            return { userInfo: null}
        default:
            return state
    }
}
    
    
export const userProfileReducer = (state, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { loading: true }
        case USER_PROFILE_SUCCESS:
            return { loading: false, profile : action.payload}
        case USER_PROFILE_FAIL:
            return { loading: false, error: true}
        case USER_PROFILE_RESET:
            return { profile: {}}
        default:
            return state
    }
}
// export const useUserLoginReducer = () => {
//     const [state, dispatch] = useReducer(userLoginReducer, initialState)
//     return [state, dispatch] 
// }

// export const useUserRegisterReducer = () => {
//     const [state, dispatch] = useReducer(userRegisterReducer, initialState)
//     return [state, dispatch] 
// }