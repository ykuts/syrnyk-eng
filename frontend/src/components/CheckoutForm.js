import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import DeliveryMethodSelector from './DeliveryMethodSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
//import StationSelector from './StationSelector';

const CheckoutForm = ({ formData, handleChange, deliveryType, railwayStations, stores, isAuthenticated }) => {
  const renderDeliveryFields = () => {
    switch (deliveryType) {
      case 'ADDRESS':
        return (
          <div className="delivery-details mt-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Delivery Address</h5>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="house"
                        placeholder="House"
                        value={formData.house}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="apartment"
                        placeholder="Apartment (optional)"
                        value={formData.apartment}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        );

      case 'RAILWAY_STATION':
        return (
          <div className="delivery-details mt-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Select Station</h5>
                <Form.Group className="mb-4">
                  <Form.Select
                    name="stationId"
                    value={formData.stationId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a station</option>
                    {railwayStations.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.city} - {station.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {formData.stationId && (
                  <div className="mt-4">
                    <Card className="bg-light">
                      <Card.Body>
                        {railwayStations.find(s => s.id === parseInt(formData.stationId))?.photo && (
                          <img
                            src={`${process.env.REACT_APP_API_URL}${railwayStations.find(s => s.id === parseInt(formData.stationId)).photo}`}
                            alt="Meeting Point"
                            className="img-fluid rounded mb-3 w-100"
                          />
                        )}
                        <div className="mb-3">
                          <strong>Meeting Point:</strong>
                          <p className="mb-0 mt-1">
                            {railwayStations.find(s => s.id === parseInt(formData.stationId))?.meetingPoint}
                          </p>
                        </div>

                        <Form.Group>
                          <Form.Label className="fw-medium">Select Meeting Time</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="meetingTime"
                            value={formData.meetingTime}
                            onChange={handleChange}
                            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                            required
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        );

      case 'PICKUP':
        return (
          <div className="delivery-details mt-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Pickup Details</h5>
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="mb-2">{stores[0].name}</h6>
                  <p className="mb-2">{stores[0].address}, {stores[0].city}</p>
                  <p className="mb-2"><strong>Working Hours:</strong> {stores[0].workingHours}</p>
                  {stores[0].phone && (
                    <p className="mb-0"><strong>Phone:</strong> {stores[0].phone}</p>
                  )}
                </div>

                <Form.Group>
                  <Form.Label className="fw-medium">Select Pickup Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="checkout-form">
      <section className="mb-5">
        <h4 className="mb-3">Personal Information</h4>
        <Card>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    readOnly={isAuthenticated}
                    className={isAuthenticated ? 'bg-light' : ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    readOnly={isAuthenticated}
                    className={isAuthenticated ? 'bg-light' : ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={isAuthenticated}
                className={isAuthenticated ? 'bg-light' : ''}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                readOnly={isAuthenticated}
                className={isAuthenticated ? 'bg-light' : ''}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      </section>
      {isAuthenticated && (
        <Form.Text className="text-muted">
          To change personal information, please go to profile settings
        </Form.Text>
      )}

      <section className="mb-5">
        <h4 className="mb-3">Delivery Method</h4>
        <DeliveryMethodSelector
          selectedMethod={formData.deliveryType}
          onChange={handleChange}
        />
        {renderDeliveryFields()}
      </section>

      <section className="mb-5">
        <h4 className="mb-3">Payment Method</h4>
        <PaymentMethodSelector
          selectedMethod={formData.paymentMethod}
          onChange={handleChange}
        />
      </section>

      <section className="mb-5">
        <h4 className="mb-3">Order Comments</h4>
        <Card>
          <Card.Body>
            <Form.Control
              as="textarea"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information for the order"
            />
          </Card.Body>
        </Card>
      </section>
    </div>
  );
};

export default CheckoutForm;