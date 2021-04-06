import createStoreWrapper from '@lation/utils/createStoreWrapper'
import authReducer from '@lation/utils/ducks/auth'
import orderReducer from '@lation/utils/ducks/order'
import paymentReducer from '@lation/utils/ducks/payment'
import productReducer from '@lation/utils/ducks/product'
import socialReducer from '@lation/utils/ducks/social'

export const wrapper = createStoreWrapper({
  auth: authReducer,
  order: orderReducer,
  payment: paymentReducer,
  product: productReducer,
  social: socialReducer,
})
