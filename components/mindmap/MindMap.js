import React from 'react'
import { Row, Col } from 'reactstrap'
import Timeline from './Timeline'
import Canvas from './Canvas'

const MindMap = ({ data, edata, timestamp, jump }) =>
  <>
    <Row className="my-1">
      <Col>
        <Canvas data={data} timestamp={timestamp} events={edata}/>
      </Col>
    </Row>
    <Row className="my-1">
      <Col>
        <Timeline data={edata} timestamp={timestamp} jump={jump}/>
      </Col>
    </Row>
  </>

export default MindMap