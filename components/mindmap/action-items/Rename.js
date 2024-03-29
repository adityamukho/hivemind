import React, { useEffect, useRef, useState } from 'react'
import { Edit3, Save } from 'react-feather'
import {
  Button,
  Card,
  CardBody,
  CardText,
  Form,
  FormGroup,
  Input,
  Popover,
  PopoverBody,
  PopoverHeader,
  Spinner,
} from 'reactstrap'
import { mutate } from 'swr'
import { useUser } from '../../../utils/auth/useUser'
import { fetcher } from '../../../utils/useFetch'
import ToolTippedButton from '../ToolTippedButton'

export default function Rename({
  rootNode,
  nameChangedCallBack,
  disabled = false,
}) {
  const { user } = useUser()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [spinnerDisplay, setSpinnerDisplay] = useState('d-none')
  const [name, setName] = useState()
  const [rev, setRev] = useState()
  const inputRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSpinnerDisplay('d-block')

    const { data: result, ok, status } = await fetcher(
      `/api/mindmaps`,
      user.token,
      'PATCH',
      JSON.stringify({
        name: name,
        _id: rootNode._id,
        _rev: rev,
      })
    )
    const options = {
      place: 'tr',
      autoDismiss: 7,
    }

    if (ok) {
      setRev(result._rev)
      mutate(
        [`/api/timeline/events?key=${rootNode._key}`, user.token],
        null,
        true
      )

      options.message = 'Renamed mindmap!'
      options.type = 'success'
      setPopoverOpen(false)

      if (nameChangedCallBack) {
        nameChangedCallBack(name)
      }
    } else {
      options.message = `Failed to rename mindmap! - ${JSON.stringify(
        result || status
      )}`
      options.type = 'danger'
    }

    setSpinnerDisplay('d-none')
    if (window.notify) {
      window.notify(options)
    }
  }

  useEffect(() => {
    setName(rootNode.name)
    setRev(rootNode._rev)
  }, [rootNode])

  useEffect(() => {
    if (popoverOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [popoverOpen])

  return (
    <>
      <ToolTippedButton
        tooltip="Rename"
        className="ml-1"
        outline
        color={disabled ? 'secondary' : 'primary'}
        id="rename"
        disabled={disabled}
      >
        <Edit3 size={16} />
      </ToolTippedButton>
      <Popover
        target="rename"
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(!popoverOpen)}
        boundariesElement={'rename'}
        placement={'bottom-end'}
      >
        <PopoverHeader>
          Rename <small>{rootNode.name}</small>
        </PopoverHeader>
        <PopoverBody>
          <Card>
            <CardBody>
              <CardText tag="div">
                <Form onSubmit={handleSubmit} inline>
                  <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                      required
                      innerRef={inputRef}
                    />
                    <Button
                      className="ml-1"
                      onSubmit={handleSubmit}
                      color="primary"
                      id="save"
                    >
                      <Save /> Save
                    </Button>
                  </FormGroup>
                  <FormGroup className={spinnerDisplay}>
                    <Spinner />
                  </FormGroup>
                </Form>
              </CardText>
            </CardBody>
          </Card>
        </PopoverBody>
      </Popover>
    </>
  )
}
