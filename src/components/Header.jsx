import React from 'react';

const Header = ({ user, onLogout, currentPage, onNavigate, cartItemsCount }) => {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'books', label: 'Books' },
    { key: 'cart', label: `Cart (${cartItemsCount})` },
    { key: 'reviews', label: 'Reviews' },
    { key: 'help', label: 'Help' },
    { key: 'payment', label: 'Payment' }
  ];

  return (
    <header style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <h1 style={{ 
        color: '#e91e63', 
        fontFamily: 'Georgia, serif',
        margin: 0
      }}>
        BookNest
      </h1>
      
      <nav style={{ 
        display: 'flex', 
        gap: '1rem',
        alignItems: 'center'
      }}>
        {navItems.map((item) => (
          <button 
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              background: currentPage === item.key ? '#e91e63' : 'transparent',
              border: '2px solid #e91e63',
              color: currentPage === item.key ? 'white' : '#e91e63',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              transition: 'all 0.3s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        <span style={{ color: '#666' }}>Welcome, {user.name}!</span>
        <button 
          onClick={onLogout}
          style={{
            background: '#e91e63',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;