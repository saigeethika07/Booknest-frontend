import React, { useState, useEffect } from 'react';
import { API_BASE_URL, authHeaders } from '../api';
import { ToastContainer, toast } from 'react-toastify'; // 🟢 Added
import 'react-toastify/dist/ReactToastify.css'; // 🟢 Added

const Books = ({ onAddToCart, onItemAdded }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      }
      console.log('Books loaded:', data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories.map(cat => cat.name));
      }
      console.log('Categories loaded:', data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = async (book) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ bookId: book.id, quantity: 1 })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to add to cart');

      toast.success(`${book.title} added to cart! 🛒`, { // 🟢 Toast success
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      if (onItemAdded) onItemAdded();
    } catch (e) {
      toast.error('Please login to add to cart ⚠️', { // 🟢 Toast error
        position: 'top-center',
        autoClose: 2000,
        theme: 'colored',
      });
    }
  };

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#ddd' }}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading books from backend...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      {/* 🟢 Toast Container */}
      <ToastContainer />

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          color: '#e91e63', 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          fontFamily: 'Georgia, serif'
        }}>
          Our Book Collection
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Discover amazing books across various categories
        </p>
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            background: selectedCategory === 'all' ? '#e91e63' : 'white',
            color: selectedCategory === 'all' ? 'white' : '#333',
            padding: '0.75rem 1.5rem',
            border: '2px solid #e91e63',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          All Books
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            style={{
              background: selectedCategory === category ? '#e91e63' : 'white',
              color: selectedCategory === category ? 'white' : '#333',
              padding: '0.75rem 1.5rem',
              border: '2px solid #e91e63',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {filteredBooks.map(book => (
          <div key={book.id} style={{
            background: 'white',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <img 
              src={book.image} 
              alt={book.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '0.5rem', 
                color: '#333',
                fontSize: '1.1rem',
                lineHeight: '1.4',
                minHeight: '3rem'
              }}>
                {book.title}
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '0.5rem', 
                fontStyle: 'italic',
                fontSize: '0.9rem'
              }}>
                by {book.author}
              </p>
              <p style={{ 
                color: '#e91e63', 
                fontSize: '0.9rem',
                marginBottom: '1rem',
                fontWeight: 'bold'
              }}>
                {book.category}
              </p>
              <p style={{ 
                color: '#777', 
                fontSize: '0.9rem',
                marginBottom: '1rem',
                lineHeight: '1.4',
                minHeight: '2.5rem'
              }}>
                {book.description}
              </p>
              
              {/* Rating */}
              <div style={{ marginBottom: '1rem' }}>
                {renderStars(book.rating)}
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                  ({book.rating})
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold', 
                  color: '#e91e63' 
                }}>
                  ${book.price}
                </span>
                <button 
                  onClick={() => addToCart(book)}
                  style={{
                    background: '#e91e63',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No books found in this category</h3>
          <p>Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default Books;
