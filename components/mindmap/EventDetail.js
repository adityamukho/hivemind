import difflib from 'jsdifflib'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Spinner } from 'reactstrap'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper from '../../utils/fetchWrapper'

function getDiffURL (event) {
  return `/api/timeline/diff?eid=${event._id}`
}

const EventDetail = ({ event }) => {
  const { user } = useUser()
  const { data, error } = fetchWrapper(user, getDiffURL(event))
  const diffRef = useRef(null)

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch event details!',
      type: 'danger',
      autoDismiss: 7
    }

    window.notify(options)
  }

  useEffect(() => {
    const container = diffRef.current

    if (data && !error) {
      if (data.ok) {
        const diff = data.data
        let contents

        switch (event.event) {
          case 'updated':
            contents = difflib.buildView({
              baseText: JSON.stringify(diff.v1, null, 2),
              newText: JSON.stringify(diff.v2, null, 2),
              baseTextName: 'Previous Version',
              newTextName: 'This Version',
              inline: false
            })

            break

          case 'created':
          case 'restored':
            contents = document.createTextNode(JSON.stringify(diff.v2, null, 2))

            break

          case 'deleted':
            contents = document.createTextNode(JSON.stringify(diff.v1, null, 2))

            break

          default:
            contents = document.createTextNode('WTF!')
        }

        if (container.firstChild) {
          container.replaceChild(contents, container.firstChild)
        }
        else {
          container.appendChild(contents)
        }
      }
    }
    else {
      ReactDOM.render(<Spinner/>, container)
    }
  }, [data, error])

  return <div id={'diff'} ref={diffRef}/>
}

export default EventDetail