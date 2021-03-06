import round from 'lodash/round'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import zhTWLocale from 'date-fns/locale/zh-TW'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table, { Th } from '@lation/components/Table'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Card from '../../components/Card'
import LoadFail from '../../components/LoadFail'
import RefreshButton from '../../components/RefreshButton'
import Spinner from '../../components/Spinner'
import {
  cancelBitfinexFundingOffer,
  getBitfinexWallets,
  getBitfinexFundingOffers,
  getBitfinexFundingCredits,
  getState,
  selectors as fundingSelectors,
} from '../../ducks/funding'
import { formatUSD } from '../../utils/format'
import { withTranslation } from '../../i18n'

const FundingPage = ({ t }) => {
  const dispatch = useDispatch()

  const state = useSelector(fundingSelectors.getState)
  const getStateMeta = useSelector(fundingSelectors.getGetStateMeta)
  const wallets = useSelector(fundingSelectors.getBitfinextWallets)
  const getWalletsMeta = useSelector(fundingSelectors.getGetBitfinexWalletsMeta)
  const offers = useSelector(fundingSelectors.getBitfinexFundingOffers)
  const getOffersMeta = useSelector(fundingSelectors.getGetBitfinexFundingOffersMeta)
  const credits = useSelector(fundingSelectors.getBitfinexFundingCredits)
  const getCreditsMeta = useSelector(fundingSelectors.getGetBitfinexFundingCreditsMeta)
  const cancelOfferMetaMap = useSelector(fundingSelectors.getCancelBitfinexFundingOfferMetaMap)
  const [sortedCreditsMeta, setSortedCreditsMeta] = useState({
    key: null,
    direction: null,
  })

  const handleCancelOfferClick = (offerId) => dispatch(cancelBitfinexFundingOffer(offerId))
  const fetchState = () => dispatch(getState())
  const fetchBitfinexWallets = () => dispatch(getBitfinexWallets())
  const fetchBitfinexFundingOffers = () => dispatch(getBitfinexFundingOffers('fUSD'))
  const fetchBitfinexFundingCredits = () => dispatch(getBitfinexFundingCredits('fUSD'))

  const handleSortCredits = (selectedKey) => () => {
    const { key, direction } = sortedCreditsMeta
    setSortedCreditsMeta({
      key: selectedKey,
      direction: (key !== selectedKey || (key === selectedKey && direction !== 'ascending')) ? 'ascending' : 'descending',
    })
  }

  useEffect(() => {
    if (process.browser) {
      fetchState()
      fetchBitfinexWallets()
      fetchBitfinexFundingOffers()
      fetchBitfinexFundingCredits()
    }
  }, [])

  const fundingWallet = wallets.find(wallet => wallet.wallet_type === 'funding' && wallet.currency === 'USD')
  const dailyInterest = credits.reduce((sum, credit) => (sum + credit.amount * credit.rate), 0)
  let sortedCredits = credits.map(credit => {
    return {
      ...credit,
      interestAmount: credit.amount * credit.rate,
      closeTime: new Date(getTime(parseISO(credit.mts_create)) + credit.period * 86400000),
    }
  })
  if (sortedCreditsMeta.key) {
    if (sortedCreditsMeta.direction === 'ascending') {
      sortedCredits = sortBy(sortedCredits, [sortedCreditsMeta.key])
    } else if (sortedCreditsMeta.direction === 'descending') {
      sortedCredits = sortBy(sortedCredits, [sortedCreditsMeta.key]).reverse()
    }
  }

  return (
    <AppLayout title={t('me.funding.title')} noAd>
      <Card border="info">
        <Card.Header>
          ??????
          <RefreshButton
            loading={getStateMeta.isRequesting || getWalletsMeta.isRequesting}
            onClick={() => {
              fetchState()
              fetchBitfinexWallets()
              fetchBitfinexFundingCredits()
            }}
          />
        </Card.Header>
        {getStateMeta.isRequesting || getWalletsMeta.isRequesting ? (
          <Spinner />
        ) : (
          <Card.Body>
            <Row>
              <Col xs={12} md={3}>
                ?????????????????????
                <h3>
                  <Badge pill variant="info">
                    {fundingWallet ? formatUSD(round(fundingWallet?.balance, 2)) : 'N/A'}
                  </Badge>
                </h3>
              </Col>
              <Col xs={12} md={3}>
                ????????????????????????
                <h3>
                  <Badge pill variant="info">
                    {fundingWallet ? formatUSD(round(fundingWallet?.available_balance, 2)) : 'N/A'}
                  </Badge>
                </h3>
              </Col>
              <Col xs={12} md={3}>
                ????????????????????????
                <h3>
                  <Badge pill variant="info">
                    {`${round(state.funding_market_recommended_ask_rate * 365 * 100, 1).toFixed(1)}%`}
                  </Badge>
                </h3>
              </Col>
              <Col xs={12} md={3}>
                ??????????????????
                <h3>
                  <Badge pill variant="info">
                    {formatUSD(round(dailyInterest * 0.85, 2))}
                  </Badge>
                </h3>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>

      <Card>
        <Card.Header>
          {offers.length === 0 ? '???????????????' : `??????????????????${offers.length} ??????`}
          <RefreshButton
            loading={getOffersMeta.isRequesting}
            onClick={() => fetchBitfinexFundingOffers()}
          />
        </Card.Header>
        {getOffersMeta.isRequesting ? (
          <Spinner />
        ) : (
          getOffersMeta.isRequestFail ? (
            <LoadFail />
          ) : (
            offers.length === 0 ? (
              <Card.Body>
                ????????????????????????
              </Card.Body>
            ) : (
              <Table responsive="lg">
                <thead>
                  <tr>
                    <Th>????????????</Th>
                    <Th>????????????</Th>
                    <Th>??????</Th>
                    <Th>?????????</Th>
                    <Th>????????????</Th>
                    <Th>????????????</Th>
                    <Th>??????</Th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => {
                    const meta = cancelOfferMetaMap[offer.id] || {}
                    return (
                      <tr key={offer.id}>
                        <td>{offer.id}</td>
                        <td>{offer.symbol}</td>
                        <td>{round(offer.amount, 2).toFixed(2)}</td>
                        <td>{`${round(offer.rate * 100, 5).toFixed(5)}%`}</td>
                        <td>{`${round(offer.rate * 365 * 100, 1).toFixed(1)}%`}</td>
                        <td>{`${offer.period} ???`}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            loading={meta.isRequesting}
                            onClick={() => handleCancelOfferClick(offer.id)}
                          >
                            <i className="fas fa-times" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )
          )
        )}
      </Card>

      <Card>
        <Card.Header>
          {credits.length === 0 ? '???????????????' : `??????????????????${credits.length} ??????`}
          <RefreshButton
            loading={getCreditsMeta.isRequesting}
            onClick={() => fetchBitfinexFundingCredits()}
          />
        </Card.Header>
        {getCreditsMeta.isRequesting ? (
          <Spinner />
        ) : (
          getCreditsMeta.isRequestFail ? (
            <LoadFail />
          ) : (
            credits.length === 0 ? (
              <Card.Body>
                ?????????????????????
              </Card.Body>
            ) : (
              <Table responsive="lg">
                <thead>
                  <tr>
                    <Th />
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'amount' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('amount')}
                    >
                      ??????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'interestAmount' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('interestAmount')}
                    >
                      ??????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'rate' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('rate')}
                    >
                      ?????????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'rate' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('rate')}
                    >
                      ????????????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'period' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('period')}
                    >
                      ????????????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'closeTime' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('closeTime')}
                    >
                      ??????????????????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'mts_create' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('mts_create')}
                    >
                      ????????????
                    </Th>
                    <Th
                      sortable
                      sortedDirection={sortedCreditsMeta.key === 'position_pair' ? sortedCreditsMeta.direction : null}
                      onClick={handleSortCredits('position_pair')}
                    >
                      ??????
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCredits.map((credit, index) => {
                    const now = new Date()
                    return (
                      <tr key={credit.id}>
                        <td>{`#${index + 1}`}</td>
                        <td>{round(credit.amount, 2).toFixed(2)}</td>
                        <td>{`${round(credit.interestAmount, 3).toFixed(3)}`}</td>
                        <td>{`${round(credit.rate * 100, 5).toFixed(5)}%`}</td>
                        <td>{`${round(credit.rate * 100 * 365, 1).toFixed(1)}%`}</td>
                        <td>{`${credit.period} ???`}</td>
                        <td>
                          {credit.closeTime < now
                            ? '?????????'
                            : formatDistanceToNowStrict(credit.closeTime, { roundingMethod: 'floor', locale: zhTWLocale })
                          }
                        </td>
                        <td>{format(parseISO(credit.mts_create), 'yyyy/MM/dd HH:mm:ss')}</td>
                        <td>{credit.position_pair}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )
          )
        )}
      </Card>
    </AppLayout>
  )
}

FundingPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(FundingPage)
