import { findIndex, get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Rewind, Tag } from 'react-feather'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import EventDetail from './EventDetail'

const Timeline = ({ data, timestamp, jump }) => {
  const timelineRef = useRef(null)
  const [modal, setModal] = useState(false)
  const [target, setTarget] = useState('timeline')
  const [node, setNode] = useState(<Spinner/>)

  const toggle = () => setModal(!modal)
  const rewind = async (cEvent) => {
    if (cEvent) {
      const { lctime } = cEvent

      if (lctime !== timestamp) {
        jump(lctime)
      }
    }
  }

  const items = data.map((event, idx) => ({
    id: idx,
    className: event.lctime === timestamp ? 'pinned' : event.event,
    title: event.event,
    content: '',
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

    if (timestamp) {
      const idx = findIndex(data, { lctime: timestamp })
      setTimeout(() => timeline.focus(items[idx].id), 0)
    }

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
        setNode(<Spinner/>)
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
    <Modal isOpen={modal} toggle={toggle} fade={false} centered={true} size={'lg'}
           scrollable={true}>
      <ModalHeader toggle={toggle}>
        <b>{node}</b> | {get(data, [target, 'event'], 'NA')} {new Date(
        get(data, [target, 'ctime'], Date.now() * 1000) / 1000).toLocaleString()}
      </ModalHeader>
      <ModalBody>
        {data[target] ? <EventDetail event={data[target]} setNode={setNode}/> : null}
      </ModalBody>
      <ModalFooter>
        <Button className="ml-1" outline color="secondary" id="view"
                onClick={() => rewind(data[target])}>
          <Rewind size={16}/> Rewind
        </Button>&nbsp;
        <Button className="ml-1" outline color="secondary" id="tag">
          <Tag size={16}/> Tag
        </Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default Timeline