import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import { selectors as authSelectors } from '@lation/utils/ducks/auth'
import { listProducts, selectors as productSelectors } from '../ducks/product'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const ProductPage = ({ t }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [userPlanIds, setUserPlanIds] = useState([])
  const isAuth = useSelector(authSelectors.getIsAuth)
  const products = useSelector(productSelectors.getProducts)

  useEffect(() => dispatch(listProducts()), [])

  useEffect(async () => {
    if (isAuth) {
      const res = await fetch(`${API_HOST}/orders`, { credentials: 'include' })
      const { data } = await res.json()
      let planIds = []
      data.forEach(order => {
        order.order_plans.forEach(orderPlan => {
          planIds.push(orderPlan.plan_id)
        })
      })
      setUserPlanIds(planIds)
    } else {
      setUserPlanIds([])
    }
  }, [isAuth])

  const handleCreateOrder = async (planId) => {
    const res = await fetch(`${API_HOST}/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId })
    })
    if (res.status === 200) {
      router.push('/me/subscription')
    } else {
      const { detail } = await res.json()
      alert(detail)
    }
  }

  return (
    <AppLayout title={t('product.title')}>
      <h2 className="text-center">{t('product.title')}</h2>
      <Container style={{ marginTop: 20 }}>
        {products.map(product => (
          <div key={product.id}>
            <h3 style={{ marginTop: 48 }}>
              {t(`productMap.${product.code}.title`)}
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
                      <h4 style={{ marginTop: 16 }}>{t(`productMap.${product.code}.plan.${plan.code}.title`)}</h4>
                      <p>{t(`productMap.${product.code}.plan.${plan.code}.description`)}</p>
                      <p>
                        <strong>
                          {t(`productMap.${product.code}.plan.${plan.code}.pricing`)}
                        </strong>
                      </p>
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={!isAuth || isOrderExist}
                        onClick={() => handleCreateOrder(plan.id)}
                      >
                        {isAuth && !isOrderExist && t('product.cta.default')}
                        {!isAuth && t('product.cta.loginRequired')}
                        {isOrderExist && t('product.cta.purchased')}
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
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ProductPage)
