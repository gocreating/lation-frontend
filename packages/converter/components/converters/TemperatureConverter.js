import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { withTranslation } from '../../i18n'

const TemperatureConverter = ({ t }) => {
  const [celsius, setCelsius] = useState()
  const [fahrenheit, setFahrenheit] = useState()
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} sm={8} md={6}>
          <Form.Label>{t('temperature.celsius')}</Form.Label>
          <InputGroup>
            <FormControl
              size="lg"
              type="number"
              step={0.1}
              value={celsius}
              onChange={(e) => {
                setCelsius(e.target.value)
                setFahrenheit((e.target.value * 9 / 5 ) + 32)
              }}
            />
            <InputGroup.Append>
              <InputGroup.Text>°C</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} sm={8} md={6}>
          <Form.Label>{t('temperature.fahrenheit')}</Form.Label>
          <InputGroup>
            <Form.Control
              size="lg"
              type="number"
              step={0.1}
              value={fahrenheit}
              onChange={(e) => {
                setFahrenheit(e.target.value)
                setCelsius((e.target.value - 32) * 5 / 9)
              }}
            />
            <InputGroup.Append>
              <InputGroup.Text>°F</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

TemperatureConverter.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(TemperatureConverter)