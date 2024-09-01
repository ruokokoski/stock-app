import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavigationBar = ({ user, onLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar-padding">
      <Navbar.Brand>Stock-App</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {user && (
            <Nav.Link as="span">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Markets</Link>
            </Nav.Link>
            
          )}
          {user?.admin && (
            <Nav.Link as="span">
              <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link>
            </Nav.Link>
          )}
        </Nav>
        <Nav className="ms-auto">
          {user ? (
            <>
              <Nav.Link as="span">
                <Link to="/change-password" style={{ textDecoration: 'none', color: 'inherit' }}>Change Password</Link>
              </Nav.Link>
              <Nav.Link
                as="span"
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
                style={{ cursor: 'pointer', color: 'inherit' }}
              >
                Logout
              </Nav.Link>
            </>
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