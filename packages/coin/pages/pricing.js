import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { selectors as authSelectors } from '@lation/utils/ducks/auth'
import { createOrder, selectors as orderSelectors } from '@lation/utils/ducks/order'
import { listPaymentGateways, selectors as paymentSelectors } from '@lation/utils/ducks/payment'
import { listProducts, selectors as productSelectors } from '@lation/utils/ducks/product'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const ProductContainer = styled(Container)`
  padding-top: 3rem;
`

const StyledContainer = styled(Container)`
  padding: 32px;
  border-radius: 4px;
  cursor: pointer;
  ${props => props.$isActive ? css`
    background-color: rgb(85, 82, 115);
    color: white;
  ` : css`
    &:hover {
      background-color: rgba(85, 82, 115, 0.1);
    }
  `}
`

const StyledToggleButton = styled(ToggleButton)`
  input {
    display: none;
  }
`

const PricingPage = ({ t }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuth = useSelector(authSelectors.getIsAuth)
  const products = useSelector(productSelectors.getProducts)
  const paymentGateways = useSelector(paymentSelectors.getPaymentGateways)
  const listProductsMeta = useSelector(productSelectors.getListProductsMeta)
  const createOrderMata = useSelector(orderSelectors.getCreateOrderMeta)
  const [selectedPlans, setSeletedPlans] = useState([])

  useEffect(() => {
    dispatch(listPaymentGateways())
    dispatch(listProducts())
  }, [])

  const handleSelectPlan = (isChecked, plan) => {
    if (isChecked) {
      setSeletedPlans([plan])
    } else {
      setSeletedPlans([])
    }
  }

  const handleCreateOrder = async () => {
    if (!isAuth) {
      alert('Please login first')
      return
    }
    const plan = selectedPlans[0]
    dispatch(createOrder(plan.id, (order) => {
      router.push(`${API_HOST}/orders/${order.id}/charge?payment_gateway_id=${paymentGateways[0].id}`)
    }, async (res) => {
      const { detail } = await res.json()
      alert(detail)
    }))
  }

  return (
    <AppLayout title={t('common:pricing.title')} titleSuffix={false} noAd>
      <h2 className="text-center">{t('common:pricing.title')}</h2>
      <ProductContainer>
        {listProductsMeta.isRequesting && (
          <Spinner />
        )}
        {products.sort((a, b) => (a.sequence - b.sequence)).map(product => {
          return (
            <div key={product.id}>
              <h3>
                {t(`product:productMap.${product.code}.title`)}
              </h3>
              <p>
              {t(`product:productMap.${product.code}.description`)}
              </p>
              <hr />
              <Row>
                {product.plans.sort((a, b) => (a.sequence - b.sequence)).map(plan => {
                  const isActive = selectedPlans.find(p => p.code === plan.code) !== undefined
                  return (
                    <Col key={plan.id} lg={4}>
                      <StyledContainer
                        $isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault()
                          handleSelectPlan(true, plan)
                        }}
                      >
                      <h4>{t(`product:productMap.${product.code}.planMap.${plan.code}.title`)}</h4>
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
                      <StyledToggleButton
                        type="checkbox"
                        variant="light"
                        checked={isActive}
                        onChange={e => handleSelectPlan(e.currentTarget.checked, plan)}
                      >
                        {t(`product:choosePlan.cta`)}
                      </StyledToggleButton>
                      </StyledContainer>
                    </Col>
                  )
                })}
              </Row>
            </div>
          )
        })}
      </ProductContainer>
      <hr />
      <Container>
        <Button
          disabled={selectedPlans.length !== 1}
          loading={createOrderMata.isRequesting}
          onClick={() => handleCreateOrder()}
          variant={selectedPlans.length !== 1 ? 'outline-dark' : 'dark'}
          size="lg"
        >
          <i className="fas fa-shopping-cart" />
          {' '}{t(`product:checkout.cta`)}
        </Button>
      </Container>
    </AppLayout>
  )
}

PricingPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'product'],
})

export default withTranslation(['common', 'product'])(PricingPage)
