import React from 'react';
import { Carousel, Container, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  // Custom navigation arrows
  const CustomPrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="carousel-nav-btn prev">
      &#8249;
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button onClick={onClick} className="carousel-nav-btn next">
      &#8250;
    </button>
  );

  return (
    <Container className="my-5">
      <Carousel 
        interval={null} 
        className="about-carousel bg-light rounded shadow"
        prevIcon={<CustomPrevArrow />}
        nextIcon={<CustomNextArrow />}
      >
        {/* Slide 1: Product Benefits */}
        <Carousel.Item>
          <div className="slide-content">
            <h3 className="text-center mb-4">SYRNYK Cheese - A Healthy Choice for the Whole Family</h3>
            <p className="text-center mb-4">
              Thanks to its neutral taste and pleasant texture, it can be used in various dishes - from salads to desserts. 
              It's perfect for breakfast, serves as a hearty snack during the day, or complements your dinner.
            </p>

            <h4 className="mb-3">5 reasons to include SYRNYK cheese in your diet:</h4>
            <ListGroup variant="flush">
              <ListGroup.Item className="about-list-item">
                <strong>Improves digestion: </strong> 
                SYRNYK cheese contains probiotics that promote healthy intestinal microflora.
              </ListGroup.Item>
              <ListGroup.Item className="about-list-item">
                <strong>Rich in proteins and calcium: </strong>
                SYRNYK cheese is an excellent source of proteins and calcium.
              </ListGroup.Item>
              <ListGroup.Item className="about-list-item">
                <strong>Eco-friendly product without additives: </strong>
                Made on a farm in Switzerland according to high quality standards.
              </ListGroup.Item>
              <ListGroup.Item className="about-list-item">
                <strong>Versatility in cooking: </strong>
                Can be used in various dishes from salads to desserts.
              </ListGroup.Item>
              <ListGroup.Item className="about-list-item">
                <strong>Enrichment with Ukrainian recipes: </strong>
                Made according to traditional Ukrainian recipes.
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Carousel.Item>

        {/* Slide 2: Mission and Goals */}
        <Carousel.Item>
          <div className="slide-content">
            <h3 className="text-center mb-4">Our Mission and Goals</h3>
            <Card className="about-card content-section">
              <Card.Body>
                <Card.Text>
                  We created the SYRNYK association with deep love and passion for Ukrainian cuisine. 
                  Our goal is to give you a piece of Ukraine, its unique tastes and aroma that can unite 
                  people even thousands of kilometers from home.
                </Card.Text>
              </Card.Body>
            </Card>

            <h4 className="mb-3">Our Goals:</h4>
            <Row className="g-4">
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Body>
                    <Card.Title>Development of Ukrainian Cuisine</Card.Title>
                    <Card.Text>
                      Promoting traditional Ukrainian dishes and sharing our culinary heritage
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Body>
                    <Card.Title>Cultural Exchange</Card.Title>
                    <Card.Text>
                      Organizing events that promote understanding of Ukrainian culture
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Body>
                    <Card.Title>Supporting Ukrainian Chefs</Card.Title>
                    <Card.Text>
                      Creating a platform for self-realization and professional growth
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Body>
                    <Card.Title>Building Partnerships</Card.Title>
                    <Card.Text>
                      Collaborating with local organizations and businesses
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Carousel.Item>

        {/* Slide 3: Collaboration */}
        <Carousel.Item>
          <div className="slide-content">
            <h3 className="text-center mb-4">Join Our Community</h3>
            <Card className="about-card content-section">
              <Card.Body>
                <Card.Text>
                  SYRNYK Association sincerely invites chefs, restaurateurs, and cheese makers to collaborate. 
                  We believe that together we can make a significant contribution to the development and 
                  promotion of Ukrainian cuisine in Switzerland.
                </Card.Text>
              </Card.Body>
            </Card>

            <Row className="g-4">
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Header>What we offer</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="about-list-item">Platform for self-realization</ListGroup.Item>
                    <ListGroup.Item className="about-list-item">Support and development</ListGroup.Item>
                    <ListGroup.Item className="about-list-item">Networking opportunities</ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="about-card h-100">
                  <Card.Header>Why it matters</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="about-list-item">Promotion of Ukrainian cuisine</ListGroup.Item>
                    <ListGroup.Item className="about-list-item">Cultural exchange</ListGroup.Item>
                    <ListGroup.Item className="about-list-item">Development opportunities</ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </div>
        </Carousel.Item>

        {/* Slide 4: Our Story */}
        <Carousel.Item>
          <div className="slide-content">
            <h3 className="text-center mb-4">Our Story</h3>
            <Card className="about-card">
              <Card.Body>
                <Card.Text>
                  My name is Iryna Piskova, I'm from Ukraine. I love cooking and family traditions: 
                  gatherings, shared laughter, celebrations! When I came to Switzerland, a country of 
                  cheese expertise, I decided to make cheese! But this is Ukrainian fresh cheese.
                </Card.Text>
                <Card.Text>
                  We are also great cheese lovers, and our recipes add even more variety to the art 
                  of cheese. Our recipes are marked by warmth and hospitality, adding a special charm 
                  to Ukrainian culinary tradition.
                </Card.Text>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Link to="/" className="btn btn-primary">
                Order Now
              </Link>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default AboutUs;