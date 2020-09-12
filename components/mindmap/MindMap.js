import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { Redraw, Search } from "./action-items"

const MindMap = ({ data, setTitle }) => {
  const [renderAuth, setRenderAuth] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
      setTitle(data.meta.name)
    }
  }, [])

  if (renderAuth) {
    const { default: Canvas } = require('./Canvas')

    return <>
      <Row className="my-1">
        <Col>
          <Redraw/>
          <Search/>
        </Col>
      </Row>
      <Row>
        <Col>
          <Canvas elements={data.elements}/>
        </Col>
      </Row>
    </>
  }

  return null
}

export default MindMap