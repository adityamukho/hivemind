import { findIndex, get, find } from 'lodash'
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
  const [items, setItems] = useState([])
  const [timeline, setTimeline] = useState(null)

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
      const tempItems = data.data.map((event, idx) => ({
        id: idx,
        className: event.lctime === timestamp ? 'pinned' : '',
        title: event.event,
        content: '',
        start: event.lctime * 1000,
        style: `background-color: ${bgColors[event.event]};`,
        lctime: event.lctime,
        nid: event.nids[0] || event.mid,
        event: event.event
      }))

      setItems(tempItems)
    }
  }, [data])

  useEffect(() => {
    if (items.length) {
      const container = timelineRef.current
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
      const tempTimeline = new VisTimeline(container, items, options)

      tempTimeline.on('click', properties => {
        const { what, isCluster, item } = properties

        if (what === 'item' && !isCluster) {
          setNode(<Spinner/>)
          setTarget(item)
          setModal(true)

          if (items[item].className === 'pinned') {
            setShowJump('d-none')

            if (items[item].event !== 'deleted') {
              setShowFind('d-block')
            }
          }
          else {
            setShowJump('d-block')
            setShowFind('d-none')
          }
        }
        else {
          setModal(false)
          setTarget('timeline')
        }
      })
      tempTimeline.on('doubleClick', (properties) => {
        const { what, item, isCluster } = properties

        switch (what) {
          case 'background':
            this.fit()

            break
          case 'item':
            if (!isCluster) {
              this.focus(item)
            }

            break
        }
      })
      tempTimeline.fit()

      setTimeline(tempTimeline)

      return () => {
        tempTimeline.destroy()
      }
    }
  }, [items])

  useEffect(() => {
    if (timeline) {
      if (timestamp) {
        const idx = findIndex(items, { lctime: timestamp })
        const prevPinnedItem = find(items, { className: 'pinned' })

        if (prevPinnedItem) {
          prevPinnedItem.className = ''
        }
        items[idx].className = 'pinned'

        setTimeout(() => {
          timeline.setItems(items)
          timeline.focus(idx)
        }, 0)
      }
      else {
        timeline.fit()
      }
    }
  }, [timeline, timestamp])

  useEffect(() => () => {
    if (timeline) {
      timeline.destroy()
    }
  }, [])

  return <div className={'border border-secondary rounded'}>
    <div id={'timeline'} ref={timelineRef} className={'m-1'}/>
    <Modal isOpen={modal} toggle={toggle} fade={false} centered={true} size={'lg'}
           scrollable={true}>
      <ModalHeader toggle={toggle}>
        <b>{node}</b> | {get(items, [target, 'event'], 'NA')} {new Date(
        get(items, [target, 'start'], Date.now())).toLocaleString()}
      </ModalHeader>
      <ModalBody>
        {data && data.data[target] ? <EventDetail event={data.data[target]}
                                                  setNode={setNode}/> : null}
      </ModalBody>
      <ModalFooter>
        <Button className={`ml-1 ${showJump}`} outline color="secondary" id="jump"
                onClick={() => jumpTo(items[target].lctime)}>
          <MapPin size={16}/> Jump
        </Button>&nbsp;
        <Button className={`ml-1 ${showFind}`} outline color="secondary" id="find"
                onClick={() => locate(items[target])}>
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