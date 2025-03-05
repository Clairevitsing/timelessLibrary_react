import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Linkedin, EnvelopeFill } from "react-bootstrap-icons";
import styles from "./Footer.module.css";

// Footer component for the website
const Footer: React.FC = () => {
  return (
    <div className={styles.footerWrapper}> {/* Ensures the background color spans the full width */}
      <footer className={styles.footer}>
        <Container fluid className={styles.footerContainer}> {/* Keeps the content centered while allowing full-width background */}
          <Row className="justify-content-center">
            
            {/* Community Section */}
            <Col md={4} className="d-flex">
              <div className={`${styles.footerCard} w-100 d-flex flex-column align-items-center`}>
                <h5 className={styles.footerTitle}>Community</h5>
                <div className={styles.footerLinks}>
                  <p>Community search</p>
                  <p>Community Borrowing</p>
                </div>
              </div>
            </Col>

            {/* About Section */}
            <Col md={4} className="d-flex">
              <div className={`${styles.footerCard} w-100 d-flex flex-column align-items-center`}>
                <h5 className={styles.footerTitle}>About</h5>
                <div className={styles.footerLinks}>
                  <p>Opening hours</p>
                  <p>Rooms and facilities</p>
                  <p>Special collections</p>
                  <p>What we do</p>
                  <p>Library policies and guidelines</p>
                  <p>Employment at TimelessLibrary</p>
                </div>
              </div>
            </Col>

            {/* Need Help Section */}
            <Col md={4} className="d-flex">
              <div className={`${styles.footerCard} w-100 d-flex flex-column align-items-center`}>
                <h5 className={styles.footerTitle}>Need help?</h5>
                <div className={`${styles.footerLinks} mb-2`}>
                  <p>Get in touch</p>
                  <p>Contact us</p>
                </div>
                {/* Social Media Icons */}
                <div className={styles.footerIcons}>
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
    </div>
  );
};

export default Footer;
