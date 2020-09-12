import Link from 'next/link'
import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'

const MindMaps = ({ data }) => {
  if (data.length) {
    return <ListGroup>
      {data.map(entry =>
        <ListGroupItem key={entry.mindmap._key}>
          <Link href='/mmaps/[id]' as={`/mmaps/${entry.mindmap._key}`}><a>{entry.mindmap.name}</a></Link>
          &nbsp;
          <span className="text-muted float-right">
              <small>Access: {entry.access.access}</small>
          </span>
        </ListGroupItem>
      )}
    </ListGroup>
  }

  return <p>No mind maps found. Try creating one.</p>
}

export default MindMaps