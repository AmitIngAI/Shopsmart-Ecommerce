// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useStore from './store/store';

import HeroHeader from './components/layout/HeroHeader';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Auth from './pages/Auth';
import Category from './pages/Category';
import UserDashboard from './pages/UserDashboard'; // NEW
import CartSidebar from './components/cart/CartSidebar';

// Top Loading Bar Component
const TopLoadingBar = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <motion.div
      initial={{ width: '0%' }}
      animate={{ width: '100%' }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)',
        zIndex: 9999,
        boxShadow: '0 0 10px #6366f1'
      }}
    />
  );
};

// Layout wrapper
const Layout = ({ children }) => {
  const location = useLocation();
  // Hide layout on auth and dashboard pages
  const hideLayout = ['/auth', '/dashboard'].some(path => location.pathname.startsWith(path));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <TopLoadingBar isLoading={isLoading} />
      
      {!hideLayout && <HeroHeader />}

      <main style={{ flex: 1 }}>
        {children}
      </main>

      {!hideLayout && <Footer />}
      {!hideLayout && <CartSidebar />}

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#1e1e1e',
            color: '#fff',
            borderRadius: '14px',
            fontSize: '14px',
            padding: '16px 24px',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          }
        }}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* NEW: User Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/:tab" element={<UserDashboard />} />
          <Route path="/account" element={<UserDashboard />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/my-orders" element={<UserDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;