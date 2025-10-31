import React, { useState, useEffect } from 'react';
import { API_BASE_URL, authHeaders } from './api';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import Books from './components/Books';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import Help from './components/Help';
import Payment from './components/Payment';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cart`, { headers: { ...authHeaders() } });
        const data = await res.json();
        if (data.success) {
          const count = (data.cart || []).reduce((t, it) => t + (it.quantity || 0), 0);
          setCartCount(count);
        }
      } catch {}
    };
    fetchCartCount();
  }, [user]);

  const handleLogin = (userData) => {
    setUser({
      name: userData.name || 'Book Lover',
      email: userData.email
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
  };

  const handleAddToCart = (book) => {
    const existingItem = cartItems.find(item => item.id === book.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (bookId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== bookId));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveItem = (bookId) => {
    setCartItems(cartItems.filter(item => item.id !== bookId));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'books':
        return <Books onAddToCart={handleAddToCart} onItemAdded={() => setCartCount(cartCount + 1)} />;
      case 'cart':
        return <Cart onProceedToCheckout={() => setCurrentPage('payment')} />;
      case 'reviews':
        return <Reviews />;
      case 'help':
        return <Help />;
      case 'payment':
        return <Payment />;
      default:
        return <Home />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <Header 
        user={user} 
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItemsCount={cartCount}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;