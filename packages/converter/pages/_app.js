import { useEffect } from 'react'
import App from 'next/app'
import { useRouter } from 'next/router'
import * as gtag from '../utils/gtag'
import { appWithTranslation } from '../i18n'
import '../styles/global.css'

const LationApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

LationApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) })

export default appWithTranslation(LationApp)