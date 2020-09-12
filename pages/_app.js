import Layout from '../components/Layout'
import '../styles/index.css'

export default function HivemindApp ({ Component, pageProps }) {
  return <Layout title={process.env.NEXT_PUBLIC_APP_NAME}>
    <Component {...pageProps} />
  </Layout>
}