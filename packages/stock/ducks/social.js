import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const GET_LINE_FRIENDSHIP_REQUEST = 'GET_LINE_FRIENDSHIP_REQUEST'
const GET_LINE_FRIENDSHIP_SUCCESS = 'GET_LINE_FRIENDSHIP_SUCCESS'
const GET_LINE_FRIENDSHIP_FAIL = 'GET_LINE_FRIENDSHIP_FAIL'

const SET_LINE_FRIENDSHIP = 'SET_LINE_FRIENDSHIP'

/**
 * Action Creators
 */
export const getLineFriendshipRequest = () => ({
  type: GET_LINE_FRIENDSHIP_REQUEST,
})

export const getLineFriendshipSuccess = (res) => ({
  type: GET_LINE_FRIENDSHIP_SUCCESS,
  payload: { res },
})

export const getLineFriendshipFail = (error, res) => ({
  type: GET_LINE_FRIENDSHIP_FAIL,
  payload: { error, res },
})

export const setLineFriendship = (lineFriendship) => ({
  type: SET_LINE_FRIENDSHIP,
  payload: { lineFriendship },
})

/**
 * Action Creators with Side Effects
 */
export const getLineFriendship = (onSuccess, onFail) => async (dispatch) => {
  dispatch(getLineFriendshipRequest());
  let res
  try {
    res = await fetch(`${API_HOST}/line/friendship`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setLineFriendship(data))
      dispatch(getLineFriendshipSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(getLineFriendshipFail(new Error('Fail to fetch line friendship'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(getLineFriendshipFail(err, res))
    onFail && onFail()
  }
}

/**
 * Default State
 */
const defaultState = {
  getLineFriendshipMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  line: {
    isFriend: false,
  },
}

/**
 * Selectors
 */
export const selectors = {
  getLineIsFriend(state) {
    return fromJS(state.social)
      .getIn(['line', 'isFriend'])
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_LINE_FRIENDSHIP_REQUEST:
      return fromJS(state)
        .setIn(['getLineFriendshipMeta', 'isRequesting'], true)
        .toJS()
    case GET_LINE_FRIENDSHIP_SUCCESS:
      return fromJS(state)
        .setIn(['getLineFriendshipMeta', 'isRequesting'], false)
        .setIn(['getLineFriendshipMeta', 'isRequested'], true)
        .setIn(['getLineFriendshipMeta', 'isRequestSuccess'], true)
        .setIn(['getLineFriendshipMeta', 'isRequestFail'], false)
        .toJS()
    case GET_LINE_FRIENDSHIP_FAIL:
      return fromJS(state)
        .setIn(['getLineFriendshipMeta', 'isRequesting'], false)
        .setIn(['getLineFriendshipMeta', 'isRequested'], true)
        .setIn(['getLineFriendshipMeta', 'isRequestSuccess'], false)
        .setIn(['getLineFriendshipMeta', 'isRequestFail'], true)
        .toJS()
    case SET_LINE_FRIENDSHIP: {
      const { lineFriendship } = action.payload
      return fromJS(state)
        .setIn(['line', 'isFriend'], lineFriendship.is_friend)
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
