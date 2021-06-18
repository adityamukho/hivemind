import React, { useRef, useState } from 'react'
import { Plus } from 'react-feather'
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
  Spinner,
} from 'reactstrap'
import { mutate } from 'swr'
import AuthPrompt from '../../components/auth/AuthPrompt'
import MindMaps from '../../components/mindmap/MindMaps'
import { useUser } from '../../utils/auth/useUser'
import useFetch, { fetcher } from '../../utils/useFetch'

const Page = () => {
  const { user } = useUser()
  const { data, error } = useFetch(user, '/api/mindmaps')
  const inputRef = useRef(null)
  const [name, setName] = useState('')
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')
  const [popoverOpen, setPopoverOpen] = useState(false)

  const toggle = () => {
    setPopoverOpen(!popoverOpen)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  if (typeof user === 'undefined') {
    return <Spinner />
  }

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch mind maps!',
      type: 'danger',
      autoDismiss: 7,
    }

    window.notify(options)
  }

  if (user) {
    const handleChange = (event) => setName(event.target.value)
    const handleSubmit = async (event) => {
      event.preventDefault()
      setSpinnerDisplay('d-block')
      const { data: result, ok } = await fetcher(
        '/api/mindmaps',
        user.token,
        'POST',
        JSON.stringify({ name })
      )
      const options = {
        place: 'tr',
        autoDismiss: 7,
      }

      if (ok) {
        options.message = 'Added mindmap!'
        options.type = 'success'
        setName('')
        mutate(['/api/mindmaps', user.token])
        setPopoverOpen(false)
      } else {
        options.message = `Failed to add mindmap! - ${JSON.stringify(result)}`
        options.type = 'danger'
      }

      setSpinnerDisplay('d-none')
      if (window.notify) {
        window.notify(options)
      }
    }

    const output = [
      <Row key="title">
        <Col xs="auto">
          <h3>My Mind Maps</h3>
        </Col>
        <Col xs="auto">
          <Button color="success" size="sm" id="create">
            <Plus /> Create
          </Button>
          <Popover
            placement="bottom"
            target="create"
            isOpen={popoverOpen}
            toggle={toggle}
          >
            <PopoverHeader>Create Mind Map</PopoverHeader>
            <PopoverBody>
              <Form onSubmit={handleSubmit} inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Type a name and hit ⏎"
                    value={name}
                    onChange={handleChange}
                    required
                    maxLength="20"
                    autoComplete="off"
                    innerRef={inputRef}
                  />
                </FormGroup>
                <FormGroup className={spinnerDisplay}>
                  <Spinner />
                </FormGroup>
              </Form>
            </PopoverBody>
          </Popover>
        </Col>
      </Row>,
    ]

    output.push(
      <Row key="content">
        <Col>
          {data && !error ? <MindMaps data={data.data} /> : <Spinner />}
        </Col>
      </Row>
    )

    return output
  }

  return <AuthPrompt />
}

export default Page
