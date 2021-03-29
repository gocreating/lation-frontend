import AppLayout from '../components/AppLayout'
import TemperatureConverter from '../components/converters/TemperatureConverter'
import { withTranslation } from '../i18n'

const TemperaturePage = ({ t }) => {
  return (
    <AppLayout title={t('temperature.title')}>
      <h3>{t('temperature.title')}</h3>
      <TemperatureConverter />
    </AppLayout>
  )
}

TemperaturePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(TemperaturePage)