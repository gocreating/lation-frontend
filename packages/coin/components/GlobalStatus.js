import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUser } from '@lation/utils/ducks/auth'

const GlobalStatus = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  return null
}

export default GlobalStatus
