import Document, { Html, Head, Main, NextScript } from 'next/document'
import { FacebookRoot } from '@lation/components/FacebookMessenger'
import { GoogleAdSenseHeader } from '@lation/components/GoogleAdSense'
import { ADSENSE_CLIENT_ID } from '../utils/config'

class LationDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <GoogleAdSenseHeader clientId={ADSENSE_CLIENT_ID} />
        <body>
          <FacebookRoot />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LationDocument
