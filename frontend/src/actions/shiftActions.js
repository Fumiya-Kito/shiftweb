import {
    SHIFT_ADD_ITEM,
    SHIFT_REMOVE_ITEM,
    SHIFT_RESET,
} from '../constants/shiftConstants'


export const addShiftItem = async(dispatch, date, isWork, startTime, endTime, isAllDay) => {
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

export const updateShiftItem = (dispatch, date, isWork, startTime, endTime, isAllDay) => {
    dispatch({
        type: SHIFT_REMOVE_ITEM,
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