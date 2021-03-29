import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import Base64Converter from '../components/converters/Base64Converter'

const Base64Page = ({ t }) => {
  return (
    <AppLayout title={t('base64.title')}>
      <h3>{t('base64.title')}</h3>
      <Base64Converter />
    </AppLayout>
  )
}

Base64Page.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Base64Page)