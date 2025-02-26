import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { libraryServices } from "../../models/LibraryServiceData";

const LibraryServices: React.FC = () => {
  const handleClick = (content: string) => {
    const newWindow = window.open("", "_blank", "width=400,height=300");
    if (newWindow) {
      newWindow.document.write(`<p>${content}</p>`);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="g-4">
        {libraryServices.map((service, index) => (
          <Col md={6} key={index}>
            <Card className="p-3">
              <Row className="align-items-center">
                {/* image */}
                <Col xs={4}>
                  <Card.Img src={service.image} alt={service.title} className="img-fluid" />
                </Col>

                {/* texte */}
                <Col xs={8}>
                  <Card.Body>
                    <Card.Title className="fw-bold">{service.title}</Card.Title>
                    <ul className="list-unstyled">
                      {service.links.map((link, idx) => (
                        <li key={idx}>
                          <Button variant="link" onClick={() => handleClick(link.content)}>
                            {link.text}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LibraryServices;