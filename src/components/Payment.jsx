import React, { useState } from 'react';
import { API_BASE_URL } from '../api';
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Get cart items from backend
  const cartResponse = await fetch(`${API_BASE_URL}/api/cart`);
    const cartData = await cartResponse.json();
    
    if (!cartData.success || cartData.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = cartData.total + 5 + (cartData.total * 0.1); // Add shipping and tax
    
  const paymentResponse = await fetch(`${API_BASE_URL}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: cartData.cart,
        total: total,
        paymentMethod: paymentMethod,
        shippingInfo: formData
      })
    });
    
    const paymentData = await paymentResponse.json();
    
    if (paymentData.success) {
      alert(`Order placed successfully! Order ID: ${paymentData.orderId}`);
      // Redirect to order confirmation page
    } else {
      alert('Payment failed. Please try again.');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment processing error. Please try again.');
  }
};
const Payment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
const handlePayment = async (paymentData) => {
  try {
  const response = await fetch(`${API_BASE_URL}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems,
        total,
        paymentMethod: paymentData
      })
    });
    const data = await response.json();
    if (data.success) {
      // Clear cart and show success
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
  const steps = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Review' }
  ];

// Inside your Payment component
const handleExpiryChange = (e) => {
  let val = e.target.value;

  // Keep only numbers and '/'
  val = val.replace(/[^0-9/]/g, '');

  // Auto-add '/' after typing 2 digits (MM)
  if (val.length === 2 && !val.includes('/')) {
    val = val + '/';
  }

  // Trim length to max 5 (MM/YY)
  if (val.length > 5) val = val.slice(0, 5);

  setFormData(prev => ({ ...prev, expiryDate: val }));

  // Real-time validation
  const regex = /^(\d{0,2})(\/?)(\d{0,2})$/;
  const match = val.match(regex);

  if (!match) {
    alert('Invalid characters! Please enter in MM/YY format.');
    return;
  }

  const [_, mm, slash, yy] = match;

  // Validate month as soon as it's typed (1–12 only)
  if (mm.length === 2) {
    const month = parseInt(mm, 10);
    if (month < 1 || month > 12) {
      alert('Invalid month! Please enter between 01 and 12.');
      return;
    }
  }

  // Validate year when both parts are present
  if (mm.length === 2 && yy.length === 2 && slash === '/') {
    const year = parseInt(yy, 10);
    const currentYear = new Date().getFullYear() % 100;
    const month = parseInt(mm, 10);
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      alert('Card has expired.');
      return;
    }
  }
};



  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for your purchase.');
  };

  const renderShippingStep = () => (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Shipping Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleInputChange}
          required
          style={{ gridColumn: '1 / -1', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem' }}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          name="zipCode"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
          style={{
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
          required
          style={{ gridColumn: '1 / -1', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem' }}
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Payment Method</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <label style={{
          border: `2px solid ${paymentMethod === 'card' ? '#e91e63' : '#e0e0e0'}`,
          padding: '1rem',
          borderRadius: '10px',
          cursor: 'pointer',
          textAlign: 'center',
          background: paymentMethod === 'card' ? '#f9f9f9' : 'white'
        }}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            style={{ display: 'none' }}
          />
          💳 Credit Card
        </label>
        
        <label style={{
          border: `2px solid ${paymentMethod === 'paypal' ? '#e91e63' : '#e0e0e0'}`,
          padding: '1rem',
          borderRadius: '10px',
          cursor: 'pointer',
          textAlign: 'center',
          background: paymentMethod === 'paypal' ? '#f9f9f9' : 'white'
        }}>
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
            style={{ display: 'none' }}
          />
          📱 PayPal
        </label>
      </div>

      {paymentMethod === 'card' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            style={{
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleInputChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on Card"
            value={formData.nameOnCard}
            onChange={handleInputChange}
            required
            style={{
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          />
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Order Review</h2>
      
      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Subtotal (3 items):</span>
          <span>$47.97</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Shipping:</span>
          <span>$5.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Tax:</span>
          <span>$4.80</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: '#e91e63' }}>
          <span>Total:</span>
          <span>$57.77</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Shipping Address</h3>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.address}</p>
        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
        <p>{formData.country}</p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Payment Method</h3>
        <p>{paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}</p>
        {paymentMethod === 'card' && formData.cardNumber && (
          <p>Card ending in {formData.cardNumber.slice(-4)}</p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        color: '#e91e63', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontFamily: 'Georgia, serif',
        textAlign: 'center'
      }}>
        Checkout
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: 0,
          right: 0,
          height: '2px',
          background: '#e0e0e0',
          zIndex: 1
        }}></div>
        {steps.map((step, index) => (
          <div key={step.number} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentStep >= step.number ? '#e91e63' : '#e0e0e0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {step.number}
            </div>
            <span style={{
              fontSize: '0.9rem',
              color: currentStep >= step.number ? '#e91e63' : '#666',
              fontWeight: currentStep >= step.number ? 'bold' : 'normal'
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderShippingStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} style={{
              background: '#666',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} style={{
              background: '#e91e63',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginLeft: 'auto'
            }}>
              Next
            </button>
          ) : (
            <button type="submit" style={{
              background: '#4caf50',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              width: '100%'
            }}>
              Confirm Order
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Payment;
