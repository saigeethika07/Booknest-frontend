import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';


const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      bookId: 1,
      userName: "John Doe",
      rating: 5,
      comment: "This book changed my life! Highly recommended for anyone looking to improve their habits.",
      date: "2024-01-15"
    },
    {
      id: 2,
      bookId: 3,
      userName: "Sarah Wilson",
      rating: 4,
      comment: "Great insights on habit formation. Some concepts were repetitive but overall excellent.",
      date: "2024-01-10"
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    bookId: '',
    rating: 0,
    comment: ''
  });
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/books`);
        const data = await res.json();
        if (data.success) setAllBooks(data.books || []);
      } catch (e) {
        // no-op
      }
    };
    loadBooks();
  }, []);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.bookId || newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const review = {
      id: reviews.length + 1,
      bookId: parseInt(newReview.bookId),
      userName: "Current User",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ bookId: '', rating: 0, comment: '' });
    alert('Review submitted successfully!');
  };

  const getBookTitle = (bookId) => {
    const book = allBooks.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

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
        Book Reviews
      </h1>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Write a Review</h2>
        <form onSubmit={handleSubmitReview}>
          <select 
            value={newReview.bookId} 
            onChange={(e) => setNewReview({...newReview, bookId: e.target.value})}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '5px',
              marginBottom: '1rem',
              fontSize: '1rem'
            }}
          >
            <option value="">Select a book...</option>
            {allBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Rating:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({...newReview, rating: star})}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: star <= newReview.rating ? '#ffc107' : '#ddd',
                    cursor: 'pointer'
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Share your thoughts about this book..."
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '5px',
              marginBottom: '1rem',
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}
          />

          <button type="submit" style={{
            background: '#e91e63',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Submit Review
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>All Available Books</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {allBooks.map((book) => (
            <div key={book.id} style={{ background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <img src={book.image} alt={book.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
              <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#e91e63' }}>{book.title}</h3>
              <div style={{ color: '#666', marginBottom: '0.5rem' }}>by {book.author}</div>
              <div style={{ color: '#ffc107', marginBottom: '0.5rem' }}>{renderStars(Math.round(book.rating || 0))} ({book.rating || 0}/5)</div>
              <div style={{ color: '#333', fontSize: '0.9rem' }}>{book.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {reviews.map(review => (
          <div key={review.id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#e91e63', marginBottom: '0.5rem' }}>
              {getBookTitle(review.bookId)}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong style={{ color: '#333' }}>{review.userName}</strong>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>{review.date}</span>
            </div>
            <div style={{ color: '#ffc107', marginBottom: '0.5rem' }}>
              {renderStars(review.rating)} ({review.rating}/5)
            </div>
            <p style={{ color: '#333', lineHeight: '1.6' }}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;