import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const categories = [
  'Electronics', 'Fashion', 'Home & Furniture', 'Beauty & Personal Care',
  'Books', 'Sports', 'Toys & Games', 'Automotive'
];

const CategoryNav = () => {
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        gap: '30px',
        padding: '12px 20px',
        overflowX: 'auto'
      }}>
        {categories.map((category) => (
          <div
            key={category}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: '500',
              color: '#212121',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2874f0'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#212121'}
          >
            {category}
            <ChevronDownIcon style={{ width: '14px', height: '14px' }} />
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;