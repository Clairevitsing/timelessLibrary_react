import React from 'react'
import { Link } from 'react-router-dom'; 
import './Navbar.css';
import logo from '../../Assets/logo.png';


const Navbar = () => {
  return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
          <div className="container">
            <div className="nav-logo">
            <img src={logo} alt="Timeless Library Logo" className="img-fluid" style={{maxWidth: '100px'}} />
            <Link className="navbar-brand fx-bold fs-4" to="/">
              Timeless Library
            </Link>
          </div>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item px-2">
                  <Link className="nav-link active" aria-current="page" to="/"> 
                  Home
                </Link>
                </li>
                <li className="nav-item px-2">
                <Link className="nav-link" to="/book"> 
                  Books
                </Link>
                </li>
                <li className="nav-item dropdown px-2">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Category
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/category/voluptaten">voluptaten</Link></li>
                    <li><Link className="dropdown-item" to="/category/evenist">evenist</Link></li>
                    <li><Link className="dropdown-item" to="/category/porro">porro</Link></li>
                    <li><Link className="dropdown-item" to="/category/vel">vel</Link></li>
                    <li><Link className="dropdown-item" to="/category/ethh">ethh</Link></li>
                    <li><Link className="dropdown-item" to="/category/police">Police</Link></li>
                  </ul>
                </li>
                <li className="nav-item px-2">
                  <a className="nav-link" href="#">Contact</a>
                </li>
                <form className="d-flex" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                  <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
              </ul>
              <div className="buttons">
                <a href="" className="btn btn-outline-success">
                  <i  className="fa fa-sign-in me-1"></i>Login</a>
                {/* <a href="" className="btn btn-outline-success ms-2">
                  <i  className="fa fa-user-plus me-1"></i>Register</a> */}
                <a href="" className="btn btn-outline-success ms-2">
                  <i  className="fa fa-shooping-cart me-1"></i>Cart (0) </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
  )
}

export default Navbar;
