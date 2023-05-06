import React, {useState, useEffect} from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {useLoginStore} from '../context'


function SearchBox() {
    const getStringMonth = (dt = new Date(), x) => {
        return dt.getFullYear() + '-' + ('0'+(dt.getMonth()+1+x)).slice(-2)
    }
    const [section, setSection] = useState('')
    const [period, setPeriod] = useState(getStringMonth(new Date(), 0))

    const loginState = useLoginStore()
    const { userInfo } = loginState
    
    let history = useHistory()

    useEffect(() => {
        if (history.location.search) {
            setSection(decodeURI(history.location.search.split('=')[1].split('&')[0]))
            setPeriod(history.location.search.split('=')[2])
        }
    }, [history.location.search])

    const submitHandler = (e) => {
        e.preventDefault()
        if (section && period) {
            if (userInfo.email === 'demo@email.com') {
                history.push(`/demo/admin/shiftlist/?section=${section}&period=${period}`)
            } else {
                history.push(`/admin/shiftlist/?section=${section}&period=${period}`)
            }
        } else {
            history.push(history.location.pathname)
        }
    }

    return (
        <Form onSubmit={submitHandler} inline className='mb-5'>
            <Row>
                <Col xs={12} sm={4} md={4} lg={4} xl={4} className='mb-2'>
                    <Form.Group controlId='section'>
                        <Form.Control
                            required
                            as='select'
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            <option value={'フロント'}>フロント</option>
                            <option value={'キッチン'}>キッチン</option>
                            <option value={'ドリング'}>ドリンク</option>
                            <option value={'映写'}>映写</option>
                            <option value={'コンセ'}>コンセ</option>
                            <option value={'ボックス'}>ボックス</option>
                            <option value={'ショップ'}>ショップ</option>
                            <option value={''}>「セクション」を選択</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={4} md={4} lg={4} xl={4} className='mb-2'>
                    <Form.Group controlId='period'>
                        {/* <Form.Label className='mb-0'>期間</Form.Label> */}
                        <Form.Control
                            required
                            as='select'
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            style={{cursor: 'pointer'}}
                        >
                            {[-1, 0, 1].map((x) => 
                                <option key={x} value={getStringMonth(new Date(), x)}>{getStringMonth(new Date(), x)}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={2}>
                    {section && period ?                       
                        <Button
                            type='submit'
                            variant='outline-success'
                            className='px-2'
                        >
                            検索
                        </Button>
                        :
                        <Button
                            disabled
                            type='submit'
                            variant='outline-secondary'
                            className='px-2'
                        >
                            検索
                        </Button>
                    }
                </Col>
            </Row>


        </Form>
    )
}

export default SearchBox
