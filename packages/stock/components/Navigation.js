import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { useDispatch, useSelector } from 'react-redux'
import { selectors as authSelectors, logout } from '@lation/utils/ducks/auth'
import { i18n, withTranslation, Link } from '../i18n'
import { API_HOST } from '../utils/config'

const Navigation = ({ t }) => {
  const dispatch = useDispatch()
  const isAuth = useSelector(authSelectors.getIsAuth)
  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" style={{ alignItems: 'center'}}>
            <Link href="/" passHref>
              <Navbar.Brand>
                <Image
                  src="/logo.png"
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
              </Navbar.Brand>
            </Link>
            <Link href="/" passHref>
              <Nav.Link>{t('navbar.title')}</Nav.Link>
            </Link>
            <Link href="/product" passHref>
              <Nav.Link>{t('navbar.product')}</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => i18n.changeLanguage('en')}>English</Nav.Link>
            <Nav.Link onClick={() => i18n.changeLanguage('zh-TW')}>中文</Nav.Link>
            {isAuth ? (
              <DropdownButton
                variant="light"
                menuAlign="right"
                title={t('navbar.user.title')}
              >
                <NavDropdown.Item href="/me/subscription">
                  {t('navbar.user.dropdown.subscription')}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logout())}>
                  {t('navbar.user.dropdown.logout')}
                </NavDropdown.Item>
              </DropdownButton>
            ) : (
              <DropdownButton
                variant="light"
                menuAlign="right"
                title={t('navbar.login.title')}
              >
                <NavDropdown.Item href={`${API_HOST}/auth/line`}>
                  <i className="fab fa-line"></i> {t('navbar.login.dropdown.line')}
                </NavDropdown.Item>
                {/* <NavDropdown.Item href={`${API_HOST}/auth/google`}>
                  <i className="fab fa-google"></i> {t('navbar.login.dropdown.google')}
                </NavDropdown.Item> */}
              </DropdownButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

Navigation.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Navigation)
