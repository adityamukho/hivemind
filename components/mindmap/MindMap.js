import React, { useEffect, useState } from 'react'

const MindMap = ({ data, setTitle }) => {
  const [renderAuth, setRenderAuth] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
    }
  }, [])

  setTitle(data.meta.name)

  if (renderAuth) {
    const { default: Canvas } = require('./Canvas')

    return <Canvas elements={data.elements}/>
  }

  return null
}

export default MindMap