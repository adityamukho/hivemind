import React from 'react'
import ReactDOM from 'react-dom'
import { Eye } from 'react-feather'
import { Card, CardBody, CardText, CardTitle } from 'reactstrap'
import { setPopper } from '../../../utils/cyHelpers'
import CloseButton from '../CloseButton'

const view = (menu, poppers) => {
  const view = document.createElement('span')
  ReactDOM.render(<Eye/>, view)
  menu.push({
    fillColor: 'rgba(0, 0, 200, 0.75)',
    content: view.outerHTML,
    select: function (el) {
      setPopper(
        el.id(),
        el.popper({
          content: () => {
            const data = el.data()

            const popperCard = document.createElement('div')
            ReactDOM.render(
              <Card className="border-dark">
                <CardBody>
                  <CardTitle
                    tag="h5"
                    className="mw-100 mb-4"
                    style={{ minWidth: '50vw' }}
                  >
                    {data.name}&nbsp;
                    <span>
                      <small className="text-muted">({data.id})</small>
                    </span>
                    <CloseButton
                      divKey={`popper-${el.id()}`}
                      popperKey={el.id()}
                      poppers={poppers}
                    />
                  </CardTitle>
                  <CardText tag="div">
                    {JSON.stringify(data)}
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

export default view
