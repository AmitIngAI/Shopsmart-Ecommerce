import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';

const DealsOfTheDay = ({ products }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: '#fff',
      padding: '25px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      margin: '20px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '2px solid #f1f3f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#212121'
          }}>
            ⚡ Deals of the Day
          </h2>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            {['hours', 'minutes', 'seconds'].map((unit) => (
              <div key={unit} style={{
                background: '#2874f0',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                minWidth: '55px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '700' }}>
                  {String(timeLeft[unit]).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button style={{
          background: '#2874f0',
          color: '#fff',
          border: 'none',
          padding: '10px 25px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          VIEW ALL
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {products.slice(0, 6).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} compact />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DealsOfTheDay;