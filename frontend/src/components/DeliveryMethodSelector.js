import React from 'react';
import { Package, Truck, Train } from 'lucide-react';
import { Row, Col, Button } from 'react-bootstrap';

const DeliveryMethodSelector = ({ selectedMethod, onChange }) => {
  const deliveryMethods = [
    {
      id: 'PICKUP',
      icon: <Package size={24} />,
      title: 'Pickup',
      description: 'From our store in Nyon'
    },
    {
      id: 'ADDRESS',
      icon: <Truck size={24} />,
      title: 'Home Delivery',
      description: 'We will deliver to your address'
    },
    {
      id: 'RAILWAY_STATION',
      icon: <Train size={24} />,
      title: 'Railway Station Delivery',
      description: 'We will meet you at the station'
    }
  ];

  const handleSelect = (methodId) => {
    onChange({ target: { name: 'deliveryType', value: methodId } });
  };

  return (
    <Row className="g-3">
      {deliveryMethods.map((method) => (
        <Col md={4} key={method.id}>
          <Button
            variant={selectedMethod === method.id ? "primary" : "outline-primary"}
            onClick={() => handleSelect(method.id)}
            className="w-100 h-100 d-flex flex-column align-items-center p-3 gap-2"
          >
            <div className="icon-wrapper">
              {method.icon}
            </div>
            <div className="fw-medium">{method.title}</div>
            <small className={selectedMethod === method.id ? "text-light" : "text-muted"}>
              {method.description}
            </small>
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default DeliveryMethodSelector;