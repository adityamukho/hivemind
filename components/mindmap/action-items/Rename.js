import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import {
  Button, Card, CardBody, CardText, Form, FormGroup, Input, Popover, PopoverBody, PopoverHeader
} from 'reactstrap'
import { useUser } from '../../../utils/auth/useUser'
import { fetcher } from '../../../utils/fetchWrapper'
import ToolTippedButton from './ToolTippedButton'

export default function Rename ({ name, mindmapkey, nameChangedCallBack }) {
  const { user } = useUser()
  const [popoverOpen, setPopoverOpen] = useState(false)

  let [nameState, setName] = useState(name)
  const handleSubmit = async (event) => {
    event.preventDefault()

    await fetcher(
      `/api/mindmaps`,
      user.token,
      'PATCH',
      JSON.stringify({
        name: nameState,
        _id: mindmapkey
      })
    )

    if (nameChangedCallBack) {
      nameChangedCallBack(nameState)
    }

    setPopoverOpen(false)
  }
  useEffect(() => {
    setName(name)
  }, [name])

  return (
    <>
      <ToolTippedButton
        tooltip="Rename"
        className="ml-1"
        outline
        color="secondary"
        id="rename"
      >
        <Edit size={16}/>
      </ToolTippedButton>
      <Popover
        target="rename"
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(!popoverOpen)}
        boundariesElement={'rename'}
        placement={'bottom-start'}
      >
        <PopoverHeader>Rename</PopoverHeader>
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
                      value={nameState}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                    />
                    <Button
                      className="ml-1"
                      onSubmit={handleSubmit}
                      outline
                      color="secondary"
                      id="save"
                    >
                      Save
                    </Button>
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
