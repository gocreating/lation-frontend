import AppLayout from '../components/AppLayout'
import Products from '../components/Products'
import { withTranslation } from '../i18n'

const ProductsPage = ({ t }) => {
  return (
    <AppLayout>
      <Products
        t={t}
        style={{ marginTop: '2rem' }}
      />
    </AppLayout>
  )
}

ProductsPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ProductsPage)