import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Linkedin, EnvelopeFill } from "react-bootstrap-icons";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer  className="footer">
      <Container className="footer-container">
        <Row className="justify-content-center">
          {/* Community Section */}
          <Col md={4} className="d-flex">
            <div className="footer-card p-3 border rounded shadow-sm w-100 d-flex flex-column align-items-center">
              <h5 className="fw-bold text-center">Community</h5>
              <div className="text-start">
                <p className="mb-1">Community search</p>
                <p>Community Borrowing</p>
              </div>
            </div>
          </Col>

          {/* About Section */}
          <Col md={4} className="d-flex">
            <div className="footer-card p-3 border rounded shadow-sm w-100 d-flex flex-column align-items-center">
              <h5 className="fw-bold text-center">About</h5>
              <div className="text-start">
                <p className="mb-1">Opening hours</p>
                <p className="mb-1">Rooms and facilities</p>
                <p className="mb-1">Special collections</p>
                <p className="mb-1">What we do</p>
                <p className="mb-1">Library policies and guidelines</p>
                <p>Employment at TimelessLibrary</p>
              </div>
            </div>
          </Col>

          {/* Need Help Section */}
          <Col md={4} className="d-flex">
            <div className="footer-card p-3 border rounded shadow-sm  w-100 d-flex flex-column align-items-center">
              <h5 className="fw-bold text-center">Need help?</h5>
              <div className="text-start mb-2">
                <p className="mb-1">Get in touch</p>
                <p className="mb-1">Contact us</p>
                </div>
                <div className="d-flex justify-content-center gap-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={24} />
                </a>
                <a href="mailto:contact@library.com">
                    <EnvelopeFill size={24} />
                </a>
                </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

