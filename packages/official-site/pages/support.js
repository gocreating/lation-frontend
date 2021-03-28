import Container from 'react-bootstrap/Container'
import { Trans } from 'react-i18next'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const SupportPage = ({ t }) => {
  return (
    <AppLayout>
      <Container style={{ marginTop: '2rem' }}>
        <h1>{t('support.title')}</h1>
        <p>
          <Trans
            t={t}
            i18nKey="support.description"
            values={{ email: 'support@lation.app' }}
            components={{ a: <a /> }}
          />
        </p>
        <h1>{t('status.title')}</h1>
        <p>
          <Trans
            t={t}
            i18nKey="status.description"
            values={{ href: 'https://status.lation.app' }}
            components={{ a: <a /> }}
          />
        </p>
      </Container>
    </AppLayout>
  )
}

SupportPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(SupportPage)
