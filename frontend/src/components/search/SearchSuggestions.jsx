import React from 'react';
import { motion } from 'framer-motion';
import { 
  FireIcon, 
  ClockIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const SearchSuggestions = ({ onSelect, recentSearches = [] }) => {
  const suggestions = {
    trending: [
      { text: 'iPhone 15 Pro', icon: FireIcon, color: '#ff6b35' },
      { text: 'PlayStation 5', icon: FireIcon, color: '#ff6b35' },
      { text: 'MacBook Pro', icon: ArrowTrendingUpIcon, color: '#667eea' },
      { text: 'Nike Shoes', icon: ArrowTrendingUpIcon, color: '#667eea' },
      { text: 'Samsung TV', icon: FireIcon, color: '#ff6b35' },
      { text: 'Air Purifier', icon: ArrowTrendingUpIcon, color: '#667eea' }
    ],
    categories: [
      { text: 'Electronics', emoji: '📱' },
      { text: 'Fashion', emoji: '👕' },
      { text: 'Beauty', emoji: '💄' },
      { text: 'Sports', emoji: '⚽' },
      { text: 'Home & Living', emoji: '🏠' },
      { text: 'Deals', emoji: '🔥' }
    ],
    brands: [
      'Apple', 'Samsung', 'Nike', 'Sony', 'Adidas', 'JBL', 'Dell', 'Canon'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        left: 0,
        right: 0,
        background: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
        zIndex: 1000,
        maxHeight: '480px',
        overflowY: 'auto'
      }}
    >
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div style={{ padding: '20px 24px 12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '14px'
          }}>
            <ClockIcon style={{ width: '16px', height: '16px', color: '#878787' }} />
            <span style={{ 
              fontSize: '12px', 
              fontWeight: '700', 
              color: '#878787',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Recent Searches
            </span>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((term, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, backgroundColor: '#667eea', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(term)}
                style={{
                  padding: '8px 16px',
                  background: '#f0f5ff',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#667eea',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {term}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      <div style={{ padding: '16px 24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '14px'
        }}>
          <FireIcon style={{ width: '16px', height: '16px', color: '#ff6b35' }} />
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: '#878787',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Trending Searches
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {suggestions.trending.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 8, backgroundColor: '#f8f9fa' }}
              onClick={() => onSelect(item.text)}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <item.icon style={{ width: '16px', height: '16px', color: item.color }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>
                {item.text}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '16px 24px', background: '#fafafa' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '14px'
        }}>
          <SparklesIcon style={{ width: '16px', height: '16px', color: '#667eea' }} />
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: '#878787',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Browse Categories
          </span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px' 
        }}>
          {suggestions.categories.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(cat.text)}
              style={{
                padding: '14px 12px',
                background: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>
                {cat.text}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Popular Brands */}
      <div style={{ padding: '16px 24px 20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '14px'
        }}>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: '#878787',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🏷️ Popular Brands
          </span>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestions.brands.map((brand, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              whileHover={{ scale: 1.05, borderColor: '#667eea' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(brand)}
              style={{
                padding: '8px 16px',
                background: '#fff',
                border: '1.5px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#212121',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {brand}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Keyboard Hint */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '11px',
        color: '#878787'
      }}>
        <span>Type to search</span>
        <span>•</span>
        <span>
          <kbd style={{
            padding: '2px 6px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontFamily: 'monospace',
            marginRight: '4px'
          }}>Esc</kbd>
          to close
        </span>
      </div>
    </motion.div>
  );
};

export default SearchSuggestions;