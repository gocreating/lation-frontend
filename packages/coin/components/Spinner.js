import styled from 'styled-components'
import BSSpinner from 'react-bootstrap/Spinner'

const SpinnerWrapper = styled.div`
  padding: 1.5rem;
`

const Spinner = () => (
  <SpinnerWrapper className="text-center">
    <BSSpinner
      animation="border"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </BSSpinner>
  </SpinnerWrapper>
)

export default Spinner
