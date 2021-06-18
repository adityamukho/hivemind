import React from 'react'
import { Col, Row } from 'reactstrap'
import Canvas from './Canvas'
import Timeline from './Timeline'

const MindMap = ({ data, edata, timestamp, jump }) => (
  <>
    <Row className="my-1">
      <Col>
        <Canvas data={data} timestamp={timestamp} events={edata} />
      </Col>
    </Row>
    <Row className="my-1">
      <Col>
        <Timeline data={edata} timestamp={timestamp} jump={jump} />
      </Col>
    </Row>
  </>
)

export default MindMap
