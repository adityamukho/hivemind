import { pick } from 'lodash'
import PopperCore from 'popper.js'
import React, { useContext } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import ReactDOM from 'react-dom'
import { Search } from 'react-feather'
import { Button, Card, CardBody, CardText, CardTitle } from 'reactstrap'
import { removePopper, setPopper } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'
import CloseButton from '../CloseButton'

function handler (cy, poppers) {
  const data = cy.nodes().map(node => pick(node.data(), 'id', 'title', 'summary'))
  const columns = [
    {
      dataField: 'title',
      text: 'Title',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'summary',
      text: 'Summary',
      sort: true,
      filter: textFilter()
    }
  ]

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    bgColor: '#00BFFF',
    onSelect: row => {
      const node = cy.$id(row.id)
      const renderedPosition = node.renderedPosition()
      const viewportCenterX = cy.width() / 2
      const viewportCenterY = cy.height() / 2
      const relativeRenderedPosition = {
        x: viewportCenterX - renderedPosition.x,
        y: viewportCenterY - renderedPosition.y
      }
      const zoomFactor = Math.min(viewportCenterX / node.width(), viewportCenterY / node.height()) / 2

      if (cy.nodes().length <= 50) {
        cy.animate({
          panBy: relativeRenderedPosition,
          duration: 500
        }).delay(100, () => {
          cy.animate({
            zoom: {
              level: zoomFactor,
              renderedPosition: {
                x: viewportCenterX,
                y: viewportCenterY
              }
            },
            duration: 500
          })
        })
      }
      else {
        cy.panBy(relativeRenderedPosition)
        cy.zoom({
          level: zoomFactor,
          renderedPosition: {
            x: viewportCenterX,
            y: viewportCenterY
          }
        })
      }

      removePopper('search', 'popper-search', poppers)
    }
  }

  const search = document.createElement('div')
  ReactDOM.render(
    <Card
      className="border-dark"
      style={{ minWidth: '50vw', maxWidth: '98vw' }}
    >
      <CardBody>
        <CardTitle tag="h5" className="mb-4">
          Search <small className="text-muted">(Jump to Node)</small>
          <CloseButton divKey="popper-search" popperKey="search" poppers={poppers}/>
        </CardTitle>
        <CardText tag="div" className="mw-100">
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={data}
            columns={columns}
            hover
            condensed
            selectRow={selectRow}
            filter={filterFactory()}
            wrapperClasses="search"
          />
        </CardText>
      </CardBody>
    </Card>,
    search
  )

  document.getElementsByTagName('body')[0].appendChild(search)
  search.setAttribute('id', 'popper-search')
  setPopper(
    'search',
    new PopperCore(document.getElementById('search'), search, {
      modifiers: {
        flip: {
          enabled: false
        }
      },
      onCreate (data) {
        data.instance.reference.setAttribute('disabled', true)
      }
    }), poppers
  )
}

export default function search () {
  const { cyWrapper, poppers } = useContext(GlobalContext)

  return <Button className="ml-1" outline color="info" id="search"
                 onClick={() => handler(cyWrapper.cy, poppers)}>
    <Search size={16}/> Search
  </Button>
}