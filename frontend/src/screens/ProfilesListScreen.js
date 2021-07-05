import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table } from 'react-bootstrap'

function ProfileListScreen() {
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        async function fetchUsers() { 
            const { data } = await axios.get('/api/users/') 
            setUsers(data) 
        }
        fetchUsers()


        async function fetchProfile() { 
            const { data } = await axios.get('/api/users/profiles/') 
            setProfiles(data)
        }
        fetchProfile()
    }, [])

    return (
        <div>
            <h1>Profiles</h1>
            <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>DUTY STATUS</th>
                        <th>SECTION</th>
                        <th>EMPLOY STATUS</th>
                        <th>ROOKIE</th>
                        <th>OPEN</th>
                        <th>PRE-CLOSE</th>
                        <th>CLOSE</th>
                        <th>D-START</th>
                        <th>D-END</th>
                        <th>D-WORK</th>
                        <th>D-TIME</th>
                        <th>COMMUTE</th>
                        <th>STATION</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile) => (
                        <tr key={profile._id}>
                            <td>{profile._id}</td>
                            <td>{profile.name}</td>
                            <td>{profile.duty}</td>
                            <td>{profile.section}</td>
                            <td>{profile.employment_status}</td>
                            <td>{profile.str_is_rookie}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{profile.start_default.substring(0,5)}</td>
                            <td>{profile.end_default.substring(0,5)}</td>
                            <td>{profile.desired_times_per_week} times</td>
                            <td>{profile.desired_working_time} hours</td>
                            <td>{profile.commute}</td>
                            <td>{profile.station}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
        
            </Table>
        </div>
    )
}

export default ProfileListScreen
