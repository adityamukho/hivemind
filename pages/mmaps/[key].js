import Error from 'next/error'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { Col, Row, Spinner } from 'reactstrap'
import AuthPrompt from '../../components/auth/AuthPrompt'
import GlobalContext from '../../components/GlobalContext'
import MindMap from '../../components/mindmap/MindMap'
import { useUser } from '../../utils/auth/useUser'
import fetchWrapper from '../../utils/fetchWrapper'

const Page = () => {
  const router = useRouter()
  const { user } = useUser()
  const { key } = router.query
  const { data, error } = fetchWrapper(user, `/api/mindmaps/${key}`)
  const { notify } = useContext(GlobalContext)
  const [title, setTitle] = useState(key)

  if (user) {
    if (error && notify.current) {
      const options = {
        place: 'tr',
        message: 'Failed to fetch mind map!',
        type: 'danger',
        autoDismiss: 7
      }

      notify.current.notificationAlert(options)
    }

    const output = [
      <Row>
        <Col xs="auto"><h3>Mind Map - {title}</h3></Col>
      </Row>
    ]

    if (data && !error) {
      output.push(
        <Row>
          <Col>
            {data.ok ? <MindMap data={data.data} setTitle={setTitle}/> : <Error statusCode={data.status}/>}
          </Col>
        </Row>
      )
    }
    else {
      output.push(
        <Row>
          <Col>
            <Spinner/>
          </Col>
        </Row>
      )
    }

    return output
  }

  return <AuthPrompt/>
}

export default Page