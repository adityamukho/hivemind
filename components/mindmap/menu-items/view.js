import React from 'react'
import ReactDOM from 'react-dom'
import { Eye } from 'react-feather'
import { Card, CardBody, CardText, CardTitle } from 'reactstrap'
import { setPopper } from '../../../utils/cyHelpers'
import CloseButton from '../CloseButton'

export default function view (menu, poppers, cy) {
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
            const popperCard = document.createElement('div')

            document.getElementsByTagName('body')[0].appendChild(popperCard)
            popperCard.setAttribute('id', `popper-${el.id()}`)
            ReactDOM.render(<PopperCard poppers={poppers} el={el} cy={cy}/>, popperCard)

            return popperCard
          }
        }),
        poppers
      )
    },
    enabled: true
  })
}

const PopperCard = ({ el, poppers, cy }) => {
  const data = el.data()
  let path

  if (!data.isRoot) {
    const els = cy.elements()
    const root = els[0]

    path = els.aStar({
      root: root,
      goal: el,
      directed: true
    }).path.nodes().map(node => node.data().title).join(' ⟶ ')
  }

  return <Card className="border-dark">
    <CardBody>
      <CardTitle tag="h5" className="mw-100 mb-4" style={{ minWidth: '50vw' }}>
        {data.title}&nbsp;
        <span>
          <small className="text-muted">({data.isRoot ? 'ROOT NODE' : path})</small>
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
  </Card>
}