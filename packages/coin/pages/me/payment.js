import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'
import zhTWLocale from 'date-fns/locale/zh-TW'
import enUSLocale from 'date-fns/locale/en-US'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import { listSubscriptions, selectors as productSelectors } from '@lation/utils/ducks/product'
import Table, { Th } from '@lation/components/Table'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import LoadFail from '../../components/LoadFail'
import Spinner from '../../components/Spinner'
import { withTranslation } from '../../i18n'

const PaymentPage = ({ t, i18n }) => {
  const dispatch = useDispatch()
  const subscriptions = useSelector(productSelectors.getSubscriptions)
  const listSubscriptionsMata = useSelector(productSelectors.getListSubscriptionsMeta)
  useEffect(() => {
    dispatch(listSubscriptions())
  }, [])
  const lang = i18n.language
  const dateFnsLocale = lang === 'zh-TW' ? zhTWLocale : enUSLocale

  return (
    <AppLayout title={t('common:me.payment.title')} noAd>
      {listSubscriptionsMata.isRequesting ? (
        <Spinner />
      ) : (
        <Card>
          <Card.Header>
            {t('common:me.payment.title')}
          </Card.Header>
          {listSubscriptionsMata.isRequestFail ? (
            <LoadFail />
          ) : (
            subscriptions.length === 0 ? (
              <Card.Body>
                {t('common:me.payment.card.noRecord')}
              </Card.Body>
            ) : (
              <Table responsive="lg">
                <thead>
                  <tr>
                    <Th>{t('common:me.payment.table.purchaseTime')}</Th>
                    <Th>{t('common:me.payment.table.product')}</Th>
                    <Th>{t('common:me.payment.table.plan')}</Th>
                    <Th>{t('common:me.payment.table.billedAmount')}</Th>
                    <Th>{t('common:me.payment.table.effectivePeriod')}</Th>
                    <Th>{t('common:me.payment.table.remainingTime')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map(subscription => {
                    const dueTime = parseISO(`${subscription.due_time}Z`)
                    const isDue = dueTime < new Date()
                    const billed_amount = subscription.order_plan.order.payment.billed_amount
                    return (
                      <tr key={subscription.id}>
                        <td>
                          {format(parseISO(`${subscription.order_plan.order.payment.create_time}Z`), 'yyyy/MM/dd HH:mm:ss')}
                        </td>
                        <td>
                          {t(`product:productMap.${subscription.order_plan.plan.product.code}.title`)}
                        </td>
                        <td>
                          {t(`product:productMap.${subscription.order_plan.plan.product.code}.planMap.${subscription.order_plan.plan.code}.title`)}
                        </td>
                        <td>
                          {billed_amount === 0 ? t('product:free') : `${subscription.order_plan.order.payment.billed_currency.code} ${billed_amount}`}
                        </td>
                        <td>
                          {format(parseISO(`${subscription.subscribe_time}Z`), 'yyyy/MM/dd HH:mm:ss')}
                          {' - '}
                          {format(dueTime, 'yyyy/MM/dd HH:mm:ss')}
                        </td>
                        <td>
                          {isDue ? t('common:me.payment.table.expired') : formatDistance(new Date(dueTime), new Date(), { locale: dateFnsLocale })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )
          )}
        </Card>
      )}
      <Alert variant="info">
        {'信用卡付款完成即刻生效，如果您已完成付款卻查無儲值紀錄，請透過右下方即時對話服務或是寄信至 '}
        <a href="mailto:support@lation.app">support@lation.app</a>
        {' 聯繫客服人員。'}
      </Alert>
    </AppLayout>
  )
}

PaymentPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'product'],
})

export default withTranslation(['common', 'product'])(PaymentPage)
