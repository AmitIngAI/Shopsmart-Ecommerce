import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon,
  StarIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import useStore from '../../store/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0, isMobile = false, compact = false }) => {
  const navigate = useNavigate();
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useStore();
  
  const isInCart = cart.some(item => item.id === product.id);
  const isInWishlist = wishlist.some(item => item.id === product.id);

  // Handle product click - Navigate to details
  const handleProductClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name.slice(0, 20)}... added to cart! 🛒`, {
      duration: 2000,
      style: {
        background: '#4CAF50',
        color: '#fff',
        fontSize: isMobile ? '12px' : '14px'
      }
    });
  };

  // Handle wishlist
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist! ❤️');
    }
  };

  // Compact card for mobile horizontal scroll
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onClick={handleProductClick}
        style={{
          background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.05)',
          height: '100%'
        }}
      >
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#ff4444',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            zIndex: 2
          }}>
            {product.discount}% OFF
          </div>
        )}

        {/* Image */}
        <div style={{
          height: '120px',
          background: '#252525',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '8px'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x120/1e1e1e/ff6b35?text=Product';
            }}
          />
          
          {/* Quick Wishlist */}
          <button
            onClick={handleWishlist}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isInWishlist ? (
              <HeartIconSolid style={{ width: '14px', height: '14px', color: '#ff4444' }} />
            ) : (
              <HeartIcon style={{ width: '14px', height: '14px', color: '#fff' }} />
            )}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '10px' }}>
          <p style={{
            fontSize: '11px',
            color: '#888',
            marginBottom: '4px'
          }}>
            {product.brand}
          </p>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#fff',
            marginBottom: '6px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </h3>
          
          {/* Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '6px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: '#388e3c',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: '600' }}>
                {product.rating}
              </span>
              <StarIcon style={{ width: '10px', height: '10px', color: '#fff', fill: '#fff' }} />
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span style={{
                fontSize: '10px',
                color: '#888',
                textDecoration: 'line-through'
              }}>
                ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Full card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: isMobile ? 0 : -8 }}
      onClick={handleProductClick}
      style={{
        background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div style={{
          position: 'absolute',
          top: isMobile ? '8px' : '12px',
          left: isMobile ? '8px' : '12px',
          background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
          color: '#fff',
          padding: isMobile ? '4px 8px' : '6px 12px',
          borderRadius: '6px',
          fontSize: isMobile ? '10px' : '12px',
          fontWeight: '700',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(255,68,68,0.3)'
        }}>
          {product.discount}% OFF
        </div>
      )}

      {/* Tag Badge */}
      {product.tag && (
        <div style={{
          position: 'absolute',
          top: isMobile ? '8px' : '12px',
          right: isMobile ? '8px' : '12px',
          background: 'rgba(255,107,53,0.9)',
          color: '#fff',
          padding: isMobile ? '4px 8px' : '6px 12px',
          borderRadius: '6px',
          fontSize: isMobile ? '9px' : '11px',
          fontWeight: '600',
          zIndex: 2
        }}>
          {product.tag}
        </div>
      )}

      {/* Image Container */}
      <div style={{
        height: isMobile ? '140px' : '200px',
        background: '#252525',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.img
          src={product.image}
          alt={product.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: isMobile ? '12px' : '20px'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/280x200/1e1e1e/ff6b35?text=Product';
          }}
        />

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            bottom: isMobile ? '8px' : '12px',
            right: isMobile ? '8px' : '12px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3
          }}
        >
          {isInWishlist ? (
            <HeartIconSolid style={{ 
              width: isMobile ? '16px' : '20px', 
              height: isMobile ? '16px' : '20px', 
              color: '#ff4444' 
            }} />
          ) : (
            <HeartIcon style={{ 
              width: isMobile ? '16px' : '20px', 
              height: isMobile ? '16px' : '20px', 
              color: '#fff' 
            }} />
          )}
        </motion.button>
      </div>

      {/* Product Info */}
      <div style={{ 
        padding: isMobile ? '12px' : '20px' 
      }}>
        {/* Brand */}
        <p style={{
          fontSize: isMobile ? '11px' : '12px',
          color: '#888',
          marginBottom: isMobile ? '4px' : '6px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {product.brand}
        </p>

        {/* Name */}
        <h3 style={{
          fontSize: isMobile ? '13px' : '16px',
          fontWeight: '600',
          color: '#fff',
          marginBottom: isMobile ? '8px' : '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '6px' : '8px',
          marginBottom: isMobile ? '10px' : '14px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#388e3c',
            padding: isMobile ? '3px 8px' : '4px 10px',
            borderRadius: '4px'
          }}>
            <span style={{ 
              fontSize: isMobile ? '11px' : '13px', 
              fontWeight: '700', 
              color: '#fff' 
            }}>
              {product.rating}
            </span>
            <StarIcon style={{ 
              width: isMobile ? '10px' : '12px', 
              height: isMobile ? '10px' : '12px', 
              color: '#fff',
              fill: '#fff'
            }} />
          </div>
          <span style={{ 
            fontSize: isMobile ? '11px' : '13px', 
            color: '#888' 
          }}>
            ({product.reviews?.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: isMobile ? '6px' : '10px',
          marginBottom: isMobile ? '12px' : '16px',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            fontSize: isMobile ? '18px' : '22px', 
            fontWeight: '800', 
            color: '#fff' 
          }}>
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#888',
                textDecoration: 'line-through'
              }}>
                ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
              <span style={{ 
                fontSize: isMobile ? '11px' : '13px', 
                color: '#00d4aa', 
                fontWeight: '600' 
              }}>
                {product.discount}% off
              </span>
            </>
          )}
        </div>

        {/* Stock Warning */}
        {product.stock && product.stock <= 10 && (
          <div style={{
            fontSize: isMobile ? '10px' : '12px',
            color: '#ff9800',
            marginBottom: isMobile ? '10px' : '12px',
            fontWeight: '500'
          }}>
            ⚡ Only {product.stock} left!
          </div>
        )}

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isInCart}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '14px',
            background: isInCart 
              ? 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
              : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            border: 'none',
            borderRadius: isMobile ? '8px' : '10px',
            color: '#fff',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '700',
            cursor: isInCart ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isInCart 
              ? '0 4px 15px rgba(56,142,60,0.3)'
              : '0 4px 15px rgba(255,107,53,0.3)'
          }}
        >
          <ShoppingCartIcon style={{ 
            width: isMobile ? '14px' : '18px', 
            height: isMobile ? '14px' : '18px' 
          }} />
          {isInCart ? 'ADDED ✓' : 'ADD TO CART'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;