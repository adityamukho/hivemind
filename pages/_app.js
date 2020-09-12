import React, { Component, useRef } from 'react'
import 'react-notification-alert/dist/animate.css'
import GlobalContext from '../components/GlobalContext'
import Layout from '../components/layout/Layout'
import '../styles/index.css'

export default function App ({ Component, pageProps }) {
  const notify = useRef(null)
  const cyComp = useRef(null)

  return <GlobalContext.Provider value={{ notify, cyComp }}>
    <Layout title={process.env.NEXT_PUBLIC_APP_NAME}>
      <Component {...pageProps} />
    </Layout>
  </GlobalContext.Provider>

}