import Layout from '../components/layout/Layout'
import '../styles/index.css'

export default function App ({ Component, pageProps }) {
  return <Layout title={process.env.NEXT_PUBLIC_APP_NAME}>
    <Component {...pageProps} />
  </Layout>
}