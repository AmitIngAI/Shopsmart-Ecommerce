import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import useStore from '../../store/store';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useStore();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    login({ 
      name: isSignup ? formData.name : formData.email.split('@')[0], 
      email: formData.email 
    });
    toast.success(isSignup ? 'Account created! 🎉' : 'Welcome back! 🎉');
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 2000
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
              borderRadius: '28px',
              padding: '48px',
              width: '100%',
              maxWidth: '440px',
              zIndex: 2001,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <XMarkIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </motion.button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70px',
                  height: '70px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
                }}
              >
                <SparklesIcon style={{ width: '36px', height: '36px', color: '#fff' }} />
              </motion.div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                {isSignup ? 'Join us for exclusive deals' : 'Sign in to continue shopping'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    paddingRight: '50px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    bottom: '14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? (
                    <EyeSlashIcon style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                  ) : (
                    <EyeIcon style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                  )}
                </button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#666' : 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '18px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
                }}
              >
                {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <span
                onClick={() => setIsSignup(!isSignup)}
                style={{ color: '#ff6b35', fontWeight: '600', cursor: 'pointer' }}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;