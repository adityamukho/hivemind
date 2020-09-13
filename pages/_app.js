import React, { Component } from 'react'
import 'react-notification-alert/dist/animate.css'
import GlobalContext from '../components/GlobalContext'
import Layout from '../components/layout/Layout'
import '../styles/index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css'

export default function App ({ Component, pageProps }) {
  const cyWrapper = {cy: null}
  const poppers = {}
  const pageVars = {title: 'Hivemind'}

  return <GlobalContext.Provider value={{ cyWrapper, poppers, pageVars }}>
    <Layout title={process.env.NEXT_PUBLIC_APP_NAME}>
      <Component {...pageProps}/>
    </Layout>
  </GlobalContext.Provider>

}