import React, { useEffect, useRef, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import ReactDOM from 'react-dom'
import { Plus } from 'react-feather'
import { Card, CardBody, CardText, CardTitle, Form, FormGroup, Input, Spinner } from 'reactstrap'
import { mutate } from 'swr'
import { useUser } from '../../../utils/auth/useUser'
import { removePopper, setPopper } from '../../../utils/cyHelpers'
import { fetcher } from '../../../utils/fetchWrapper'
import CloseButton from '../CloseButton'

export default function add (menu, poppers, setEls, cy) {
  const add = document.createElement('span')
  ReactDOM.render(<Plus/>, add)
  menu.push({
    fillColor: 'rgba(0, 200, 0, 0.75)',
    content: add.outerHTML,
    contentStyle: {},
    select: function (el) {
      setPopper(
        el.id(),
        el.popper({
          content: () => {
            const popperCard = document.createElement('div')
            ReactDOM.render(<PopperCard setEls={setEls} el={el} poppers={poppers} cy={cy}/>, popperCard)

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

const PopperCard = ({ el, poppers, setEls, cy }) => {
  const { user } = useUser()
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const rootId = cy.nodes().id()
    setSpinnerDisplay('d-block')
    const { data: result, ok } = await fetcher(`/api/nodes?parentId=${el.id()}`, user.token, 'POST',
      JSON.stringify({ title }))
      .then(({ data, ok, status }) => {
        if (ok) {
          const key = rootId.split('/')[1]

          return fetcher(`/api/mindmaps/${key}`, user.token)
        }

        return { data, ok, status }
      })
    const options = {
      place: 'tr',
      autoDismiss: 7
    }

    if (ok) {
      const { elements } = result
      setEls(CytoscapeComponent.normalizeElements(elements))
      mutate([`/api/${rootId}/timeline`, user.token])

      options.message = 'Added node!'
      options.type = 'success'
    }
    else {
      options.message = `Failed to add node! - ${JSON.stringify(result)}`
      options.type = 'danger'
    }

    if (window.notify) {
      window.notify(options)
    }
    setSpinnerDisplay('d-none')
    removePopper(el.id(), `popper-${el.id()}`, poppers)
  }

  return <Card className="border-dark">
    <CardBody>
      <CardTitle
        tag="h5"
        className="mw-100 mb-4"
        style={{ minWidth: '50vw' }}
      >
        Add Child Node{' '}
        <small className="text-muted">(of {el.data().title})</small>
        <CloseButton
          divKey={`popper-${el.id()}`}
          popperKey={el.id()}
          poppers={poppers}
        />
      </CardTitle>
      <CardText tag="div" className="mw-100">
        <Form onSubmit={handleSubmit} inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input type="text" name="title" id="title" placeholder="Type a title and hit ⏎" value={title}
                   onChange={handleChange} required maxLength="50" autoComplete="off" innerRef={inputRef}/>
          </FormGroup>
          <FormGroup className={spinnerDisplay}><Spinner/></FormGroup>
        </Form>
      </CardText>
    </CardBody>
  </Card>
}