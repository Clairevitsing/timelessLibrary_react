import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';

const NavbarComponent: React.FC = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartBookIds } = useSelector((state: any) => state.cart || { cartBookIds: [] });
  const [username, setUsername] = useState<string>("Utilisateur");
  
  useEffect(() => {
    // console.log("Current User State:", user);
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
  
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 10) {
        navbar?.classList.add(styles.shadowScrolled);
      } else {
        navbar?.classList.remove(styles.shadowScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar bg="light" expand="lg" className={`py-3 ${styles.navbarContainer}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.navbarBrand}>
          <img src={logo} alt="Timeless Library Logo" className={`img-fluid ${styles.brandLogo}`} />
          Timeless Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`mx-auto ${styles.navLinks}`}>
            <Nav.Link as={Link} to="/" className={styles.navLink}>Home</Nav.Link>
            <Nav.Link as={Link} to="/books" className={styles.navLink}>Books</Nav.Link>
            <Nav.Link as={Link} to="/categories" className={styles.navLink}>Categories</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={styles.navLink}>Contact</Nav.Link>
          </Nav>
          <Nav className={styles.navActions}>
            {isLoggedIn() ? (
              <>
                <Nav.Link as={Link} to="/logout" className={`btn ${styles.logoutButton}`} onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} /> Logout
                </Nav.Link>
                <span className={styles.userWelcome}>
                  <FontAwesomeIcon icon={faUser} className={styles.icon} /> Welcome, {username}
                </span>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className={`btn ${styles.loginButton}`}>
                <FontAwesomeIcon icon={faSignInAlt} className={styles.icon} /> Login
              </Nav.Link>
            )}
            <Nav.Link 
              as={Link} 
              to="/cart" 
              className={`${styles.cartLink} ${window.location.pathname === '/cart' ? styles.cartLinkSelected : ''}`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className={styles.icon} /> Cart 
              <span className={styles.cartCount}>({cartBookIds?.length || 0})</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;