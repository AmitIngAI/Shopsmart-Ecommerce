import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  TrendingUpIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const SearchResults = ({ query, results, onClose, onSelect, recentSearches = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayResults, setDisplayResults] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && results.length > 0) {
      // Group and sort results
      const grouped = {
        exact: [],
        category: [],
        brand: [],
        other: []
      };

      results.forEach(product => {
        const lowerQuery = query.toLowerCase();
        const lowerName = product.name.toLowerCase();
        const lowerCategory = product.category?.toLowerCase() || '';
        const lowerBrand = product.brand?.toLowerCase() || '';

        if (lowerName.includes(lowerQuery)) {
          grouped.exact.push(product);
        } else if (lowerCategory.includes(lowerQuery)) {
          grouped.category.push(product);
        } else if (lowerBrand.includes(lowerQuery)) {
          grouped.brand.push(product);
        } else {
          grouped.other.push(product);
        }
      });

      // Combine results in order of relevance
      const sorted = [
        ...grouped.exact,
        ...grouped.category,
        ...grouped.brand,
        ...grouped.other
      ].slice(0, 12); // Limit to 12 results

      setDisplayResults(sorted);
    }
  }, [results, query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < displayResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && displayResults[selectedIndex]) {
        onSelect(displayResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, displayResults, onSelect]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }
  }, [selectedIndex]);

  if (!query) return null;

  const hasResults = displayResults.length > 0;
  const hasRecentSearches = recentSearches.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0,
          right: 0,
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          borderRadius: '20px',
          maxHeight: '520px',
          overflow: 'hidden',
          zIndex: 1000,
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(to bottom, #fafafa 0%, #fff 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
            }}>
              <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </div>
            <div>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#212121',
                margin: 0,
                lineHeight: 1.2
              }}>
                {hasResults 
                  ? `${displayResults.length} result${displayResults.length > 1 ? 's' : ''} found`
                  : 'No results found'
                }
              </h3>
              <p style={{ 
                fontSize: '13px', 
                color: '#878787', 
                margin: 0,
                marginTop: '2px'
              }}>
                {hasResults 
                  ? `Searching for "${query}"`
                  : `Try different keywords`
                }
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.04)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <XMarkIcon style={{ width: '20px', height: '20px', color: '#878787' }} />
          </motion.button>
        </div>

        {/* Results Container */}
        <div 
          ref={resultsRef}
          style={{
            maxHeight: '440px',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#e0e0e0 transparent'
          }}
        >
          {hasResults ? (
            <>
              {/* Top Matches */}
              <div style={{ padding: '16px 24px 8px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <FireIcon style={{ width: '16px', height: '16px', color: '#ff6b35' }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#878787',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Top Matches
                  </span>
                </div>
              </div>

              {/* Product Results */}
              {displayResults.map((product, index) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  query={query}
                  isSelected={index === selectedIndex}
                  onClick={() => onSelect(product)}
                  onHover={() => setSelectedIndex(index)}
                  index={index}
                />
              ))}

              {/* View All Link */}
              {displayResults.length >= 12 && (
                <motion.div
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fafafa'
                  }}
                  onClick={() => {
                    // Navigate to full search results page
                    onClose();
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#667eea'
                  }}>
                    View all {results.length} results
                  </span>
                  <ArrowRightIcon style={{ 
                    width: '18px', 
                    height: '18px', 
                    color: '#667eea' 
                  }} />
                </motion.div>
              )}
            </>
          ) : (
            /* No Results State */
            <div style={{
              padding: '60px 24px',
              textAlign: 'center'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  opacity: 0.2
                }}
              >
                <MagnifyingGlassIcon style={{ width: '40px', height: '40px', color: '#fff' }} />
              </motion.div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#212121',
                marginBottom: '8px'
              }}>
                No products found
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#878787',
                marginBottom: '24px',
                lineHeight: 1.6
              }}>
                Try adjusting your search or browse our categories
              </p>

              {/* Recent Searches */}
              {hasRecentSearches && (
                <div style={{ marginTop: '32px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '12px',
                    justifyContent: 'center'
                  }}>
                    <ClockIcon style={{ width: '16px', height: '16px', color: '#878787' }} />
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#878787',
                      textTransform: 'uppercase'
                    }}>
                      Recent Searches
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {recentSearches.slice(0, 5).map((term, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          background: '#f0f0f0',
                          border: 'none',
                          fontSize: '13px',
                          color: '#212121',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard Hints */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa',
          display: 'flex',
          gap: '16px',
          fontSize: '11px',
          color: '#878787',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>Enter</kbd>
            <span>Select</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual Search Result Item Component
const SearchResultItem = ({ product, query, isSelected, onClick, onHover, index }) => {
  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} style={{ 
          background: 'linear-gradient(135deg, #fff59d 0%, #ffd54f 100%)',
          color: '#212121',
          fontWeight: '700',
          borderRadius: '2px',
          padding: '0 2px'
        }}>
          {part}
        </mark>
      ) : part
    );
  };

  const discountPercent = product.discount || 
    Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ backgroundColor: '#f8f9fa' }}
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        padding: '14px 24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: isSelected ? '3px solid #667eea' : '3px solid transparent',
        background: isSelected ? '#f0f4ff' : 'transparent',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Product Image */}
      <div style={{
        position: 'relative',
        flexShrink: 0
      }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: '#f5f5f5',
            boxShadow: isSelected 
              ? '0 8px 16px rgba(102,126,234,0.2)' 
              : '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </motion.div>

        {/* Discount Badge */}
        {discountPercent > 10 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
            padding: '3px 6px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(255,107,53,0.4)'
          }}>
            {discountPercent}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name */}
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#212121',
          marginBottom: '4px',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {highlightMatch(product.name, query)}
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#878787',
          marginBottom: '6px'
        }}>
          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TagIcon style={{ width: '12px', height: '12px' }} />
            <span>{product.category}</span>
          </div>

          {/* Brand */}
          {product.brand && (
            <>
              <span>•</span>
              <span style={{ fontWeight: '600' }}>{product.brand}</span>
            </>
          )}

          {/* Rating */}
          {product.rating && (
            <>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <StarIcon style={{ width: '12px', height: '12px', color: '#ffd93d' }} />
                <span style={{ fontWeight: '600', color: '#212121' }}>
                  {product.rating}
                </span>
                {product.reviews && (
                  <span style={{ color: '#878787' }}>
                    ({product.reviews.toLocaleString()})
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#212121'
          }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span style={{
                fontSize: '14px',
                color: '#878787',
                textDecoration: 'line-through'
              }}>
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#00a650',
                background: 'rgba(0,166,80,0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {product.tag && (
          <div style={{ marginTop: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#667eea',
              background: 'rgba(102,126,234,0.1)',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <SparklesIcon style={{ width: '10px', height: '10px' }} />
              {product.tag}
            </span>
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <motion.div
        animate={{
          x: isSelected ? 0 : -10,
          opacity: isSelected ? 1 : 0
        }}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <ArrowRightIcon style={{ width: '16px', height: '16px', color: '#fff' }} />
      </motion.div>

      {/* Stock Status */}
      {product.stock && product.stock < 20 && (
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '24px',
          fontSize: '11px',
          fontWeight: '600',
          color: product.stock < 10 ? '#ff4757' : '#ffa502',
          background: product.stock < 10 ? 'rgba(255,71,87,0.1)' : 'rgba(255,165,2,0.1)',
          padding: '3px 8px',
          borderRadius: '4px'
        }}>
          Only {product.stock} left!
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;