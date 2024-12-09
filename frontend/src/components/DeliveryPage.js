import { Container, Row, Col  } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { getImageUrl } from '../config';
import "./DeliveryPayment.css";
import "./DeliveryContent.css";
import './MeetingCard.css';

const DeliveryPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await apiClient.get('/api/railway-stations');
        setStations(data.data);
      } catch (err) {
        setError('Error loading station data');
        console.error('Error fetching stations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <Container>
      <div className="delivery-payment">
        <h1 className="page-title">DELIVERY AND PAYMENT</h1>
        <Container>
          <div className="content-sections-container">
            <Row xs={1} md={2} className="g-5">
              <Col>
                <ContentSection
                  title="Payment Methods"
                  content="We offer several convenient payment options for your comfort. Payment upon delivery: You can pay in cash to our courier when receiving your order. Payment to our association's account: You can make a payment via TWINT or using the association's bank details when receiving the order. The details will be sent to you in the order confirmation message. Transparent product pricing, you pay after receiving the order. Choose the most convenient payment method for you, and we will ensure fast and reliable delivery of your order."
                />
              </Col>
              <Col>
                <ContentSection
                  title="Railway Station Delivery"
                  content="We offer free delivery to major railway stations in the canton of Vaud and Geneva (VULLY, GENEVE). Minimum order for free delivery is 20 francs. Delivery days and times are daily from 10:00 to 19:00 (depends on the schedule for each station below)"
                />
              </Col>
              <Col>
                <ContentSection
                  title="Home Delivery"
                  content="We offer our product delivery service to your home or office. Minimum order for home delivery: 100 francs. Deliveries are made daily, except weekends. You will receive delivery confirmation from our operator."
                />
              </Col>
              <Col>
                <ContentSection
                  title="Order Processing"
                  content="After placing your order, you will receive a message that we have started processing it. After verification, we will send you the status of your order confirming it's ready for pickup. We will contact you before the specified delivery time."
                />
              </Col>
            </Row>
          </div>
        </Container>
        
        <div className="meeting-cards">
          {loading ? (
            <div className="loading">Loading stations...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : stations.length === 0 ? (
            <div className="no-stations">No stations found</div>
          ) : (
            Object.entries(
              stations.reduce((acc, station) => {
                if (!acc[station.city]) {
                  acc[station.city] = [];
                }
                acc[station.city].push(station);
                return acc;
              }, {})
            ).map(([city, cityStations]) => (
              <div key={city} className="city-group">
                <div className="city-stations">
                  {cityStations.map(station => (
                    <MeetingCard
                      key={station.id}
                      city={station.city}
                      station={station.name}
                      location={station.meetingPoint}
                      imageSrc={station.photo}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
};

const ContentSection = ({ title, content }) => (
  <div className="content-section">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

const MeetingCard = ({ city, station, location, imageSrc }) => {
  const [imageError, setImageError] = useState(false);
  
  // Get URLs with explicit 'station' type
  const defaultImageUrl = getImageUrl(null, 'station');
  const imageUrl = imageError ? defaultImageUrl : getImageUrl(imageSrc, 'station');
    
  return (
    <div className="meeting-card">
      <div className="meeting-info">
        <div className="city">{`City: ${city}`}</div>
        <div className="station">{`Date/Time: ${station}`}</div>
        <div className="location">Meeting Point:</div>
        <div className="location">{`${location}`}</div>
      </div>
      <div className="meeting-image">
        <img 
          src={imageUrl}
          alt={`Meeting location at ${station}`} 
          onError={(e) => {
            console.log('Failed to load image:', e.target.src);
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
      </div>
    </div>
  );
};

export default DeliveryPage;