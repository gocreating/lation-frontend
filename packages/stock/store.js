import createStoreWrapper from '@lation/utils/createStoreWrapper'
import authReducer from '@lation/utils/ducks/auth'
import productReducer from './ducks/product'
import socialReducer from './ducks/social'

export const wrapper = createStoreWrapper({
  auth: authReducer,
  product: productReducer,
  social: socialReducer,
})
