import React, { useEffect, useState } from 'react';
import { API_BASE_URL, authHeaders } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            color: '#e91e63',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif',
          }}
        >
          My Orders
        </h1>
        <div>Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            color: '#e91e63',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif',
          }}
        >
          My Orders
        </h1>
        <div
          style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#666', marginBottom: '1rem' }}>No orders yet</h2>
          <p style={{ color: '#999' }}>Start shopping to place your first order!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{
          color: '#e91e63',
          fontSize: '2.5rem',
          marginBottom: '2rem',
          fontFamily: 'Georgia, serif',
        }}
      >
        My Orders ({orders.length})
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Order ID:</strong> {order._id}
          </div>
          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </div>
          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Total:</strong> ₹{order.total}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ color: '#e91e63', marginBottom: '0.5rem' }}>Items:</h3>
            <ul style={{ marginLeft: '1rem', color: '#555' }}>
              {order.cartItems.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.3rem' }}>
                  {item.title} × {item.quantity} — ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
