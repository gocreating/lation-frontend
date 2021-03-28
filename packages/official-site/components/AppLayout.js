import { NextSeo, ProductJsonLd } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import { FacebookMessengerHeader, FacebookMessengerChatPlugin } from '@lation/components/FacebookMessenger'
import { GoogleAnalyticsHeader } from '@lation/components/GoogleAnalytics'
import { GoogleAdSenseAdUnit } from '@lation/components/GoogleAdSense'
import Navigation from './Navigation'
import { withTranslation } from '../i18n'
import { ADSENSE_CLIENT_ID, FACEBOOK_PAGE_ID, GA_TRACKING_ID, adUnitIdMap } from '../utils/config'
import 'bootstrap/dist/css/bootstrap.min.css'

export const config = { amp: true }

const AppLayout = ({ t, children }) => {
  const router = useRouter()
  return (
    <>
      <NextSeo
        title={t('site.title')}
        description={t('site.description')}
        languageAlternates={[{
          hrefLang: 'en',
          href: `https://lation.app/en${router.pathname}`,
        }, {
          hrefLang: 'zh-TW',
          href: `https://lation.app/zh-TW${router.pathname}`,
        }]}
      />
      <Head>
        <title>{t('site.title')}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <ProductJsonLd
        productName={t('site.title')}
        description={t('site.description')}
        brand="Lation"
        images={['https://lation.app/logo.png']}
        keywords={t('site.keywords')}
        offers={[]}
        reviews={[]}
        aggregateRating={{
          ratingValue: '5',
          reviewCount: '1',
        }}
      />
      <GoogleAnalyticsHeader trackingId={GA_TRACKING_ID} />
      <FacebookMessengerHeader />
      <Navigation />
      {children}
      <Container style={{ marginTop: '2rem', marginBottom: '2rem', overflow: 'auto' }}>
        <GoogleAdSenseAdUnit
          adUnitId={adUnitIdMap.adunit_official_site_banner}
          clientId={ADSENSE_CLIENT_ID}
        />
      </Container>
      <FacebookMessengerChatPlugin pageId={FACEBOOK_PAGE_ID} />
    </>
  )
}

AppLayout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

AppLayout.defaultProps = {
  title: 'Lation',
}

export default withTranslation('common')(AppLayout)
