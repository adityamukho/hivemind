import React from 'react'
import ReactDOM from 'react-dom'
import { Eye } from 'react-feather'
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from 'reactstrap'
import { getPath, setPopper } from '../../../utils/cyHelpers'
import CloseButton from '../CloseButton'

export default function view(menu, poppers) {
  const view = document.createElement('span')
  ReactDOM.render(
    <>
      <Eye /> View
    </>,
    view
  )
  menu.push({
    fillColor: 'rgba(0, 0, 200, 0.75)',
    content: view.outerHTML,
    select: function (el) {
      setPopper(
        el.id(),
        el.popper({
          content: () => {
            const popperCard = document.createElement('div')

            document.body.appendChild(popperCard)
            popperCard.setAttribute('id', `popper-${el.id()}`)
            ReactDOM.render(
              <PopperCard poppers={poppers} el={el} />,
              popperCard
            )

            return popperCard
          },
        }),
        poppers
      )
    },
    enabled: true,
  })
}

const PopperCard = ({ el, poppers }) => {
  const data = el.data()
  let path

  if (!data.isRoot) {
    path = getPath(el).join(' ⟶ ')
  }

  return (
    <Card className="border-dark">
      <CardBody>
        <CardTitle
          tag="h5"
          className="mw-100 mb-4"
          style={{ minWidth: '50vw' }}
        >
          {data.title}&nbsp;
          <span>
            <small className="text-muted">
              ({data.isRoot ? 'ROOT NODE' : path})
            </small>
          </span>
          <CloseButton
            divKey={`popper-${el.id()}`}
            popperKey={el.id()}
            poppers={poppers}
          />
        </CardTitle>
        <CardSubtitle>
          <Row>
            <Col className="mb4">Created By: {data.createdBy}</Col>
            {data.lastUpdatedBy ? (
              <Col className="mb4">Last Updated By: {data.lastUpdatedBy}</Col>
            ) : null}
          </Row>
          <hr />
        </CardSubtitle>
        <CardText tag="div">
          {data.summary ? (
            <>
              <Row>
                <h5>Summary</h5>
              </Row>
              <Row>{data.summary}</Row>
            </>
          ) : null}
          {data.content ? (
            <>
              <hr />
              <Row>{data.content}</Row>
            </>
          ) : null}
          {data.audio ? (
            <>
              <Row>
                <h5>Audio</h5>
              </Row>
              <Row>
                <audio controls>
                <source src={data.audio}/>
                </audio>
              </Row>
            </>
          ) : null}
        </CardText>
      </CardBody>
    </Card>
  )
}
