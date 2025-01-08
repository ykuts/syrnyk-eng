import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Badge, 
  Spinner, 
  Alert,
  Button,
  Form,
  ListGroup,
  Row,
  Col
} from 'react-bootstrap';
import { apiClient } from '../../../utils/api';

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [adminComments, setAdminComments] = useState({});
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      const [ordersData, productsData] = await Promise.all([
        apiClient.get('/admin/orders', headers),
        apiClient.get('/products', headers)
      ]);
  
      const productsMap = productsData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});
  
      setOrders(ordersData);
      setProducts(productsMap);
      
      const comments = {};
      ordersData.forEach(order => {
        comments[order.id] = order.notesAdmin || '';
      });
      setAdminComments(comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status) => {
    const statusVariants = {
      'PENDING': 'warning',
      'CONFIRMED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return statusVariants[status] || 'secondary';
  };

  const getDeliveryDetails = (order) => {
    switch (order.deliveryType) {
      case 'ADDRESS':
        return order.addressDelivery ? 
          `${order.addressDelivery.city}, ${order.addressDelivery.street} ${order.addressDelivery.house}` :
          'Address not specified';
      case 'RAILWAY_STATION':
        return order.stationDelivery ?
          `Railway Station: ${order.stationDelivery.station?.name}, Time: ${formatDate(order.stationDelivery.meetingTime)}` :
          'Station not specified';
      case 'PICKUP':
        return order.pickupDelivery ?
          `Pickup: ${order.pickupDelivery.store?.name}, Time: ${formatDate(order.pickupDelivery.pickupTime)}` :
          'Store not specified';
      default:
        return 'Delivery type not specified';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      await apiClient.post(`/admin/orders/${orderId}`, { status: newStatus }, headers);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Authorization required. Please log in again.');
      } else {
        setError('Error updating order status');
      }
      console.error(err);
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      await apiClient.post(`/admin/orders/${orderId}/payment-status`, { paymentStatus: newStatus }, headers);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newStatus } : order
      ));
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Authorization required. Please log in again.');
      } else {
        setError('Error updating payment status');
      }
      console.error(err);
    }
  };

  const handleAdminCommentChange = async (orderId, comment) => {
    setAdminComments(prev => ({ ...prev, [orderId]: comment }));
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      await apiClient.post(`/admin/orders/${orderId}/notes`, { notesAdmin: comment }, headers);
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Authorization required. Please log in again.');
      } else {
        setError('Error updating admin notes');
      }
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'ALL' && order.status !== filterStatus) return false;
    if (filterPaymentStatus !== 'ALL' && order.paymentStatus !== filterPaymentStatus) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'date_desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount_asc':
        return Number(a.totalAmount) - Number(b.totalAmount);
      case 'amount_desc':
        return Number(b.totalAmount) - Number(a.totalAmount);
      default:
        return 0;
    }
  });

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Orders</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Order Status</Form.Label>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">New Orders</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DELIVERED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label>Payment Status</Form.Label>
            <Form.Select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Payment</option>
              <option value="PAID">Paid</option>
              <option value="REFUNDED">Refunded</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Price</option>
              <option value="amount_asc">Lowest Price</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <div className="mb-3">
        <p className="text-muted">
          {filteredOrders.length === orders.length 
            ? `Total Orders: ${orders.length}`
            : `Showing ${filteredOrders.length} of ${orders.length} orders`
          }
        </p>
      </div>
      {filteredOrders.map((order) => (
        <Card key={order.id} className="mb-4">
          <Card.Body>
            <Row>
              <Row>
                <Col>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="mb-0">Order #{order.id} from {formatDate(order.createdAt)}</h5>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </Col>
              </Row>
              <Col md={8}>
                <Row className="text-start">
                  <Col md={6}>
                    <p><strong>Customer:</strong> {order.user?.firstName} {order.user?.lastName}</p>
                    <p><strong>Email:</strong> {order.user?.email}</p>
                    <p><strong>Phone:</strong> {order.user?.phone}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Order Amount:</strong> {Number(order.totalAmount).toLocaleString()} CHF</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p>
                      <strong>Payment Status:</strong>{' '}
                      <Badge bg={getStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </p>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <p><strong>Delivery:</strong> {getDeliveryDetails(order)}</p>
                  </Col>
                </Row>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label><strong>Order Status</strong></Form.Label>
                  <Form.Select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="PENDING">New Order</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="DELIVERED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3 text-start">
                  <Form.Label><strong>Payment Status</strong></Form.Label>
                  <Form.Select 
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                  >
                    <option value="PENDING">Pending Payment</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="outline-primary"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-100"
                >
                  {expandedOrder === order.id ? 'Hide Details' : 'Show Details'}
                </Button>
              </Col>
            </Row>

            {expandedOrder === order.id && (
              <div className="mt-4">
                <h6 className="mb-3">Products in Order:</h6>
                <ListGroup className="mb-4">
                  {order.items.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{products[item.productId]?.name || `Product ID: ${item.productId}`}</strong>
                        {products[item.productId]?.description && (
                          <p className="text-muted mb-0 small">{products[item.productId].description}</p>
                        )}
                      </div>
                      <div className="text-end">
                        <div>Quantity: {item.quantity}</div>
                        <div>Price: {Number(item.price).toLocaleString()} CHF</div>
                        <div className="text-muted small">
                          Total: {(Number(item.price) * item.quantity).toLocaleString()} CHF
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Form.Group className="mb-3">
                  <Form.Label>Admin Comment:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={adminComments[order.id] || ''}
                    onChange={(e) => handleAdminCommentChange(order.id, e.target.value)}
                    placeholder="Add a comment..."
                  />
                </Form.Group>

                {order.trackingNumber && (
                  <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default OrdersPanel;