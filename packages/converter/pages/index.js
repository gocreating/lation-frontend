import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import Base64Converter from '../components/converters/Base64Converter'
import TemperatureConverter from '../components/converters/TemperatureConverter'

const HomePage = ({ t }) => {
  return (
    <AppLayout title={t('home.title')} titleSuffix={false}>
      <p>{t('home.description')}</p>
      <h3>{t('base64.title')}</h3>
      <Base64Converter />
      <h3>{t('temperature.title')}</h3>
      <TemperatureConverter />
    </AppLayout>
  )
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(HomePage)
