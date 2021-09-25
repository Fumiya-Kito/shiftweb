import {
    SHIFT_REQUEST,
    SHIFT_SUCCESS,
    SHIFT_ADD_ITEM,
    SHIFT_REMOVE_ITEM,
    SHIFT_CHANGE_STATUS,
    SHIFT_CHANGE_PERIOD,
    SHIFT_RESET,
} from '../constants/shiftConstants'

import { startOfMonth, endOfMonth, subDays, addMonths, endOfDay } from 'date-fns'




//initial state
export const shiftInitialState = {
    shiftItems: [],
    isSubmitted: false,
    loading: true,
    period: [
        endOfDay(startOfMonth(addMonths(new Date(), 1))),
        endOfDay(endOfMonth(addMonths(new Date(), 1)))
    ],
    deadline: subDays(endOfDay(endOfMonth(new Date())), 10),
}

//ruducers
export const shiftReducer = (state, action) => {
    switch (action.type) {
        case SHIFT_REQUEST:
            return { ...state, loading: true}
        case SHIFT_SUCCESS:
            return { ...state, loading: false}
        case SHIFT_ADD_ITEM:
            const item = action.payload
            const existItem = state.shiftItems.find(x => x.date === item.date)
            if (existItem) {
                //update
                return {
                    ...state,
                    loading: false,
                    shiftItems: state.shiftItems.map(x => x.date === existItem.date ? item : x)
                }
            } else {
                //truly add
                return {
                    ...state,
                    loading: false,
                    shiftItems: [...state.shiftItems, item]
                }
            }
        case SHIFT_REMOVE_ITEM:
            return {
                ...state,
                loading: false,
                shiftItems: state.shiftItems.filter(x => x.date !== action.payload)
            }
        case SHIFT_CHANGE_STATUS:
            return {
                ...state,
                loading: false,
                isSubmitted: action.payload
            }
        case SHIFT_CHANGE_PERIOD:
            return {
                ...state,
                loading: false,
                deadline: action.payload
            }
        case SHIFT_RESET:
            return shiftInitialState
        default:
            return state
    }
}
