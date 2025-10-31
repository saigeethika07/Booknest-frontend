import React, { useState, useEffect } from 'react';
import { API_BASE_URL, authHeaders } from '../api';

const Cart = ({ onProceedToCheckout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, { headers: { ...authHeaders() } });
      const data = await response.json();
      if (data.success) {
        // Transform backend cart format to frontend format
        const transformedCart = data.cart.map(item => ({
          id: item.bookId,
          title: item.book.title,
          author: item.book.author,
          price: item.book.price,
          image: item.book.image,
          quantity: item.quantity
        }));
        setCartItems(transformedCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) {
      onRemoveItem(bookId);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ bookId, quantity: newQuantity })
      });
      const data = await response.json();
      if (data.success) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const onRemoveItem = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${bookId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#e91e63', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          fontFamily: 'Georgia, serif'
        }}>
          Shopping Cart
        </h1>
        <div>Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          color: '#e91e63', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          fontFamily: 'Georgia, serif'
        }}>
          Shopping Cart
        </h1>
        <div style={{
          background: 'white',
          padding: '4rem 2rem',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#666', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: '#999', marginBottom: '2rem' }}>Add some books to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        color: '#e91e63', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontFamily: 'Georgia, serif'
      }}>
        Shopping Cart ({getTotalItems()} items)
      </h1>
      
      {cartItems.map(item => (
        <div key={item.id} style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <img 
            src={item.image} 
            alt={item.title}
            style={{
              width: '80px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '5px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>{item.title}</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>by {item.author}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                style={{
                  background: '#e91e63',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                style={{
                  background: '#e91e63',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e91e63', marginBottom: '0.5rem' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => onRemoveItem(item.id)}
              style={{
                background: '#ff4757',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Subtotal ({getTotalItems()} items):</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Shipping:</span>
          <span>$5.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Tax:</span>
          <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: '#e91e63' }}>
          <span>Total:</span>
          <span>${(getTotalPrice() + 5 + getTotalPrice() * 0.1).toFixed(2)}</span>
        </div>
        
        <button onClick={() => onProceedToCheckout && onProceedToCheckout()} style={{
          background: '#e91e63',
          color: 'white',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          marginTop: '1rem'
        }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;