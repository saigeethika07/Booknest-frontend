import React from 'react';

const Home = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white',
        marginBottom: '3rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          fontFamily: 'Georgia, serif'
        }}>
          Welcome to BookNest
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Discover your next favorite book from our extensive collection
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        margin: '3rem 0'
      }}>
        {['Wide Selection', 'Curated Ratings', 'Fast Delivery', 'Secure Payment'].map((feature, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {['📚', '⭐', '🚚', '💳'][index]}
            </div>
            <h3 style={{ color: '#e91e63', marginBottom: '1rem' }}>{feature}</h3>
            <p>Thousands of books across multiple categories</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;