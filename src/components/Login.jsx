import React, { useState } from 'react';
import { API_BASE_URL } from '../api';
const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : { name: formData.name })
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Authentication failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1512820790803-83ca734da794) center/cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#e91e63', 
          fontSize: '2.5rem', 
          marginBottom: '10px', 
          fontFamily: 'Georgia, serif' 
        }}>
          BookNest
        </h1>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px', 
          fontSize: '1.1rem' 
        }}>
          Your Gateway to Infinite Stories
        </p>
        
        <div style={{ 
          display: 'flex', 
          marginBottom: '30px', 
          background: '#f5f5f5', 
          borderRadius: '25px', 
          padding: '5px' 
        }}>
          <button 
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: isLogin ? '#e91e63' : 'transparent',
              color: isLogin ? 'white' : '#666',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: !isLogin ? '#e91e63' : 'transparent',
              color: !isLogin ? 'white' : '#666',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        <form style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: '#ff4757', textAlign: 'left' }}>{error}</div>
          )}
          {!isLogin && (
            <input 
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          )}
          <input 
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <input 
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button type="submit" style={{
            background: '#e91e63',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p style={{ 
          marginTop: '20px', 
          color: '#666' 
        }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ 
              color: '#e91e63', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;