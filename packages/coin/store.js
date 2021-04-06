import createStoreWrapper from '@lation/utils/createStoreWrapper'
import authReducer from '@lation/utils/ducks/auth'
import orderReducer from '@lation/utils/ducks/order'
import paymentReducer from '@lation/utils/ducks/payment'
import productReducer from '@lation/utils/ducks/product'
import fundingReducer from './ducks/funding'
import reportReducer from './ducks/report'
import userReducer from './ducks/user'

export const wrapper = createStoreWrapper({
  auth: authReducer,
  funding: fundingReducer,
  order: orderReducer,
  payment: paymentReducer,
  product: productReducer,
  report: reportReducer,
  user: userReducer,
})
