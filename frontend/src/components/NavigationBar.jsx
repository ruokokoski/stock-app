import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavigationBar = ({ user, onLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar-padding">
      <Navbar.Brand>Stock-App</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {user && (
            <>
              <Nav.Link as="span">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Markets</Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link to="/stocks" style={{ textDecoration: 'none', color: 'inherit' }}>Stocks</Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link to="/watchlists" style={{ textDecoration: 'none', color: 'inherit' }}>Watchlist</Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link to="/crypto" style={{ textDecoration: 'none', color: 'inherit' }}>Crypto</Link>
              </Nav.Link>
            </>
          )}
          {user?.admin && (
            <Nav.Link as="span">
              <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link>
            </Nav.Link>
          )}
        </Nav>
        <Nav className="ms-auto">
          {user ? (
            <NavDropdown title={user.name} id="user-dropdown">
              <NavDropdown.Item as={Link} to="/change-password">Change Password</NavDropdown.Item>
              <NavDropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
                style={{ cursor: 'pointer' }}
              >
                Logout
            </NavDropdown.Item>
          </NavDropdown>
          ) : (
            <>
              <Nav.Link as="span">
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Signup</Link>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar