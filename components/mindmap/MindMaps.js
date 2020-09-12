import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { Plus } from 'react-feather'
import {
  Button, Col, Form, FormGroup, Input, ListGroup, ListGroupItem, PopoverBody, PopoverHeader, Row, Spinner,
  UncontrolledPopover
} from 'reactstrap'
import useSWR from 'swr'
import { useUser } from '../../utils/auth/useUser'
import { getMindMaps, createMindMap } from '../../utils/db'
import GlobalContext from '../GlobalContext'

const MindMaps = () => {
  const { user } = useUser()
  const { data, error } = useSWR(user ? user.id : null, getMindMaps)
  const { notify: { current: { notificationAlert } } } = useContext(GlobalContext)
  const [name, setName] = useState()
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')

  const handleChange = (event) => setName(event.target.value)
  const handleSubmit = (event) => {
    setSpinnerDisplay('d-block')
    createMindMap(user.id, name).then(() => setSpinnerDisplay('d-none'))
    event.preventDefault()
  }

  if (error) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch mind maps!',
      type: 'danger',
      autoDismiss: 7
    }

    notificationAlert(options)
  }

  const output = [
    <Row>
      <Col xs="auto"><h3>Your Mind Maps</h3></Col>
      <Col xs="auto">
        <Button color='primary' size='sm' id='create'><Plus/> Create</Button>
        <UncontrolledPopover placement="bottom" target="create" trigger="legacy">
          <PopoverHeader>Create Mind Map</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={handleSubmit} inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="text" name="name" id="name" placeholder="Type a name and hit ⏎"
                       value={name} onChange={handleChange}/>
              </FormGroup>
              <FormGroup className={spinnerDisplay}><Spinner/></FormGroup>
            </Form>
          </PopoverBody>
        </UncontrolledPopover>
      </Col>
    </Row>
  ]
  if (data && !error) {
    const keys = Object.keys(data)
    if (keys.length) {
      output.push(
        <ListGroup>
          {keys.map(key => <ListGroupItem key={key}>
            <Link href={`/mmaps/${key}`} passHref><a>{data[key].name}</a></Link>&nbsp;
            <span className="text-muted float-right">
              <small>Created: {new Date(data[key].ctime).toString()}</small>
            </span>
          </ListGroupItem>)}
        </ListGroup>
      )
    }
    else {
      output.push(<p>No mind maps found. Try creating one.</p>)
    }
  }
  else {
    output.push(<Spinner/>)
  }

  return output
}

export default MindMaps