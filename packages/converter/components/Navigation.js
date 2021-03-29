import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { i18n, withTranslation, Link } from '../i18n'

const Navigation = ({ t }) => {
  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav-top" />
        <Navbar.Collapse id="responsive-navbar-nav-top">
          <Nav className="mr-auto">
            <Link href="/" passHref>
              <Navbar.Brand>
                <Image
                  src="/logo.png"
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 16,
                  }}
                />
                {t('navbar.title')}
              </Navbar.Brand>
            </Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => i18n.changeLanguage('en')}>English</Nav.Link>
            <Nav.Link onClick={() => i18n.changeLanguage('zh-TW')}>中文</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" style={{ marginBottom: '2rem' }}>
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav-bottom">
            {t('navbar.toggle.bottom')}
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav-bottom">
            <Nav>
              <Link href="/" passHref>
                <Nav.Link>{t('navbar.common')}</Nav.Link>
              </Link>
              <Link href="/base64" passHref>
                <Nav.Link>{t('navbar.base64')}</Nav.Link>
              </Link>
              <Link href="/temperature" passHref>
                <Nav.Link>{t('navbar.temperature')}</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

Navigation.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Navigation)