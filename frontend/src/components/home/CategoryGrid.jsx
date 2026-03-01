import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Electronics', icon: '📱', color: '#2874f0' },
  { name: 'Fashion', icon: '👗', color: '#ff9900' },
  { name: 'Home & Kitchen', icon: '🏠', color: '#388e3c' },
  { name: 'Beauty', icon: '💄', color: '#e91e63' },
  { name: 'Books', icon: '📚', color: '#673ab7' },
  { name: 'Sports', icon: '⚽', color: '#ff5722' },
  { name: 'Toys', icon: '🧸', color: '#00bcd4' },
  { name: 'Automotive', icon: '🚗', color: '#607d8b' }
];

const CategoryGrid = () => {
  return (
    <div style={{
      background: '#fff',
      padding: '30px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      margin: '20px 0'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '25px',
        color: '#212121'
      }}>
        Shop by Category
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '20px'
      }}>
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              {category.icon}
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#212121'
            }}>
              {category.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;