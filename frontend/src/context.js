import React, { useReducer } from 'react'
import { userLoginReducer, loginInitialState, userProfileReducer, profileInitialState } from './reducers/userReducers'
import { shiftReducer, shiftInitialState } from './reducers/shiftReducers'


export const makeStore = (reducer, initialState) => {
    const storeContext = React.createContext()
    const dispatchContext = React.createContext()

    const StoreProvider = ({ children }) => {
        const [store, dispatch] = useReducer(reducer, initialState);
    
        return (
            <dispatchContext.Provider value={dispatch}>
                <storeContext.Provider value={store}>
                    { children }
                </storeContext.Provider>
            </dispatchContext.Provider>
        )
    }

    const useStore = () => {
      return React.useContext(storeContext);
    }

    const useDispatch = () => {
      return React.useContext(dispatchContext);
    }

    return [StoreProvider, useStore, useDispatch]
}


export const [LoginProvider, useLoginStore, useLoginDispatch] = makeStore(userLoginReducer, loginInitialState)
export const [ProfileProvider, useProfileStore, useProfileDispatch] = makeStore(userProfileReducer, profileInitialState)
export const [ShiftProvider, useShiftStore, useShiftDispatch] = makeStore(shiftReducer, shiftInitialState)