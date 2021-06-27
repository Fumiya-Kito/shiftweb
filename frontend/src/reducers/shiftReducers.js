import {
    SHIFT_ADD_ITEM,
    SHIFT_UPDATE_ITEM,
    SHIFT_REMOVE_ITEM,
    SHIFT_RESET,
} from '../constants/shiftConstants'

//initial state
export const shiftInitialState = {
    shiftItems: [],
}

export const shiftReducer = (state, action) => {
    switch (action.type) {
        case SHIFT_ADD_ITEM:
            const item = action.payload
            const existItem = state.shiftItems.find(x => x.date === item.date)
            if (existItem) {
                //update
                return { shiftItems: state.shiftItems.map(x => x.date === existItem.date ? item : x)  }
            } else {
                //truly add
                return { shiftItems : [...state.shiftItems, item] }
            }
        case SHIFT_REMOVE_ITEM:
            return { shiftItems : state.shiftItems.filter(x => x.date !== action.payload)}
        case SHIFT_RESET:
            return shiftInitialState
        default:
            return state
    }
}