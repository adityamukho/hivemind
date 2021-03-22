import { findIndex, get } from 'lodash'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { MapPin, Tag, Search } from 'react-feather'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import EventDetail from './EventDetail'
import GlobalContext from '../GlobalContext'

const bgColors = {
  created: 'limegreen',
  restored: 'yellow',
  updated: 'deepskyblue',
  deleted: 'red'
}

const Timeline = ({ data, timestamp, jump }) => {
  const timelineRef = useRef(null)
  const { cyWrapper: { cy, viewApi } } = useContext(GlobalContext)
  const [modal, setModal] = useState(false)
  const [target, setTarget] = useState('timeline')
  const [node, setNode] = useState(<Spinner/>)
  const [showJump, setShowJump] = useState('d-block')
  const [showFind, setShowFind] = useState('d-none')

  const toggle = () => setModal(!modal)
  const jumpTo = async (cEvent) => {
    if (cEvent) {
      const { lctime } = cEvent

      if (lctime !== timestamp) {
        jump(lctime)
      }
    }

    setModal(false)
  }
  const find = (cEvent) => {
    if (cEvent && cEvent.event !== 'deleted') {
      const node = cy.$id(cEvent.nids[0])

      viewApi.zoomToSelected(node)
      viewApi.removeHighlights(cy.elements())
      viewApi.highlight(node)
    }

    setModal(false)
  }

  const items = data.map((event, idx) => ({
    id: idx,
    className: event.lctime === timestamp ? 'pinned' : event.event,
    title: event.event,
    content: '',
    start: event.lctime * 1000,
    style: `background-color: ${bgColors[event.event]};`
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
    dataAttributes: ['id'],
    zoomMin: 60000
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

        if (data[item].lctime === timestamp) {
          setShowJump('d-none')

          if (data[item].event !== 'deleted') {
            setShowFind('d-block')
          }
        }
        else {
          setShowJump('d-block')
          setShowFind('d-none')
        }
        console.log(data[item])
      }
      else {
        setModal(false)
        setTarget('timeline')
      }
    }))

    return () => timeline.destroy()
  }, [data, timestamp, jump])

  return <div className={'border border-secondary rounded'}>
    <div id={'timeline'} ref={timelineRef} className={'m-1'}/>
    <Modal isOpen={modal} toggle={toggle} fade={false} centered={true} size={'lg'}
           scrollable={true}>
      <ModalHeader toggle={toggle}>
        <b>{node}</b> | {get(data, [target, 'event'], 'NA')} {new Date(
        get(data, [target, 'lctime'], Date.now() / 1000) * 1000).toLocaleString()}
      </ModalHeader>
      <ModalBody>
        {data[target] ? <EventDetail event={data[target]} setNode={setNode}/> : null}
      </ModalBody>
      <ModalFooter>
        <Button className={`ml-1 ${showJump}`} outline color="secondary" id="jump"
                onClick={() => jumpTo(data[target])}>
          <MapPin size={16}/> Jump
        </Button>&nbsp;
        <Button className={`ml-1 ${showFind}`} outline color="secondary" id="find"
                onClick={() => find(data[target])}>
          <Search size={16}/> Find
        </Button>&nbsp;
        <Button className="ml-1" outline color="secondary" id="tag" disabled={true}>
          <Tag size={16}/> Tag
        </Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default Timeline