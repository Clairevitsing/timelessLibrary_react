import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer mt-5">
      <div className="container">
        <div className="row fw-lighter">
          <div className="col-sm-12 col-md-6">
            <h6>Timeless Library</h6>
            <p className="text-justify fw-lighter">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum saepe quidem optio placeat deserunt quaerat. Tempora minus animi corporis harum, quidem odit atque ipsum dolor unde? Quo incidunt obcaecati aperiam.</p>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Navigation</h6>
            <ul className="footer-links">
              <li><Link to="/books">Book</Link></li>
              <li><Link to="/category">Category</Link></li>
              <li><Link to="/authors">Authors</Link></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Links</h6>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text fw-lighter"> Extend into the world of books and contribute powerfully to the advancement of world culture.| © 2024<strong> TimelessLibrary</strong>
            </p>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <ul className="social-icons">
              <li><a className="twitter" href="https://twitter.com/vitsingz" target="_blank" rel="noopener noreferrer"><Twitter size={16} /></a></li>
              <li><a className="github" href="https://github.com/Clairevitsing" target="_blank" rel="noopener noreferrer"><Github size={16} /></a></li>
              <li><a className="linkedin" href="https://www.linkedin.com/in/claire-weiqing-zhao-868b4982/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;