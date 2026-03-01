import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../data/products';

const FlipkartCategories = () => {
  return (
    <div style={{
      background: '#fff',
      padding: '32px 12px',
      margin: '12px 0',
      maxWidth: '1248px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px'
      }}>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            style={{
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#212121',
              marginBottom: '4px'
            }}>
              {category.name}
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#388e3c',
              fontWeight: '500'
            }}>
              {category.offer}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlipkartCategories;