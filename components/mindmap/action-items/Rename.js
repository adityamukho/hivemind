import { pick } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { Button, Form, Input, FormGroup, Tooltip, Card, CardBody, CardText, Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { fetcher } from '../../../utils/fetchWrapper'
import { useUser } from '../../../utils/auth/useUser'
export default function Rename({ name, mindmapkey, nameChangedCallBack }) {
    const { user } = useUser()
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false);

    let [nameState, setName] = useState(name)
    const handleSubmit = async (event) => {
        console.log("submit", event, nameState)
        event.preventDefault()
        const result = await fetcher(`/api/mindmaps/${mindmapkey}`, user.token, 'POST',
            JSON.stringify({ name: nameState }))
        console.log({result})
        if (nameChangedCallBack) {
            nameChangedCallBack(nameState)
        }
        setPopoverOpen(false)
    }
    useEffect(() => {
        setName(name)
    }, [name])

    return <>
        <Button className="ml-1" outline color="secondary" id="rename">
            <Edit size={16} />
        </Button>
        <Tooltip
            placement="top"
            target="rename"
            isOpen={tooltipOpen}
            toggle={() => setTooltipOpen(!tooltipOpen)}
        >
            Rename
      </Tooltip>
        <Popover target="rename" isOpen={popoverOpen} toggle={() => setPopoverOpen(!popoverOpen)}
            boundariesElement={'rename'} placement={'bottom-start'}>
            <PopoverHeader>Rename</PopoverHeader>
            <PopoverBody>
                <Card>
                    <CardBody>
                        <CardText tag="div">
                            <Form onSubmit={handleSubmit} inline>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Input type="text" name="name" id="name"
                                        value={nameState}
                                        onChange={e => setName(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <Button className="ml-1" onSubmit={handleSubmit} outline color="secondary" id="save">Save</Button>
                                </FormGroup>
                            </Form>
                        </CardText>
                    </CardBody>
                </Card>
            </PopoverBody>
        </Popover>
    </>
}