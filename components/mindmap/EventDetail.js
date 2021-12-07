import difflib from 'jsdifflib'
import { isEmpty, omitBy, pick } from 'lodash'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Spinner } from 'reactstrap'
import { useUser } from '../../utils/auth/useUser'
import useFetch from '../../utils/useFetch'

function getDiffURL(event) {
  return `/api/timeline/diff?eid=${event._id}`
}

const EventDetail = ({ event, setNode }) => {
  const { user } = useUser()
  const { data, error } = useFetch(user, getDiffURL(event))
  const diffRef = useRef(null)

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch event details!',
      type: 'danger',
      autoDismiss: 7,
    }

    window.notify(options)
  }

  useEffect(() => {
    const container = diffRef.current

    if (!error && data && data.ok) {
      const diff = data.data
      let contents, node, baseText, newText

      switch (event.event) {
        case 'updated':
          baseText = JSON.stringify(
            omitBy(
              pick(diff.v1, 'name', 'title', 'summary', 'content', 'audio'),
              isEmpty
            ),
            null,
            2
          )
          newText = JSON.stringify(
            omitBy(
              pick(diff.v2, 'name', 'title', 'summary', 'content', 'audio'),
              isEmpty
            ),
            null,
            2
          )
          contents = difflib.buildView({
            baseText,
            newText,
            baseTextName: 'Previous Version',
            newTextName: 'This Version',
            inline: false,
          })

          if (diff.v1.title !== diff.v2.title) {
            node = `${diff.v1.title} : ${diff.v2.title}`
          } else {
            node = diff.v1.title
          }

          break

        case 'created':
        case 'restored':
          node = diff.v2.title
          contents = document.createElement('span')
          contents.innerHTML = `<b>Title:</b> ${diff.v2.title}`

          break

        case 'deleted':
          node = `[${diff.v1.length} item(s)]`
          contents = document.createElement('div')
          diff.v1.forEach((d) => {
            const rows = document.createElement('div')
            rows.classNames = ['row']

            const title = document.createElement('div')
            title.classNames = ['row']
            title.innerHTML = `<b>Title:</b> ${d.title}`
            rows.appendChild(title)

            if (d.summary) {
              const summary = document.createElement('div')
              summary.classNames = ['row']
              summary.innerHTML = `<b>Summary:</b> ${d.summary}`
              rows.appendChild(summary)
            }

            if (d.content) {
              const content = document.createElement('div')
              content.classNames = ['row']
              content.innerHTML = `<b>Content:</b> ${d.content}`
              rows.appendChild(content)
            }
            
            if (d.audio) {
              const audio = document.createElement('div')
              audio.classNames = ['row']
              audio.innerHTML = `<b>Audio:</b> ${d.audio}`
              rows.appendChild(audio)
            }

            contents.appendChild(rows)
            contents.appendChild(document.createElement('hr'))
          })

          break

        default:
          contents = document.createTextNode('WTF!')
          node = 'WTF!'
      }
      setNode(node)

      if (container.firstChild) {
        container.replaceChild(contents, container.firstChild)
      } else {
        container.appendChild(contents)
      }
    } else {
      ReactDOM.render(<Spinner />, container)
    }
  }, [data, error, event, setNode])

  return <div id={'diff'} ref={diffRef} />
}

export default EventDetail
