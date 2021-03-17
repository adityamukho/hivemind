import { get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Eye, Tag } from 'react-feather'
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
} from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper from '../../utils/fetchWrapper'
import EventDetail from './EventDetail'

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
    return data.ok ? <TimelineModal data={data.data}/> : null
  }
  else {
    return <Spinner/>
  }
}

const TimelineModal = ({ data }) => {
  const timelineRef = useRef(null)
  const [modal, setModal] = useState(false)
  const [target, setTarget] = useState('timeline')

  const toggle = () => setModal(!modal)

  const items = data.map((event, idx) => ({
    id: idx,
    className: event.event,
    title: event.event,
    content: '',
    // start: event.ctime * 1000
    start: event.lctime * 1000
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
        setModal(true)
        console.log(data[item])
      }
      else {
        setModal(false)
        setTarget('timeline')
      }
    }))

    return () => timeline.destroy()
  }, [data.length])

  return <div className={'border border-secondary rounded'}>
    <div id={'timeline'} ref={timelineRef} className={'m-1'}/>
    <Modal isOpen={modal} toggle={toggle} style={{ minWidth: '70vw' }} fade={false}>
      <ModalHeader toggle={toggle}>
        Event: {get(data, [target, 'event'], 'NA')}
      </ModalHeader>
      <ModalBody>
        {data[target] ? <EventDetail event={data[target]}/> : null}
      </ModalBody>
      <ModalFooter>
        <Button className="ml-1" outline color="secondary" id="view">
          <Eye size={16}/> View
        </Button>&nbsp;
        <Button className="ml-1" outline color="secondary" id="tag">
          <Tag size={16}/> Tag
        </Button>
      </ModalFooter>
    </Modal>
  </div>
}