import { pick } from 'lodash'
import React, { useContext, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter'
import { Search } from 'react-feather'
import { Button, Card, CardBody, CardText, Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { getPath } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'

export default function search () {
  const { cyWrapper } = useContext(GlobalContext)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [data, setData] = useState([])
  const [offset, setOffset] = useState()
  const { cy } = cyWrapper

  const toggle = () => {
    const { cy } = cyWrapper
    const search = document.getElementById('search')
    const cyContainer = document.getElementById('cy')
    const boundingRect = search.getBoundingClientRect()
    const mid = boundingRect.x + boundingRect.width / 2
    const offset = cyContainer.getBoundingClientRect().x - mid

    setData(cy.nodes(':visible')
      .map(node => {
        const data = node.data()
        const path = getPath(node)
        const item = pick(data, 'id', 'title')
        item.path = path.join(' ⟶ ')
        item.depth = path.length - 1

        return item
      }))
    setOffset(offset)
    setPopoverOpen(!popoverOpen)
  }

  const columns = [
    {
      dataField: 'title',
      text: 'Title',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'path',
      text: 'Path',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'depth',
      text: 'Depth',
      sort: true,
      filter: numberFilter()
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
      const zoomFactor = Math.min(viewportCenterX / node.width(),
        viewportCenterY / node.height()) / 2

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

      toggle()
    }
  }

  return <>
    <Button className="ml-1" outline color="secondary" id="search">
      <Search size={16}/>
    </Button>
    <Popover target="search" isOpen={popoverOpen} toggle={toggle}
             boundariesElement={'search'} placement={'top-start'} offset={offset}>
      <PopoverHeader>Search <small className="text-muted">(Jump to Node)</small></PopoverHeader>
      <PopoverBody>
        <Card
          className="border-dark"
          style={{ minWidth: '50vw', maxWidth: '90vw' }}
        >
          <CardBody>
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
                defaultSorted={[
                  { dataField: 'depth', order: 'asc' }
                ]}
                defaultSortDirection={'asc'}
              />
            </CardText>
          </CardBody>
        </Card>
      </PopoverBody>
    </Popover>
  </>
}