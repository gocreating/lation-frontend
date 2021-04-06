import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import { selectors as authSelectors } from '@lation/utils/ducks/auth'
import { createOrder } from '@lation/utils/ducks/order'
import { listPaymentGateways, selectors as paymentSelectors } from '@lation/utils/ducks/payment'
import { listProducts, selectors as productSelectors } from '@lation/utils/ducks/product'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const ProductPage = ({ t }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [userPlanIds, setUserPlanIds] = useState([])
  const isAuth = useSelector(authSelectors.getIsAuth)
  const products = useSelector(productSelectors.getProducts)
  const paymentGateways = useSelector(paymentSelectors.getPaymentGateways)

  useEffect(() => {
    dispatch(listPaymentGateways())
    dispatch(listProducts())
  }, [])

  const handleCreateOrder = async (plan) => {
    if (!isAuth) {
      alert('Please login first')
      return
    }
    dispatch(createOrder(plan.id, (order) => {
      router.push(`${API_HOST}/orders/${order.id}/charge?payment_gateway_id=${paymentGateways[0].id}`)
    }, async (res) => {
      const { detail } = await res.json()
      alert(detail)
    }))
  }

  return (
    <AppLayout title={t('common:product.title')}>
      <h2 className="text-center">{t('common:product.title')}</h2>
      <Container style={{ marginTop: 20 }}>
        {products.map(product => (
          <div key={product.id}>
            <h3 style={{ marginTop: 48 }}>
              {t(`product:productMap.${product.code}.title`)}
            </h3>
            <hr />
            <Row>
              {product.plans.map(plan => {
                const isOrderExist = userPlanIds.includes(plan.id)
                return (
                  <React.Fragment key={plan.id}>
                    <Col md={12} lg={6}>
                      <Image
                        fluid rounded
                        src={`/images/${product.code}_${plan.code}.jpg`}
                      />
                    </Col>
                    <Col md={12} lg={6}>
                      <h4 style={{ marginTop: 16 }}>{t(`product:productMap.${product.code}.planMap.${plan.code}.title`)}</h4>
                      <p>{t(`product:productMap.${product.code}.planMap.${plan.code}.description`)}</p>
                      {plan.plan_prices.map(planPrice => {
                        return (
                          <h5 key={`${planPrice.currency.code}${planPrice.standard_price_amount}`}>
                            <strong>
                              {planPrice.standard_price_amount === 0
                                ? t('product:free')
                                : `${planPrice.currency.code} ${planPrice.standard_price_amount}`}
                            </strong>
                          </h5>
                        )
                      })}
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={!isAuth}
                        onClick={() => handleCreateOrder(plan)}
                      >
                        {isAuth && !isOrderExist && t('common:product.cta.default')}
                        {!isAuth && t('common:product.cta.loginRequired')}
                      </Button>
                    </Col>
                  </React.Fragment>
                )
              })}
            </Row>
          </div>
        ))}
      </Container>
    </AppLayout>
  )
}

ProductPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'product'],
})

export default withTranslation(['common', 'product'])(ProductPage)
