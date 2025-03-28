import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthChoice from './AuthChoice';
import CheckoutForm from './CheckoutForm';
import CartTable from './CartTable';
import { apiClient } from '../utils/api';

const STORE_ADDRESS = {
  id: 1,
  name: "Store in Nyon",
  address: "Chemin de Pre-Fleuri, 5",
  city: "Nyon",
  workingHours: "daily 9:00-20:00"
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { cartItems, 
          totalPrice, 
          clearCart,
          addOneToCart,    
          removeFromCart, 
          removeAllFromCart 
        
        } = useContext(CartContext);

  // Checkout flow states
  const [checkoutStep, setCheckoutStep] = useState('initial'); // 'initial', 'form', 'complete'
  const [isGuest, setIsGuest] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  // Data states
  const [railwayStations, setRailwayStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    deliveryType: 'PICKUP',
    street: '',
    house: '',
    apartment: '',
    city: '',
    postalCode: '',
    stationId: '',
    meetingTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    storeId: '1',
    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    paymentMethod: 'TWINT',
    notesClient: ''
  });

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
      setCheckoutStep('form');
      setIsGuest(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await apiClient.get('/railway-stations');
        setRailwayStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error);
        setSubmitError('Failed to load delivery options');
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleAuthChoice = (choice) => {
    if (choice === 'guest') {
      setIsGuest(true);
      setCheckoutStep('form');
    }
  };

  const handleLogin = () => {
    navigate('/login', { state: { returnUrl: '/checkout' } });
  };

  const handleRegister = () => {
    navigate('/register', { state: { returnUrl: '/checkout' } });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'createAccount') {
      setCreateAccount(checked);
      return;
    }

    if ((name === 'meetingTime' || name === 'pickupTime') && value) {
      const selectedDate = new Date(value);
      const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      if (selectedDate < minDate) {
        setFormData(prev => ({
          ...prev,
          [name]: minDate.toISOString().slice(0, 16)
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        deliveryType: formData.deliveryType,
        totalAmount: totalPrice,
        paymentMethod: formData.paymentMethod,
        notesClient: formData.notesClient,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // For guest orders, add customer info
      if (!user) {
        orderData.customer = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        };

        // If guest wants to create account
        if (createAccount && formData.password) {
          orderData.createAccount = true;
          orderData.password = formData.password;
        }
      } else {
        orderData.userId = user.id;
      }

      // Add delivery information based on type
      switch (formData.deliveryType) {
        case 'ADDRESS':
          orderData.addressDelivery = {
            street: formData.street,
            house: formData.house,
            apartment: formData.apartment || null,
            city: formData.city,
            postalCode: formData.postalCode
          };
          break;

        case 'RAILWAY_STATION':
          orderData.stationDelivery = {
            stationId: parseInt(formData.stationId),
            meetingTime: new Date(formData.meetingTime).toISOString()
          };
          break;

        case 'PICKUP':
          orderData.pickupDelivery = {
            storeId: parseInt(formData.storeId),
            pickupTime: new Date(formData.pickupTime).toISOString()
          };
          break;

          default:
            throw new Error(`Invalid delivery type: ${formData.deliveryType}`);
      }

      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await apiClient.post('/orders', orderData, headers);

      // If a new account was created with the order
      if (result.token) {
        await login(result.token);
      }

      setSubmitSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitError(error.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return <Container className="py-5 text-center"><p>Loading...</p></Container>;
  }

  // Render empty cart state
  if (cartItems.length === 0 && !submitSuccess) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
          Return to Shopping
        </Button>
      </Container>
    );
  }

  // Render success state
  if (submitSuccess) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-success mb-4">Order successfully placed!</h2>
        <p>Thank you for your order. We will contact you shortly.</p>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  // Render main checkout form
  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Checkout</h1>

      {/* Show auth choice for non-authenticated users at initial step */}
      {checkoutStep === 'initial' && !user && (
        <div className="max-w-2xl mx-auto mb-4">
          <AuthChoice 
            onChoice={handleAuthChoice}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </div>
      )}

      {/* Show checkout form when appropriate */}
      {checkoutStep === 'form' && (
        <Form onSubmit={handleSubmit}>
          <div className="max-w-3xl mx-auto">
          <CartTable 
              items={cartItems}
              totalPrice={totalPrice}
              onAdd={addOneToCart}
              onRemove={removeFromCart}
              onRemoveAll={removeAllFromCart}
/>

            <CheckoutForm 
              formData={formData}
              handleChange={handleChange}
              deliveryType={formData.deliveryType}
              railwayStations={railwayStations}
              stores={[STORE_ADDRESS]}
              isAuthenticated={!!user}
              isGuest={isGuest}
              createAccount={createAccount}
              onCreateAccountChange={(checked) => setCreateAccount(checked)}
            />

            {submitError && (
              <Alert variant="danger" className="mb-4">
                {submitError}
              </Alert>
            )}

            <div className="d-grid gap-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default CheckoutPage;