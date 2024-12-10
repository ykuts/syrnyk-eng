// components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import { apiClient } from '../utils/api';
import { getImageUrl } from '../config'
import { format } from 'date-fns';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const customHeaders = {
        Authorization: `Bearer ${token}`
      };
      
      // Using apiClient.get with the endpoint and custom headers
      const response = await apiClient.get('/users/orders', customHeaders);
      setOrders(response.orders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: { bg: 'warning', text: 'Processing' },
      CONFIRMED: { bg: 'info', text: 'Confirmed' },
      DELIVERED: { bg: 'success', text: 'Delivered' },
      CANCELLED: { bg: 'danger', text: 'Cancelled' }
    };
    return <Badge bg={variants[status].bg}>{variants[status].text}</Badge>;
  };

  const formatDeliveryInfo = (order) => {
    if (order.addressDelivery) {
      return `Delivery to address: ${order.addressDelivery.street}, ${order.addressDelivery.house}${
        order.addressDelivery.apartment ? `, кв. ${order.addressDelivery.apartment}` : ''
      }, ${order.addressDelivery.city}`;
    } else if (order.stationDelivery) {
      return `Delivery to station: ${order.stationDelivery.station.name}, час: ${
        format(new Date(order.stationDelivery.meetingTime), 'dd.MM.yyyy HH:mm')
      }`;
    } else if (order.pickupDelivery) {
      return `Pickup from: ${order.pickupDelivery.store.name}, час: ${
        format(new Date(order.pickupDelivery.pickupTime), 'dd.MM.yyyy HH:mm')
      }`;
    }
    return 'Delivery method not specified';
  };

  const OrderDetailsModal = ({ order, show, onHide }) => {
    if (!order) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details #{order.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Delivery Information</h5>
                </Card.Header>
                <Card.Body>
                  <p>{formatDeliveryInfo(order)}</p>
                  <p>Статус: {getStatusBadge(order.status)}</p>
                  {order.trackingNumber && (
                    <p>Tracking Number: {order.trackingNumber}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Items</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                  <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.product.image && (
                            <img 
                            // Using getImageUrl utility to get the correct image URL
                            src={getImageUrl(item.product.image, 'product')} 
                            alt={item.product.name} 
                            style={{ width: '50px', marginRight: '10px' }}
                          />
                          )}
                          {item.product.name}
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.price} CHF</td>
                      <td>{(item.quantity * item.price).toFixed(2)} CHF</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                    <td><strong>{order.totalAmount} CHF</strong></td>
                  </tr>
                  {order.discount && (
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
                      <td><strong>-{order.discount} CHF</strong></td>
                    </tr>
                  )}
                </tfoot>
              </Table>
            </Card.Body>
          </Card>

          {order.notesClient && (
            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">Order Notes</h5>
              </Card.Header>
              <Card.Body>
                <p>{order.notesClient}</p>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
          Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (loading) {
    return <Container className="py-4">Loading...</Container>;
  }

  if (error) {
    return <Container className="py-4">Error: {error}</Container>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Order History</h2>

      {orders.length === 0 ? (
        <p>You don't have any orders yet</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Status</th>
              <th>Delivery Method</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{format(new Date(order.createdAt), 'dd.MM.yyyy')}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{order.deliveryType}</td>
                <td>{order.totalAmount} CHF</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        show={showDetails}
        onHide={() => {
          setShowDetails(false);
          setSelectedOrder(null);
        }}
      />
    </Container>
  );
};

export default OrderHistory;