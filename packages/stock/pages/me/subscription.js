import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import { listOrders, selectors as orderSelectors } from '@lation/utils/ducks/order'
import { listSubscriptions, subscribe, unsubscribe, selectors as productSelectors } from '@lation/utils/ducks/product'
import { getLineFriendship, selectors as socialSelectors } from '@lation/utils/ducks/social'
import Table, { Td, Th } from '@lation/components/Table'
import AppLayout from '../../components/AppLayout'
import Spinner from '../../components/Spinner'
import { withTranslation } from '../../i18n'
import { API_HOST } from '../../utils/config'

const SubscriptionPage = ({ t }) => {
  const dispatch = useDispatch()
  const listSubscriptionsMeta = useSelector(productSelectors.getListSubscriptionsMeta)
  const subscriptions = useSelector(productSelectors.getSubscriptions)
  const listOrdersMeta = useSelector(orderSelectors.getListOrdersMeta)
  const orders = useSelector(orderSelectors.getOrders)
  const getLineFriendshipMeta = useSelector(socialSelectors.getGetLineFriendshipMeta)
  const isLineFriend = useSelector(socialSelectors.getLineIsFriend)

  useEffect(() => {
    dispatch(listOrders())
    dispatch(listSubscriptions())
    dispatch(getLineFriendship())
  }, [])

  const handleSubscriptionChange = async (orderPlan, isChecked) => {
    if (isChecked) {
      dispatch(subscribe(orderPlan.id, null, async (res) => {
        const { detail } = await res.json()
        alert(detail)
      }))
    } else {
      const subscription = subscriptions.find(subscription => subscription.order_plan_id === orderPlan.id)
      dispatch(unsubscribe(subscription.id, null, async (res) => {
        const { detail } = await res.json()
        alert(detail)
      }))
    }
  }

  const orderPlans = orders.reduce((acc, cur) => acc.concat(cur.order_plans), [])
  const subscribedPlanIds = subscriptions.reduce((acc, cur) => {
    if (!cur.unsubscribe_time) {
      return acc.concat([cur.order_plan_id])
    } else {
      return acc
    }
  }, [])
  const isLoaded = (
    listSubscriptionsMeta.isRequestSuccess &&
    listOrdersMeta.isRequestSuccess &&
    getLineFriendshipMeta.isRequestSuccess
  )

  return (
    <AppLayout title={t('common:me.subscription.title')} noAd>
      <h2>{t('common:me.subscription.title')}</h2>
      {!isLoaded ? (
        <Spinner />
      ) : (
        orderPlans.length === 0 ? (
          <p>
            {t('common:me.subscription.noSubscription')}
          </p>
        ) : (
            <Table responsive disabled>
              <thead>
                <tr>
                  <Th>{t('common:me.subscription.table.head.product')}</Th>
                  <Th>{t('common:me.subscription.table.head.plan')}</Th>
                  <Th>{t('common:me.subscription.table.head.subscriptionStatus')}</Th>
                </tr>
              </thead>
              <tbody>
                {orderPlans.map(orderPlan => {
                  const plan = orderPlan.plan
                  const product = plan.product
                  const isChecked = subscribedPlanIds.includes(plan.id)
                  return (
                    <tr key={orderPlan.id}>
                      <Td>{t(`product:productMap.${product.code}.title`)}</Td>
                      <Td>{t(`product:productMap.${product.code}.planMap.${plan.code}.title`)}</Td>
                      <td>
                        {isLineFriend ? (
                          <Form.Check
                            id="subscription_check"
                            type="switch"
                            label={isChecked ? t('common:me.subscription.table.checkbox.label.checked') : t('common:me.subscription.table.checkbox.label.unchecked')}
                            checked={isChecked}
                            onChange={(e) => handleSubscriptionChange(orderPlan, e.target.checked)}
                          />
                        ) : (
                            <Alert variant="warning">
                              <p>
                                {t('common:me.subscription.table.alert.description')}
                              </p>
                              <a
                                // href={`${API_HOST}/auth/line/aggressive-bot-prompt`}
                                target="_blank"
                                href={`${API_HOST}/line/add-friend`}
                              >
                                <Image
                                  thumbnail
                                  src={`${API_HOST}/line/official-account-qr.png`}
                                  style={{ width: 160 }}
                                />
                              </a>
                            </Alert>
                          )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )
      )}
    </AppLayout>
  )
}

SubscriptionPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'product'],
})

export default withTranslation(['common', 'product'])(SubscriptionPage)
