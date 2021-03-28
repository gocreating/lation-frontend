import { useEffect } from 'react'

export const GoogleAdSenseHeader = ({ clientId }) => {
  return (
    <script
      data-ad-client={clientId}
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />
  )
}

export const GoogleAdSenseAdUnit = ({ clientId, adUnitId }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={adUnitId}
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
    />
  )
}
