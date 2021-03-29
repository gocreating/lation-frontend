import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { encode, decode } from 'js-base64'
import { withTranslation } from '../../i18n'

const Base64Converter = ({ t }) => {
  const [text, setText] = useState('')
  const [base64, setBase64] = useState('')
  return (
    <Form>
      <Form.Group controlId="rawContent">
        <Form.Label>{t('base64.decoded')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          onChange={(e) => {
            setText(e.target.value)
            try {
              setBase64(encode(e.target.value))
            } catch {
              setBase64('')
            }
          }}
          value={text}
          placeholder={t('base64.placeholder')}
        />
      </Form.Group>
      <Form.Group controlId="base64Content">
        <Form.Label>{t('base64.encoded')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          onChange={(e) => {
            setBase64(e.target.value)
            try {
              setText(decode(e.target.value))
            } catch {
              setText('')
            }
          }}
          value={base64}
          placeholder={t('base64.placeholder')}
        />
      </Form.Group>
    </Form>
  )
}

Base64Converter.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Base64Converter)