import { useRouter } from 'next/router'
import Error from 'next/error'
import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Spinner } from 'reactstrap'
import AuthPrompt from '../../components/auth/AuthPrompt'
import MindMap from '../../components/mindmap/MindMap'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper from '../../utils/fetchWrapper'
import { Fit, ShowAll, Search Rename} from '../../components/mindmap/action-items'
import { SkipBack, Rewind, FastForward, SkipForward, Tag, Lock, Unlock } from 'react-feather'
import { findIndex, last } from 'lodash'
import { mutate } from 'swr'

const Page = () => {
  const { user } = useUser()
  const { key } = useRouter().query
  const [timestamp, setTimestamp] = useState(typeof window === 'undefined' ? null : parseFloat(
    (new URLSearchParams(location.search)).get('timestamp')))
  const { data, error } = fetchWrapper(user ? user : null,
    `/api/mindmaps/${key}?timestamp=${timestamp || ''}`)
  const { data: edata, error: eerror } = fetchWrapper(user ? user : null, `/api/timeline/events?key=${key}`)
  const [title, setTitle] = useState(key)

  useEffect(() => {
    if (user) {
      mutate([`/api/mindmaps/${key}?timestamp=${timestamp || ''}`, user.token], null, true)
    }
  }, [user, timestamp])

  useEffect(() => {
    if (user) {
      mutate([`/api/timeline/events?key=${key}`, user.token], null, true)
    }
  }, [user])

  useEffect(() => {
    if (data && data.ok) {
      setTitle(data.data.meta.name)
    }
  }, [data])

  if ((typeof user === 'undefined')) {
    return <Spinner/>
  }

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch mind map!',
      type: 'danger',
      autoDismiss: 7
    }

    window.notify(options)
  }

  if (eerror && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch events!',
      type: 'danger',
      autoDismiss: 7
    }

    window.notify(options)
  }

  const gotEventData = !eerror && edata && edata.ok
  const cEvents = gotEventData && edata.data
  const prevDisabled = !gotEventData || timestamp === cEvents[0].lctime
  const nextDisabled = !gotEventData || timestamp === last(cEvents).lctime

  async function jump (to) {
    if (to === 'now') {
      history.replaceState({}, document.title, `/mmaps/${key}`)
      setTimestamp(null)
    }
    else if (gotEventData) {
      let toTS, idx

      switch (to) {
        case 'first':
          toTS = cEvents[0].lctime
          break

        case 'prev':
          idx = timestamp ? findIndex(cEvents, { lctime: timestamp }) : cEvents.length
          toTS = cEvents[idx - 1].lctime
          break

        case 'next':
          idx = timestamp ? findIndex(cEvents, { lctime: timestamp }) : cEvents.length - 2
          toTS = cEvents[idx + 1].lctime
          break

        case 'last':
          toTS = last(cEvents).lctime
          break

        default:
          toTS = to
      }

      history.replaceState({}, document.title, `/mmaps/${key}?timestamp=${toTS}`)
      setTimestamp(toTS)
    }
  }

  if (user) {
    const output = [
      <Row key='title'>
        <Col xs="auto" md={8}>
          <h3>
            {title}
            {
              timestamp ? <>&nbsp;<small className={'text-muted'}> @ {(new Date(
                timestamp * 1000)).toLocaleString()}</small></> : null
            }
          </h3>
        </Col>
        <Col xs="auto" md={4} className={'text-right'}>
          <Rename name={title} mindmapkey={key} nameChangedCallBack={setTitle}/></Col>
          <ShowAll/>
          <Fit/>
          <Search/>
          &nbsp;&nbsp;|&nbsp;
          <Button className="ml-1" outline color="secondary" id="tag" disabled={true}>
            <Tag size={16}/>
          </Button>
          <Button className="ml-1" outline color="secondary" id="first" disabled={prevDisabled}
                  onClick={() => jump('first')}>
            <SkipBack size={16}/>
          </Button>
          <Button className="ml-1" outline color="secondary" id="prev" disabled={prevDisabled}
                  onClick={() => jump('prev')}>
            <Rewind size={16}/>
          </Button>
          <Button className="ml-1" outline color="secondary" id="next" disabled={nextDisabled}
                  onClick={() => jump('next')}>
            <FastForward size={16}/>
          </Button>
          <Button className="ml-1" outline color="secondary" id="last" disabled={nextDisabled}
                  onClick={() => jump('last')}>
            <SkipForward size={16}/>
          </Button>
          &nbsp;&nbsp;|&nbsp;
          <Button className="ml-1" outline color={timestamp ? 'secondary' : 'danger'} id="now"
                  onClick={() => jump(timestamp ? 'now' : 'last')}>
            {timestamp ? <Lock size={16}/> : <Unlock size={16}/>}
          </Button>
        </Col>
      </Row>
    ]

    if (error && data) {
      output.push(
        <Row key='content'>
          <Col>
            <Error statusCode={data.status}/>
          </Col>
        </Row>
      )
    }
    else if (eerror && edata) {
      output.push(
        <Row key='content'>
          <Col>
            <Error statusCode={edata.status}/>
          </Col>
        </Row>
      )
    }
    else {
      output.push(
        <Row key='content'>
          <Col>
            <MindMap data={data} edata={edata} timestamp={timestamp} jump={jump}/>
          </Col>
        </Row>
      )
    }

    return output
  }

  return <AuthPrompt/>
}

export default Page