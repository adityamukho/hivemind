import { findIndex, get } from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapPin, Search, Tag } from 'react-feather'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import GlobalContext from '../GlobalContext'
import EventDetail from './EventDetail'

const bgColors = {
  created: 'limegreen',
  restored: 'yellow',
  updated: 'deepskyblue',
  deleted: 'red',
}

const Timeline = ({ data, timestamp, jump }) => {
  const timelineRef = useRef()
  const timeline = useRef()
  const {
    cyWrapper: { cy, viewApi },
  } = useContext(GlobalContext)
  const [modal, setModal] = useState(false)
  const [target, setTarget] = useState('timeline')
  const [node, setNode] = useState(<Spinner />)
  const [showJump, setShowJump] = useState('d-block')
  const [showFind, setShowFind] = useState('d-none')
  const [items, setItems] = useState([])

  const toggle = () => setModal(!modal)
  const jumpTo = async (lctime) => {
    if (lctime !== timestamp) {
      jump(lctime)
    }

    setModal(false)
  }
  const locate = (item) => {
    if (item && item.event !== 'deleted') {
      const node = cy.$id(item.nid)

      viewApi.zoomToSelected(node)
      viewApi.removeHighlights(cy.elements())
      viewApi.highlight(node)
    }

    setModal(false)
  }

  useEffect(() => {
    if (get(data, 'ok')) {
      setItems(
        data.data.map((event, idx) => ({
          id: idx,
          className: event.lctime === timestamp ? 'pinned' : '',
          title: event.event,
          content: '',
          start: event.lctime * 1000,
          style: `background-color: ${bgColors[event.event]};`,
          lctime: event.lctime,
          nid: event.nids[0] || event.mid,
          event: event.event,
        }))
      )
    }
  }, [data, timestamp])

  useEffect(() => {
    if (items.length) {
      if (timeline.current) {
        timeline.current.setItems(items)
      } else {
        const container = timelineRef.current
        if (container.firstChild) {
          container.removeChild(container.firstChild)
        }

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
            fitOnDoubleClick: true,
          },
          max: items[items.length - 1].start + margin,
          min: items[0].start - margin,
          selectable: false,
          dataAttributes: ['id'],
          zoomMin: 60000,
        }

        timeline.current = new VisTimeline(container, items, options)
      }

      timeline.current.on('click', (properties) => {
        const { what, isCluster, item } = properties

        if (what === 'item' && !isCluster) {
          setNode(<Spinner />)
          setTarget(item)
          setModal(true)

          if (items[item].className === 'pinned') {
            setShowJump('d-none')

            if (items[item].event !== 'deleted') {
              setShowFind('d-block')
            }
          } else {
            setShowJump('d-block')
            setShowFind('d-none')
          }
        } else {
          setModal(false)
          setTarget('timeline')
        }
      })
      timeline.current.on('doubleClick', (properties) => {
        const { what, item, isCluster } = properties

        switch (what) {
          case 'background':
            timeline.current.fit()

            break
          case 'item':
            if (!isCluster) {
              timeline.current.focus(item)
            }

            break
        }
      })

      if (timestamp) {
        const idx = findIndex(items, { lctime: timestamp })
        timeline.current.focus(idx)
      } else {
        timeline.current.fit()
      }
    }
  }, [items, timestamp])

  useEffect(
    () => () => {
      timeline.current.destroy()
      timeline.current = null
    },
    []
  )

  return (
    <div className={'border border-secondary rounded'}>
      <div id={'timeline'} ref={timelineRef} className={'m-1'} >
        <Spinner/>
      </div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fade={false}
        centered={true}
        size={'lg'}
        scrollable={true}
      >
        <ModalHeader toggle={toggle}>
          <b>{node}</b> | {get(items, [target, 'event'], 'NA')}{' '}
          {new Date(get(items, [target, 'start'], Date.now())).toLocaleString()}
        </ModalHeader>
        <ModalBody>
          {data && data.data[target] ? (
            <EventDetail event={data.data[target]} setNode={setNode} />
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            className={`ml-1 ${showJump}`}
            outline
            color="secondary"
            id="jump"
            onClick={() => jumpTo(items[target].lctime)}
          >
            <MapPin size={16} /> Jump
          </Button>
          &nbsp;
          <Button
            className={`ml-1 ${showFind}`}
            outline
            color="secondary"
            id="find"
            onClick={() => locate(items[target])}
          >
            <Search size={16} /> Find
          </Button>
          &nbsp;
          <Button
            className="ml-1"
            outline
            color="secondary"
            id="tag"
            disabled={true}
          >
            <Tag size={16} /> Tag
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Timeline
