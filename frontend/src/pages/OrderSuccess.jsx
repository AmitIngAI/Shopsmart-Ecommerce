import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh', 
      paddingTop: '180px',
      paddingBottom: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
          borderRadius: '32px',
          padding: '60px 80px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.05)',
          maxWidth: '500px'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 10px 40px rgba(0, 212, 170, 0.3)'
          }}
        >
          <CheckCircleIcon style={{ width: '50px', height: '50px', color: '#fff' }} />
        </motion.div>

        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: '#fff', 
          marginBottom: '16px' 
        }}>
          Order Placed Successfully!
        </h1>

        <p style={{ 
          color: '#a0a0a0', 
          fontSize: '16px', 
          marginBottom: '30px',
          lineHeight: 1.6
        }}>
          Thank you for shopping with us. Your order has been confirmed.
        </p>

        <div style={{
          background: 'rgba(255,107,53,0.1)',
          padding: '20px',
          borderRadius: '14px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '8px' }}>Order Number</p>
          <p style={{ 
            color: '#ff6b35', 
            fontSize: '24px', 
            fontWeight: '800',
            letterSpacing: '2px'
          }}>
            #{orderNumber}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '16px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/orders')}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              border: 'none',
              borderRadius: '14px',
              padding: '16px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBagIcon style={{ width: '18px', height: '18px' }} />
            Track Order
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;