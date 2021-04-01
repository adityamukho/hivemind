import Link from 'next/link'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
// import { Trash2 } from 'react-feather'

// function getOps(entry) {
//   const output = []
//
//   if (['admin', 'write'].includes(entry.access.access)) {
//     output.push(
//       <span className={'mx-1 text-danger'} key={entry.mindmap._key}>
//         <Trash2 />
//       </span>
//     )
//   }
//
//   return output
// }

const MindMaps = ({ data }) => {
  if (data.length) {
    const columns = [
      {
        dataField: 'title',
        text: 'Title',
        sort: true,
        filter: textFilter(),
        formatter: (cell, row) => (
          <Link href="/mmaps/[id]" as={`/mmaps/${row.id}`}>
            <a>{cell}</a>
          </Link>
        ),
      },
      {
        dataField: 'access',
        text: 'Access',
        sort: true,
        filter: textFilter(),
      },
      // {
      //   dataField: 'ops',
      //   sort: false,
      //   text: ''
      // },
    ]

    const rows = data.map((entry) => {
      return {
        id: entry.mindmap._key,
        access: entry.access.access,
        title: entry.mindmap.name,
        // ops: getOps(entry),
      }
    })

    return (
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={rows}
        columns={columns}
        hover
        condensed
        filter={filterFactory()}
        defaultSorted={[{ dataField: 'title', order: 'asc' }]}
        defaultSortDirection={'asc'}
      />
    )
  }

  return <p>No mind maps found. Try creating one.</p>
}

export default MindMaps
