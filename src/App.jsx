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
import Orders from './components/Orders';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // 🔹 Load user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
  }, []);

  // 🔹 Fetch cart count whenever user logs in
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cart`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
          const count = (data.cart || []).reduce((t, it) => t + (it.quantity || 0), 0);
          setCartCount(count);
        }
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };
    if (user) fetchCartCount();
  }, [user]);

  // 🔹 Handle login/logout
  const handleLogin = (userData) => {
    setUser({
      name: userData.name || 'Book Lover',
      email: userData.email,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setCartCount(0);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
  };

  // 🔹 Cart updates
  const handleAddToCart = (book) => {
    const existingItem = cartItems.find((item) => item.id === book.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
    setCartCount(cartCount + 1);
  };

  const handleUpdateQuantity = (bookId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(bookId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (bookId) => {
    const removed = cartItems.find((item) => item.id === bookId);
    setCartItems(cartItems.filter((item) => item.id !== bookId));
    if (removed) setCartCount(cartCount - removed.quantity);
  };

  // 🔹 After successful payment — create order and redirect
  const handlePaymentSuccess = async () => {
    try {
      // Create an order in backend
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      });
      const orderData = await orderRes.json();

      if (orderData.success) {
        // Clear local cart
        setCartItems([]);
        setCartCount(0);
        // Navigate to orders page
        setCurrentPage('orders');
        alert('✅ Order placed successfully!');
      } else {
        alert('⚠️ Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Something went wrong while placing your order.');
    }
  };

  // 🔹 Render pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'books':
        return <Books onAddToCart={handleAddToCart} />;
      case 'cart':
        return <Cart onProceedToCheckout={() => setCurrentPage('payment')} />;
      case 'payment':
        return <Payment onPaymentSuccess={handlePaymentSuccess} />;
      case 'orders':
        return <Orders />;
      case 'reviews':
        return <Reviews />;
      case 'help':
        return <Help />;
      default:
        return <Home />;
    }
  };

  // 🔹 Auth gate
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItemsCount={cartCount}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
