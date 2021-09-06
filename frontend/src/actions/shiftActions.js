import {
    SHIFT_ADD_ITEM,
    SHIFT_REMOVE_ITEM,
    SHIFT_CHANGE_STATUS,
    SHIFT_CHANGE_PERIOD,
} from '../constants/shiftConstants'


export const addShiftItem = (dispatch, date, isWork, startTime, endTime, isAllDay) => {
    dispatch({
        type: SHIFT_ADD_ITEM,
        payload: {
            date,
            isWork,
            startTime,
            endTime,
            isAllDay
        }
    })
}

export const removeShiftItem = (dispatch, date) => {
    dispatch({
        type: SHIFT_REMOVE_ITEM,
        payload: date
    })
}

export const changeSubmitStatus = (dispatch, value) => {
    dispatch({
        type: SHIFT_CHANGE_STATUS,
        payload: value
    })
}

export const changePeriod = (dispatch, time) => {
    dispatch({
        type: SHIFT_CHANGE_PERIOD,
        payload: time
    })
}
