import createStoreWrapper from '@lation/utils/createStoreWrapper'
import authReducer from '@lation/utils/ducks/auth'
import fundingReducer from './ducks/funding'
import orderReducer from './ducks/order'
import productReducer from './ducks/product'
import reportReducer from './ducks/report'
import userReducer from './ducks/user'

export const wrapper = createStoreWrapper({
  auth: authReducer,
  funding: fundingReducer,
  order: orderReducer,
  product: productReducer,
  report: reportReducer,
  user: userReducer,
})
