import React, { useEffect, useRef } from 'react'
import { Spinner } from 'reactstrap'
import { Timeline as VisTimeline } from 'vis-timeline'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper from '../../utils/fetchWrapper'

export default function timeline ({ mkey }) {
  const { user } = useUser()
  const { data, error } = fetchWrapper(user ? user : null, `/api/mindmaps/${mkey}/timeline`)

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
    margin: '2px',
    type: 'box',
    stack: false,
    horizontalScroll: false,
    verticalScroll: false,
    cluster: {
      titleTemplate: '{count}',
      maxItems: 1,
      clusterCriteria: () => true,
      showStipes: true,
      fitOnDoubleClick: true
    },
    max: items[items.length - 1].start + margin,
    min: items[0].start - margin
  }

  useEffect(() => {
    const container = timelineRef.current
    const timeline = new VisTimeline(
      container,
      items,
      options
    )

    return () => timeline.destroy()
  }, [data.length])

  return <div className={'border border-secondary rounded'}>
    <div id={'timeline'} ref={timelineRef} className={'m-1'}/>
  </div>
}