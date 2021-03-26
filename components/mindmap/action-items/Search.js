import { pick } from 'lodash'
import React, { useContext, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { numberFilter, textFilter } from 'react-bootstrap-table2-filter'
import { Search } from 'react-feather'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { getPath } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'
import ToolTippedButton from './ToolTippedButton'

export default function search () {
  const { cyWrapper } = useContext(GlobalContext)
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const { cy, viewApi } = cyWrapper

  const toggle = () => {
    const { cy } = cyWrapper

    setData(cy.nodes(':visible')
      .map(node => {
        const data = node.data()
        const path = getPath(node)
        const item = pick(data, 'id', 'title')
        item.path = path.join(' ⟶ ')
        item.depth = path.length - 1

        return item
      }))

    setModal(!modal)
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

      viewApi.zoomToSelected(node)
      viewApi.removeHighlights(cy.elements())
      viewApi.highlight(node)

      toggle()
    }
  }

  return <>
    <ToolTippedButton tooltip="Search" className="ml-1" outline color="secondary" id="search"
                      onClick={toggle}>
      <Search size={16}/>
    </ToolTippedButton>
    <Modal isOpen={modal} toggle={toggle} style={{ minWidth: '50vw', maxWidth: '90vw' }}
           fade={false}>
      <ModalHeader toggle={toggle}>
        Search <small className="text-muted">(Jump to Node)</small>
      </ModalHeader>
      <ModalBody>
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
      </ModalBody>
    </Modal>

  </>
}