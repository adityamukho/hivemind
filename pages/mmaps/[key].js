import { findIndex, get, last } from 'lodash'
import Error from 'next/error'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  FastForward,
  Lock,
  Rewind,
  SkipBack,
  SkipForward,
  Tag,
  Unlock,
} from 'react-feather'
import { Col, Row, Spinner } from 'reactstrap'
import { mutate } from 'swr'
import AuthPrompt from '../../components/auth/AuthPrompt'
import {
  Fit,
  Rename,
  Search,
  ShowAll,
} from '../../components/mindmap/action-items'
import MindMap from '../../components/mindmap/MindMap'
import ToolTippedButton from '../../components/mindmap/ToolTippedButton'
import { useUser } from '../../utils/auth/useUser'
import useFetch from '../../utils/useFetch'

const Page = () => {
  const { user } = useUser()
  const router = useRouter()
  const [timestamp, setTimestamp] = useState(
    typeof window === 'undefined'
      ? null
      : parseFloat(new URLSearchParams(location.search).get('timestamp'))
  )
  const { key } = router.query
  const { data, error } = useFetch(
    user ? user : null,
    `/api/mindmaps/${key}?timestamp=${timestamp || ''}`
  )
  const { data: edata, error: eerror } = useFetch(
    user ? user : null,
    `/api/timeline/events?key=${key}`
  )
  const [title, setTitle] = useState(key)

  useEffect(() => {
    if (user) {
      mutate(
        [`/api/mindmaps/${key}?timestamp=${timestamp || ''}`, user.token],
        null,
        true
      )
    }
  }, [user, timestamp, key])

  useEffect(() => {
    if (user) {
      mutate([`/api/timeline/events?key=${key}`, user.token], null, true)
    }
  }, [user, key])

  useEffect(() => {
    if (data && data.ok) {
      setTitle(data.data.meta.name)
    }
  }, [data])

  useEffect(() => {
    const handleRouteChange = (url) => {
      const fullURL = new URL(url, location.origin)
      const toTs = fullURL.searchParams.get('timestamp')
      const toTsF = parseFloat(toTs) || null

      if ((!toTsF && timestamp) || toTsF !== timestamp) {
        setTimestamp(toTsF)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, timestamp])

  if (typeof user === 'undefined') {
    return <Spinner />
  }

  if (error && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch mind map!',
      type: 'danger',
      autoDismiss: 7,
    }

    window.notify(options)
  }

  if (eerror && window.notify) {
    const options = {
      place: 'tr',
      message: 'Failed to fetch events!',
      type: 'danger',
      autoDismiss: 7,
    }

    window.notify(options)
  }

  const gotEventData = !eerror && edata && edata.ok
  const cEvents = gotEventData && edata.data
  const prevDisabled = !gotEventData || timestamp === cEvents[0].lctime
  const nextDisabled = !gotEventData || timestamp === last(cEvents).lctime

  async function jump(to) {
    if (to === 'now') {
      await router.push('/mmaps/[key]', `/mmaps/${key}`, { shallow: true })
      setTimestamp(null)
    } else if (gotEventData) {
      let toTS, idx

      switch (to) {
        case 'first':
          toTS = cEvents[0].lctime
          break

        case 'prev':
          idx = timestamp
            ? findIndex(cEvents, { lctime: timestamp })
            : cEvents.length
          toTS = cEvents[idx - 1].lctime
          break

        case 'next':
          idx = timestamp
            ? findIndex(cEvents, { lctime: timestamp })
            : cEvents.length - 2
          toTS = cEvents[idx + 1].lctime
          break

        case 'last':
          toTS = last(cEvents).lctime
          break

        default:
          toTS = to
      }

      await router.push(
        '/mmaps/[key]',
        {
          pathname: `/mmaps/${key}`,
          query: { timestamp: toTS },
        },
        { shallow: true }
      )
      setTimestamp(toTS)
    }
  }

  if (user) {
    const output = [
      <Row key="title">
        <Col xs="auto" md={7}>
          <h3>
            {title}
            {timestamp ? (
              <>
                &nbsp;
                <small className={'text-muted'}>
                  {' '}
                  @ {new Date(timestamp * 1000).toLocaleString()}
                </small>
              </>
            ) : null}
          </h3>
        </Col>
        <Col xs="auto" md={5} className={'text-right'}>
          <ShowAll />
          <Fit />
          <Search />
          &nbsp;&nbsp;|&nbsp;
          <ToolTippedButton
            className="ml-1"
            outline
            color="secondary"
            id="tag"
            disabled={true}
            tooltip="Tag (Coming Soon)"
          >
            <Tag size={16} />
          </ToolTippedButton>
          <ToolTippedButton
            className="ml-1"
            outline
            color="secondary"
            id="first"
            disabled={prevDisabled}
            tooltip="First"
            onClick={() => jump('first')}
          >
            <SkipBack size={16} />
          </ToolTippedButton>
          <ToolTippedButton
            className="ml-1"
            outline
            color="secondary"
            id="prev"
            disabled={prevDisabled}
            tooltip="Previous"
            onClick={() => jump('prev')}
          >
            <Rewind size={16} />
          </ToolTippedButton>
          <ToolTippedButton
            className="ml-1"
            outline
            color="secondary"
            id="next"
            disabled={nextDisabled}
            tooltip="Next"
            onClick={() => jump('next')}
          >
            <FastForward size={16} />
          </ToolTippedButton>
          <ToolTippedButton
            className="ml-1"
            outline
            color="secondary"
            id="last"
            disabled={nextDisabled}
            tooltip="Last"
            onClick={() => jump('last')}
          >
            <SkipForward size={16} />
          </ToolTippedButton>
          &nbsp;&nbsp;|&nbsp;
          <Rename
            nameChangedCallBack={setTitle}
            disabled={!!timestamp}
            rootNode={get(data, ['data', 'meta'], {})}
          />
          <ToolTippedButton
            className="ml-1"
            outline
            color={timestamp ? 'secondary' : 'danger'}
            id="now"
            tooltip={timestamp ? 'Click to unlock' : 'Click to lock'}
            onClick={() => jump(timestamp ? 'now' : 'last')}
          >
            {timestamp ? <Lock size={16} /> : <Unlock size={16} />}
          </ToolTippedButton>
        </Col>
      </Row>,
    ]

    if (error && data) {
      output.push(
        <Row key="content">
          <Col>
            <Error statusCode={data.status} />
          </Col>
        </Row>
      )
    } else if (eerror && edata) {
      output.push(
        <Row key="content">
          <Col>
            <Error statusCode={edata.status} />
          </Col>
        </Row>
      )
    } else {
      output.push(
        <Row key="content">
          <Col>
            <MindMap
              data={data}
              edata={edata}
              timestamp={timestamp}
              jump={jump}
            />
          </Col>
        </Row>
      )
    }

    return output
  }

  return <AuthPrompt />
}

export default Page
