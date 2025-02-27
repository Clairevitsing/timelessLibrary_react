import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; 

const NavbarComponent: React.FC = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartBookIds } = useSelector((state: any) => state.cart || { cartBookIds: [] });
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    console.log("Current User State:", user);
    
    // Récupérer le nom d'utilisateur
    if (user && user.userName) {
      // Si user est un objet avec userName, l'utiliser directement
      setUsername(user.userName);
    } else {
      // Sinon essayer de récupérer à partir du token dans localStorage
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: any = jwtDecode(token); // Utilisation de jwtDecode au lieu de jwt_decode
          // Chercher le nom d'utilisateur dans différents champs possibles du token
          const extractedUsername = decodedToken.userName || 
                                    decodedToken.username || 
                                    decodedToken.name || 
                                    decodedToken.sub || 
                                    decodedToken.email;
          setUsername(extractedUsername || "Utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        setUsername("Utilisateur");
      }
    }
  }, [user]);
  
  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Timeless Library Logo" className="img-fluid" style={{maxWidth: '100px'}} />
          Timeless Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/book">Books</Nav.Link>
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/category/voluptaten">voluptaten</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/evenist">evenist</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/porro">porro</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/vel">vel</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/ethh">ethh</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/police">Police</NavDropdown.Item>
            </NavDropdown>
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
            <Nav.Link
                as={Link}
                to="/cart"
                className={`ms-3 ${window.location.pathname === '/cart' ? 'selected' : ''}`}
              >
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