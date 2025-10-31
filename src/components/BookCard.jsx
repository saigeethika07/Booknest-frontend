import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const BookTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
  line-height: 1.4;
`;

const BookAuthor = styled.p`
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
`;

const BookDescription = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #ffc107;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #e91e63;
`;

const AddButton = styled.button`
  background: #e91e63;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #d81b60;
  }
`;

const BookCard = ({ book, onAddToCart }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  return (
    <Card>
      <BookImage src={book.image} alt={book.title} />
      <CardContent>
        <BookTitle>{book.title}</BookTitle>
        <BookAuthor>by {book.author}</BookAuthor>
        <BookDescription>{book.description}</BookDescription>
        
        <Rating>
          {renderStars(book.rating)} ({book.rating})
        </Rating>

        <PriceSection>
          <Price>${book.price}</Price>
          <AddButton onClick={() => onAddToCart(book)}>
            Add to Cart
          </AddButton>
        </PriceSection>
      </CardContent>
    </Card>
  );
};

export default BookCard;