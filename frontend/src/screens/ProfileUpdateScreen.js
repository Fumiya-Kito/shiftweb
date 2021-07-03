import React, {useEffect} from 'react'
import { useProfileDispatch, useProfileStore, useLoginStore } from '../context'
import { getProfile } from '../actions/userActions'
import { Form, Container } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

function ProfileUpdateScreen({history}) {
    //local states
    

    //global states
    const loginState = useLoginStore()
    const {userInfo} = loginState
    const dispatch = useProfileDispatch()
    const profileState = useProfileStore()
    const { profile } = profileState

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            getProfile(dispatch, userInfo)
        }
    }, [history, userInfo])

    return (
        <FormContainer>
            <Form>

            </Form>
        </FormContainer>
    )
}

export default ProfileUpdateScreen
