import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Eye, UserX, UserCheck } from 'lucide-react';
import { apiClient } from '../../../utils/api';

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState({ customer: null, newStatus: false });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      // Используем путь из userRoutes, а не adminRoutes
      const response = await apiClient.get('/users/admin/users', headers);
  
      if (Array.isArray(response)) {
        setCustomers(response);
      } else if (response && Array.isArray(response.users)) {
        setCustomers(response.users);
      } else {
        console.error('Unexpected data format:', response);
        setError('Invalid data format from server');
        setCustomers([]);
      }
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Authorization required. Please log in again.');
      } else {
        setError('Error loading customers');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleShowStatusModal = (customer, newStatus) => {
    setStatusAction({ customer, newStatus });
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      // Используем PATCH метод как определено в userRoutes
      await apiClient.patch(
        `/users/admin/users/${statusAction.customer.id}/status`, 
        { isActive: statusAction.newStatus },
        headers
      );
      
      setShowStatusModal(false);
      fetchCustomers();
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Authorization required. Please log in again.');
      } else {
        setError('Error changing user status');
      }
      console.error(err);
    }
  };

  if (loading && !customers.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Customers management</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {customers.length === 0 && !loading ? (
        <Alert variant="info">Client not found</Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Date registration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{`${customer.firstName} ${customer.lastName}`}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || 'Not provided'}</td>
                <td>
                  <Badge bg={customer.isActive ? 'success' : 'danger'}>
                    {customer.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                </td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleShowDetails(customer)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant={customer.isActive ? "outline-danger" : "outline-success"}
                      size="sm"
                      onClick={() => handleShowStatusModal(customer, !customer.isActive)}
                    >
                      {customer.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal with client's detailes */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Client's detailes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Fill name</Form.Label>
                <Form.Control 
                  readOnly 
                  value={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control readOnly value={selectedCustomer.email} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control readOnly value={selectedCustomer.phone || 'Не вказано'} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Default delivery</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedCustomer.preferredDeliveryLocation || 'Не вказано'} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data of registration</Form.Label>
                <Form.Control 
                  readOnly 
                  value={new Date(selectedCustomer.createdAt).toLocaleString()} 
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal conformation of status change */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statusAction.customer && (
            <p>
              Do you want to {statusAction.newStatus ? 'activate' : 'deactivate'} client{' '}
              <strong>{statusAction.customer.firstName} {statusAction.customer.lastName}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant={statusAction.newStatus ? "success" : "danger"}
            onClick={handleStatusChange}
          >
            {statusAction.newStatus ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomersPanel;