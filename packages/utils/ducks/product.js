import { fromJS } from 'immutable'

const API_HOST = process.env.NEXT_PUBLIC_API_HOST

/**
 * Actions
 */
const LIST_PRODUCTS_REQUEST = 'LIST_PRODUCTS_REQUEST'
const LIST_PRODUCTS_SUCCESS = 'LIST_PRODUCTS_SUCCESS'
const LIST_PRODUCTS_FAIL = 'LIST_PRODUCTS_FAIL'

const SET_PRODUCTS = 'SET_PRODUCTS'

const LIST_SUBSCRIPTIONS_REQUEST = 'LIST_SUBSCRIPTIONS_REQUEST'
const LIST_SUBSCRIPTIONS_SUCCESS = 'LIST_SUBSCRIPTIONS_SUCCESS'
const LIST_SUBSCRIPTIONS_FAIL = 'LIST_SUBSCRIPTIONS_FAIL'

const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST'
const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
const SUBSCRIBE_FAIL = 'SUBSCRIBE_FAIL'

const UNSUBSCRIBE_REQUEST = 'UNSUBSCRIBE_REQUEST'
const UNSUBSCRIBE_SUCCESS = 'UNSUBSCRIBE_SUCCESS'
const UNSUBSCRIBE_FAIL = 'UNSUBSCRIBE_FAIL'

const SET_SUBSCRIPTIONS = 'SET_SUBSCRIPTIONS'

/**
 * Action Creators
 */
export const listProductsRequest = () => ({
  type: LIST_PRODUCTS_REQUEST,
})

export const listProductsSuccess = (res) => ({
  type: LIST_PRODUCTS_SUCCESS,
  payload: { res },
})

export const listProductsFail = (error, res) => ({
  type: LIST_PRODUCTS_FAIL,
  payload: { error, res },
})

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: { products },
})

export const listSubscriptionsRequest = () => ({
  type: LIST_SUBSCRIPTIONS_REQUEST,
})

export const listSubscriptionsSuccess = (res) => ({
  type: LIST_SUBSCRIPTIONS_SUCCESS,
  payload: { res },
})

export const listSubscriptionsFail = (error, res) => ({
  type: LIST_SUBSCRIPTIONS_FAIL,
  payload: { error, res },
})

export const subscribeRequest = () => ({
  type: SUBSCRIBE_REQUEST,
})

export const subscribeSuccess = (res) => ({
  type: SUBSCRIBE_SUCCESS,
  payload: { res },
})

export const subscribeFail = (error, res) => ({
  type: SUBSCRIBE_FAIL,
  payload: { error, res },
})

export const unsubscribeRequest = () => ({
  type: UNSUBSCRIBE_REQUEST,
})

export const unsubscribeSuccess = (res) => ({
  type: UNSUBSCRIBE_SUCCESS,
  payload: { res },
})

export const unsubscribeFail = (error, res) => ({
  type: UNSUBSCRIBE_FAIL,
  payload: { error, res },
})

export const setSubscriptions = (subscriptions) => ({
  type: SET_SUBSCRIPTIONS,
  payload: { subscriptions },
})

/**
 * Action Creators with Side Effects
 */
export const listProducts = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listProductsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/products`)
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setProducts(data))
      dispatch(listProductsSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listProductsFail(new Error('Fail to fetch products'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listProductsFail(err, res))
    onFail && onFail()
  }
}

export const listSubscriptions = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listSubscriptionsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/subscriptions`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setSubscriptions(data))
      dispatch(listSubscriptionsSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listSubscriptionsFail(new Error('Fail to fetch subscriptions'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listSubscriptionsFail(err, res))
    onFail && onFail()
  }
}

export const subscribe = (orderPlanId, onSuccess, onFail) => async (dispatch, getState) => {
  dispatch(subscribeRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/subscriptions`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_plan_id: orderPlanId })
    })
    if (res.status === 200) {
      const { data } = await res.json()
      const state = getState()
      dispatch(setSubscriptions([...state.product.subscriptions, data]))
      dispatch(subscribeSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(subscribeFail(new Error('Fail to subscribe'), res))
      onFail && onFail(res)
    }
  } catch (err) {
    dispatch(subscribeFail(err, res))
    onFail && onFail(res)
  }
}

export const unsubscribe = (subscriptionId, onSuccess, onFail) => async (dispatch, getState) => {
  dispatch(unsubscribeRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/subscriptions/${subscriptionId}/unsubscribe`, {
      method: 'POST',
      credentials: 'include',
    })
    if (res.status === 200) {
      const state = getState()
      dispatch(setSubscriptions(state.product.subscriptions.filter(s => s.id !== subscriptionId)))
      dispatch(unsubscribeSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(unsubscribeFail(new Error('Fail to unsubscribe'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(unsubscribeFail(err, res))
    onFail && onFail()
  }
}

/**
 * Default State
 */
const defaultState = {
  listProductsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  listSubscriptionsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  subscribeMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  unsubscribeMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  products: [],
  subscriptions: [],
}

/**
 * Selectors
 */
export const selectors = {
  getListProductsMeta(state) {
    return fromJS(state.product)
      .get('listProductsMeta')
      .toJS()
  },
  getProducts(state) {
    return fromJS(state.product)
      .get('products')
      .toJS()
  },
  getListSubscriptionsMeta(state) {
    return fromJS(state.product)
      .get('listSubscriptionsMeta')
      .toJS()
  },
  getSubscriptions(state) {
    return fromJS(state.product)
      .get('subscriptions')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LIST_PRODUCTS_REQUEST:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], true)
        .toJS()
    case LIST_PRODUCTS_SUCCESS:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], false)
        .setIn(['listProductsMeta', 'isRequested'], true)
        .setIn(['listProductsMeta', 'isRequestSuccess'], true)
        .setIn(['listProductsMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_PRODUCTS_FAIL:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], false)
        .setIn(['listProductsMeta', 'isRequested'], true)
        .setIn(['listProductsMeta', 'isRequestSuccess'], false)
        .setIn(['listProductsMeta', 'isRequestFail'], true)
        .toJS()
    case SET_PRODUCTS: {
      const { products } = action.payload
      return fromJS(state)
        .set('products', products.filter(p => p.plans.length > 0))
        .toJS()
    }
    case LIST_SUBSCRIPTIONS_REQUEST:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], true)
        .toJS()
    case LIST_SUBSCRIPTIONS_SUCCESS:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], false)
        .setIn(['listSubscriptionsMeta', 'isRequested'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestSuccess'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_SUBSCRIPTIONS_FAIL:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], false)
        .setIn(['listSubscriptionsMeta', 'isRequested'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestSuccess'], false)
        .setIn(['listSubscriptionsMeta', 'isRequestFail'], true)
        .toJS()
    case SUBSCRIBE_REQUEST:
      return fromJS(state)
        .setIn(['subscribeMeta', 'isRequesting'], true)
        .toJS()
    case SUBSCRIBE_SUCCESS:
      return fromJS(state)
        .setIn(['subscribeMeta', 'isRequesting'], false)
        .setIn(['subscribeMeta', 'isRequested'], true)
        .setIn(['subscribeMeta', 'isRequestSuccess'], true)
        .setIn(['subscribeMeta', 'isRequestFail'], false)
        .toJS()
    case SUBSCRIBE_FAIL:
      return fromJS(state)
        .setIn(['subscribeMeta', 'isRequesting'], false)
        .setIn(['subscribeMeta', 'isRequested'], true)
        .setIn(['subscribeMeta', 'isRequestSuccess'], false)
        .setIn(['subscribeMeta', 'isRequestFail'], true)
        .toJS()
    case UNSUBSCRIBE_REQUEST:
      return fromJS(state)
        .setIn(['unsubscribeMeta', 'isRequesting'], true)
        .toJS()
    case UNSUBSCRIBE_SUCCESS:
      return fromJS(state)
        .setIn(['unsubscribeMeta', 'isRequesting'], false)
        .setIn(['unsubscribeMeta', 'isRequested'], true)
        .setIn(['unsubscribeMeta', 'isRequestSuccess'], true)
        .setIn(['unsubscribeMeta', 'isRequestFail'], false)
        .toJS()
    case UNSUBSCRIBE_FAIL:
      return fromJS(state)
        .setIn(['unsubscribeMeta', 'isRequesting'], false)
        .setIn(['unsubscribeMeta', 'isRequested'], true)
        .setIn(['unsubscribeMeta', 'isRequestSuccess'], false)
        .setIn(['unsubscribeMeta', 'isRequestFail'], true)
        .toJS()
    case SET_SUBSCRIPTIONS: {
      const { subscriptions } = action.payload
      return fromJS(state)
        .set('subscriptions', subscriptions)
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
