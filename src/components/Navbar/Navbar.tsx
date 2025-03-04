import React, { useEffect, useState } from 'react';
import { Navbar, Nav,  Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; 
import logo from '../../assets/logo.png';
import './Navbar.css';

const NavbarComponent: React.FC = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartBookIds } = useSelector((state: any) => state.cart || { cartBookIds: [] });

  const [username, setUsername] = useState<string>("Utilisateur");

  useEffect(() => {
    console.log("Current User State:", user);

    if (user?.userName) {
      setUsername(user.userName);
    } else {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const extractedUsername = decodedToken.userId || decodedToken.userName || decodedToken.username || decodedToken.name || decodedToken.sub || decodedToken.email;
          setUsername(extractedUsername ?? "Utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, [user]);

  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Timeless Library Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
          Timeless Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/books">Books</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
            {/* <NavDropdown title="Category" id="basic-nav-dropdown">
              {["voluptaten", "evenist", "porro", "vel", "ethh", "police"].map((category) => (
                <NavDropdown.Item as={Link} to={`/category/${category}`} key={category}>
                  {category}
                </NavDropdown.Item>
              ))}
            </NavDropdown> */}
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn() ? (
              <>
                <Nav.Link as={Link} to="/logout" className="btn btn-outline-danger" onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Logout
                </Nav.Link>
                <span className="navbar-text ms-2">
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Welcome, {username}
                </span>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-success">
                <FontAwesomeIcon icon={faSignInAlt} className="me-1" /> Login
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/cart" className={`ms-3 ${window.location.pathname === '/cart' ? 'selected' : ''}`}>
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              Cart ({cartBookIds?.length || 0})
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
