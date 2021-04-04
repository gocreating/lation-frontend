import { fromJS } from 'immutable'

const API_HOST = process.env.NEXT_PUBLIC_API_HOST

/**
 * Actions
 */
const LIST_PAYMENT_GATEWAYS_REQUEST = 'LIST_PAYMENT_GATEWAYS_REQUEST'
const LIST_PAYMENT_GATEWAYS_SUCCESS = 'LIST_PAYMENT_GATEWAYS_SUCCESS'
const LIST_PAYMENT_GATEWAYS_FAIL = 'LIST_PAYMENT_GATEWAYS_FAIL'

const SET_PAYMENT_GATEWAYS = 'SET_PAYMENT_GATEWAYS'

/**
 * Action Creators
 */
export const listPaymentGatewaysRequest = () => ({
  type: LIST_PAYMENT_GATEWAYS_REQUEST,
})

export const listPaymentGatewaysSuccess = (res) => ({
  type: LIST_PAYMENT_GATEWAYS_SUCCESS,
  payload: { res },
})

export const listPaymentGatewaysFail = (error, res) => ({
  type: LIST_PAYMENT_GATEWAYS_FAIL,
  payload: { error, res },
})

export const setPaymentGateways = (paymentGateways) => ({
  type: SET_PAYMENT_GATEWAYS,
  payload: { paymentGateways },
})

/**
 * Action Creators with Side Effects
 */
export const listPaymentGateways = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listPaymentGatewaysRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/payment-gateways`)
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setPaymentGateways(data))
      dispatch(listPaymentGatewaysSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listPaymentGatewaysFail(new Error('Fail to fetch payment gateways'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listPaymentGatewaysFail(err, res))
    onFail && onFail()
  }
}

/**
 * Default State
 */
const defaultState = {
  listPaymentGatewaysMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  paymentGateways: [],
}

/**
 * Selectors
 */
export const selectors = {
  getPaymentGateways(state) {
    return fromJS(state.payment)
      .get('paymentGateways')
      .toJS()
  },
  getListPaymentGatewaysMeta(state) {
    return fromJS(state.payment)
      .get('listPaymentGatewaysMeta')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LIST_PAYMENT_GATEWAYS_REQUEST:
      return fromJS(state)
        .setIn(['listPaymentGatewaysMeta', 'isRequesting'], true)
        .toJS()
    case LIST_PAYMENT_GATEWAYS_SUCCESS:
      return fromJS(state)
        .setIn(['listPaymentGatewaysMeta', 'isRequesting'], false)
        .setIn(['listPaymentGatewaysMeta', 'isRequested'], true)
        .setIn(['listPaymentGatewaysMeta', 'isRequestSuccess'], true)
        .setIn(['listPaymentGatewaysMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_PAYMENT_GATEWAYS_FAIL:
      return fromJS(state)
        .setIn(['listPaymentGatewaysMeta', 'isRequesting'], false)
        .setIn(['listPaymentGatewaysMeta', 'isRequested'], true)
        .setIn(['listPaymentGatewaysMeta', 'isRequestSuccess'], false)
        .setIn(['listPaymentGatewaysMeta', 'isRequestFail'], true)
        .toJS()
    case SET_PAYMENT_GATEWAYS: {
      const { paymentGateways } = action.payload
      return fromJS(state)
        .set('paymentGateways', paymentGateways)
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
