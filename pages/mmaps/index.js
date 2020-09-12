import React, { useContext, useState } from 'react'
import { Plus } from 'react-feather'
import {
  Button, Col, Form, FormGroup, Input, PopoverBody, PopoverHeader, Row, Spinner, UncontrolledPopover
} from 'reactstrap'
import AuthPrompt from '../../components/auth/AuthPrompt'
import GlobalContext from '../../components/GlobalContext'
import MindMaps from '../../components/mindmap/MindMaps'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper, { fetcher } from '../../utils/fetchWrapper'

const Page = () => {
  const { user } = useUser()
  const { data, error } = fetchWrapper(user, '/api/mindmaps')
  const { notify } = useContext(GlobalContext)
  const [name, setName] = useState()
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')

  if (user) {
    if (error && notify.current) {
      const options = {
        place: 'tr',
        message: 'Failed to fetch mind maps!',
        type: 'danger',
        autoDismiss: 7
      }

      notify.current.notificationAlert(options)
    }

    const handleChange = (event) => setName(event.target.value)
    const handleSubmit = async (event) => {
      event.preventDefault()

      setSpinnerDisplay('d-block')
      await fetcher('/api/mindmaps', user.token, 'POST', JSON.stringify({ name }))
      setSpinnerDisplay('d-none')
    }

    const output = [
      <Row key='title'>
        <Col xs="auto"><h3>Your Mind Maps</h3></Col>
        <Col xs="auto">
          <Button color='primary' size='sm' id='create'><Plus/> Create</Button>
          <UncontrolledPopover placement="bottom" target="create" trigger="legacy">
            <PopoverHeader>Create Mind Map</PopoverHeader>
            <PopoverBody>
              <Form onSubmit={handleSubmit} inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input type="text" name="name" id="name" placeholder="Enter a name and hit ⏎"
                         value={name} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className={spinnerDisplay}><Spinner/></FormGroup>
              </Form>
            </PopoverBody>
          </UncontrolledPopover>
        </Col>
      </Row>
    ]

    output.push(
      <Row key='content'>
        <Col>
          {(data && !error) ? <MindMaps data={data.data}/> : <Spinner/>}
        </Col>
      </Row>
    )

    return output
  }

  return <AuthPrompt/>
}

export default Page