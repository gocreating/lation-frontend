import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { event } from '../utils/gtag'

const Products = ({ t, style }) => {
  return (
    <Container style={style}>
      <h2>{t('products.title')}</h2>
      <hr />
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src="/static/images/product-converter.png" />
            <Card.Body>
              <Card.Title>
                {t('products.converter.title')}
              </Card.Title>
              <Card.Text>
                {t('products.converter.description')}
              </Card.Text>
              <a href="https://converter.lation.app/" target="_blank">
                <Button
                  variant="secondary"
                  size="lg"
                  style={{ minWidth: '2rem' }}
                  onClick={() => event({ action: 'click converter' })}
                >
                  {t('visit')}{' '}<i className="fas fa-external-link-alt" />
                </Button>
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
        <Card>
          <Card.Img variant="top" src="/static/images/product-stock.png" />
            <Card.Body>
              <Card.Title>
                {t('products.stock.title')}
              </Card.Title>
              <Card.Text>
                {t('products.stock.description')}
              </Card.Text>
              <a href="https://stock.lation.app/" target="_blank">
                <Button
                  variant="secondary"
                  size="lg"
                  style={{ minWidth: '2rem' }}
                  onClick={() => event({ action: 'click stock' })}
                >
                  {t('visit')}{' '}<i className="fas fa-external-link-alt" />
                </Button>
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Products
