import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import { Edit3, Save } from 'react-feather'
import { Card, CardBody, CardText, CardTitle, Form, FormGroup, Input, Label, Button, Spinner } from 'reactstrap'
import { removePopper, setPopper } from '../../../utils/cyHelpers'
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

            document.getElementsByTagName('body')[0].appendChild(popperCard)
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
  const [title, setTitle] = useState(data.title)
  const [summary, setSummary] = useState(data.summary || '')
  const [content, setContent] = useState(data.content || '')
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSpinnerDisplay('d-block')


    setSpinnerDisplay('d-none')

    removePopper(el.id(), `popper-${el.id()}`, poppers)
  }

  const getChangeHandler = setter => event => setter(event.target.value)

  return <Card className="border-dark">
    <CardBody>
      <CardTitle
        tag="h5"
        className="mw-100 mb-4"
        style={{ minWidth: '50vw' }}
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
            <Input type="text" name="title" id="title" value={title} required maxLength="20"
                   autoComplete="off" onChange={getChangeHandler(setTitle)}/>
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
          <FormGroup>
            <Button color="primary"><Save/> Save</Button>&nbsp;<Spinner className={spinnerDisplay}/>
          </FormGroup>
        </Form>
      </CardText>
    </CardBody>
  </Card>
}
