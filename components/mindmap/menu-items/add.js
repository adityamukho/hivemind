import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import ReactDOM from 'react-dom'
import { Plus } from 'react-feather'
import { Card, CardBody, CardLink, CardText, CardTitle, Form, FormGroup, Input, Spinner } from 'reactstrap'
import { removePopper, setPopper } from '../../../utils/cyHelpers'
import { fetcher } from '../../../utils/fetchWrapper'
import CloseButton from '../CloseButton'

export default function add (menu, poppers, user, setEls, cy) {
  const add = document.createElement('span')
  ReactDOM.render(<Plus/>, add)
  menu.push({
    fillColor: 'rgba(0, 200, 0, 0.75)',
    content: add.outerHTML,
    contentStyle: {},
    select: async function (el) {
      let title = null
      let spinnerDisplay = 'd-none'

      const handleChange = (event) => {
        title = event.target.value
        const addButton = document.getElementById('add')

        if (title && addButton.classList.contains('disabled')) {
          addButton.classList.remove('disabled')
        }
        else {
          addButton.classList.add('disabled')
        }
      }
      const handleSubmit = async (event) => {
        event.preventDefault()
        await fetcher(`/api/nodes?parentId=${el.id()}`, user.token, 'POST', JSON.stringify({ title }))
      }

      setPopper(
        el.id(),
        el.popper({
          content: () => {
            const popperCard = document.createElement('div')
            ReactDOM.render(
              <Card className="border-dark">
                <CardBody>
                  <CardTitle
                    tag="h5"
                    className="mw-100 mb-4"
                    style={{ minWidth: '50vw' }}
                  >
                    Add Child Node{' '}
                    <small className="text-muted">({el.data().title})</small>
                    <CloseButton
                      divKey={`popper-${el.id()}`}
                      popperKey={el.id()}
                      poppers={poppers}
                    />
                    <CardLink
                      href="#"
                      className={`btn btn-success float-right disabled`}
                      id="add"
                      onClick={async (event) => {
                        spinnerDisplay = 'd-block'
                        await handleSubmit(event)
                        const rootId = cy.nodes()[0].id()
                        const key = rootId.split('/')[1]
                        const { data } = await fetcher(`/api/mindmaps/${key}`, user.token)
                        spinnerDisplay = 'd-none'

                        removePopper(el.id(), `popper-${el.id()}`, poppers)
                        setEls(CytoscapeComponent.normalizeElements(data))
                      }}
                    >
                      <Plus/> Add
                    </CardLink>
                  </CardTitle>
                  <CardText tag="div" className="mw-100">
                    <Form onSubmit={handleSubmit} inline>
                      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="text" name="name" id="name" placeholder="Enter a node title"
                               value={title} onChange={handleChange}/>
                      </FormGroup>
                      <FormGroup className={spinnerDisplay}><Spinner/></FormGroup>
                    </Form>
                  </CardText>
                </CardBody>
              </Card>,
              popperCard
            )

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

const PopperCard = () => {

}