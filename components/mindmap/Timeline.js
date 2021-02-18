import React, { useEffect, useRef, useState } from 'react'
import {
  Popover, PopoverHeader, Spinner, Card, CardBody, CardText, PopoverBody
} from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper, { fetcher } from '../../utils/fetchWrapper'
import { get } from 'lodash'

export default function timeline ({ mkey }) {
  const { user } = useUser()
  const { data, error } = fetchWrapper(user, `/api/timeline/events?key=${mkey}`)

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch timeline!',
      type: 'danger',
      autoDismiss: 7
    }

    window.notify(options)
  }

  if (data && !error) {
    return data.ok ? <Timeline data={data.data}/> : null
  }
  else {
    return <Spinner/>
  }
}

const Timeline = ({ data }) => {
  const timelineRef = useRef(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [target, setTarget] = useState('timeline')
  const [offset, setoffset] = useState(0)

  const toggle = () => {
    if (target === 'timeline') {
      setPopoverOpen(false)
    }
    else {
      setPopoverOpen(!popoverOpen)

      // Popover state will toggle on next tick. So if we want a code block to run for the to-be
      // open state, we must check for popoverOpen === false!
      if (!popoverOpen) {
        const timeline = timelineRef.current
        const targetRef = document.querySelector(`[data-id="${target}"]`)
        const boundingRect = targetRef.getBoundingClientRect()
        const mid = boundingRect.x + boundingRect.width / 2
        const offset = timeline.getBoundingClientRect().x - mid

        setoffset(offset)
      }
    }
  }

  const items = data.map((event, idx) => ({
    id: idx,
    className: event.event,
    title: event.event,
    content: '',
    start: event.ctime * 1000
  }))
  const margin = (items[items.length - 1].start - items[0].start) * 0.05
  const options = {
    width: '100%',
    height: '120px',
    type: 'box',
    stack: false,
    horizontalScroll: false,
    verticalScroll: false,
    cluster: {
      titleTemplate: '{count}',
      maxItems: 1,
      showStipes: true,
      fitOnDoubleClick: true
    },
    max: items[items.length - 1].start + margin,
    min: items[0].start - margin,
    selectable: false,
    dataAttributes: ['id']
  }

  useEffect(() => {
    const container = timelineRef.current
    const timeline = new VisTimeline(
      container,
      items,
      options
    )

    timeline.on('doubleClick', (properties) => {
      const { what, item, isCluster } = properties

      switch (what) {
        case 'background':
          timeline.fit()

          break
        case 'item':
          if (!isCluster) {
            timeline.focus(item)
          }

          break
      }
    })

    timeline.on('click', (properties => {
      const { what, isCluster, item } = properties

      if (what === 'item' && !isCluster) {
        setTarget(item)
        console.log(data[item])
      }
      else {
        setTarget('timeline')
      }
    }))

    return () => timeline.destroy()
  }, [data.length])

  return <div className={'border border-secondary rounded'}>
    <div id={'timeline'} ref={timelineRef} className={'m-1'}/>
    <Popover target="timeline" isOpen={popoverOpen} toggle={toggle} offset={offset}
             boundariesElement={'timeline'} placement={'top-start'}>
      <PopoverHeader>Event: {get(data, [target, 'event'], 'NA')}</PopoverHeader>
      <PopoverBody>
        <Card
          className="border-dark"
          style={{ minWidth: '50vw', maxWidth: '90vw' }}
        >
          <CardBody>
            <CardText tag="div" className="mw-100">
              <EventDetail event={data[target]}/>
            </CardText>
          </CardBody>
        </Card>
      </PopoverBody>
    </Popover>
  </div>
}

const EventDetail = ({ event }) => {
  const { user } = useUser()

  if (!event) {
    return null
  }
  else {
    return JSON.stringify(event, null, 2)
  }
}
