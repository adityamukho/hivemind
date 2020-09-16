import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import Timeline from './Timeline'

const MindMap = ({ data, setTitle }) => {
  const [renderAuth, setRenderAuth] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
      setTitle(data.meta.name)
    }
  }, [data.meta.name])

  if (renderAuth) {
    const { default: Canvas } = require('./Canvas')

    return <>
      <Row className="my-1">
        <Col>
          <Canvas {...data}/>
        </Col>
      </Row>
      <Row className="my-1">
        <Col>
          <Timeline mkey={data.meta._key}/>
        </Col>
      </Row>
    </>
  }

  return null
}

export default MindMap