import { useEffect } from 'react'

export const GoogleAnalyticsHeader = ({ trackingId }) => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function _gtag(){dataLayer.push(arguments)}
    window.gtag = _gtag
    _gtag('js', new Date())
    _gtag('config', trackingId)
  }, [])

  /* Global Site Tag (gtag.js) - Google Analytics */
  return (
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
    />
  )
}
