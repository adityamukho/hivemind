import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Edit3, Save } from 'react-feather'
import {
  Button, Card, CardBody, CardText, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner
} from 'reactstrap'
import { mutate } from 'swr'
import { useUser } from '../../../utils/auth/useUser'
import { removePopper, setPopper } from '../../../utils/cyHelpers'
import { fetcher } from '../../../utils/fetchWrapper'
import CloseButton from '../CloseButton'

export default function edit (menu, poppers) {
  const edit = document.createElement('span')
  ReactDOM.render(<Edit3/>, edit)
  menu.push({
    fillColor: 'rgba(255, 165, 0, 0.75)',
    content: edit.outerHTML,
    select: function (el) {
      setPopper(
        el.id(),
        el.popper({
          content: () => {
            const popperCard = document.createElement('div')
            ReactDOM.render(<PopperCard poppers={poppers} el={el}/>, popperCard)

            document.body.appendChild(popperCard)
            popperCard.setAttribute('id', `popper-${el.id()}`)

            return popperCard
          }
        }),
        poppers
      )
    },
    enabled: true
  })
}

const PopperCard = ({ el, poppers }) => {
  const data = el.data()
  const [coll] = data.id.split('/')
  const { user } = useUser()
  const [title, setTitle] = useState(data.title)
  const [summary, setSummary] = useState(data.summary || '')
  const [content, setContent] = useState(data.content || '')
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSpinnerDisplay('d-block')

    const rootId = el.cy().nodes().id()
    const key = rootId.split('/')[1]
    const result = await fetcher(`/api/${coll}`, user.token, 'PATCH', JSON.stringify({
      title,
      summary,
      content,
      _id: data.id,
      _rev: data._rev
    }))
    const { ok } = result;
    const options = {
      place: 'tr',
      autoDismiss: 7
    }

    if (ok) {

      mutate([`/api/timeline/events?key=${key}`, user.token], null, true)
      mutate([`/api/mindmaps/${key}?timestamp=`, user.token], null, true)

      options.message = 'Updated node!'
      options.type = 'success'
    }
    else {
      options.message = `Failed to update node! - ${JSON.stringify(result)}`
      options.type = 'danger'
    }

    if (window.notify) {
      window.notify(options)
    }
    setSpinnerDisplay('d-none')

    removePopper(el.id(), `popper-${el.id()}`, poppers)
  }

  const getChangeHandler = setter => event => setter(event.target.value)

  return <Card className="border-dark">
    <CardBody>
      <CardTitle
        tag="h5"
        className="mw-100 mb-4"
      >
        Edit {data.title}
        <CloseButton
          divKey={`popper-${el.id()}`}
          popperKey={el.id()}
          poppers={poppers}
        />
      </CardTitle>
      <CardText tag="div">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" value={title} required maxLength="50"
                   autoComplete="off" onChange={getChangeHandler(setTitle)} innerRef={inputRef}/>
          </FormGroup>
          <FormGroup>
            <Label for="summary">Summary</Label>
            <Input type="text" name="summary" id="summary" value={summary} maxLength="100"
                   autoComplete="off" onChange={getChangeHandler(setSummary)}/>
          </FormGroup>
          <FormGroup>
            <Label for="summary">Content</Label>
            <Input type="textarea" name="content" id="content" value={content}
                   onChange={getChangeHandler(setContent)}/>
          </FormGroup>
          <Row form>
            <Button block={true} color="primary"><Save/> Save</Button>
            <Spinner className={spinnerDisplay}/>
          </Row>
        </Form>
      </CardText>
    </CardBody>
  </Card>
}
