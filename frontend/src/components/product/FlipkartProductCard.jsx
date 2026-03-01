import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ShoppingBagIcon, 
  EyeIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import useStore from '../../store/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isInWishlist = wishlist?.some(item => item.id === product.id) || false;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        background: '#1e1e1e',
        color: '#fff',
        border: '1px solid rgba(255,107,53,0.3)'
      }
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,107,53,0.1)' 
          : '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'var(--gradient-primary)',
            padding: '6px 12px',
            borderRadius: '8px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <BoltIcon style={{ width: '12px', height: '12px', color: '#fff' }} />
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>
            {product.discount}% OFF
          </span>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10
        }}
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            background: isInWishlist 
              ? 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)' 
              : 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isInWishlist ? (
            <HeartIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
          ) : (
            <HeartOutline style={{ width: '20px', height: '20px', color: '#fff' }} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toast.success('Quick view coming soon!')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EyeIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
        </motion.button>
      </motion.div>

      {/* Image */}
      <div style={{
        height: '240px',
        background: 'linear-gradient(145deg, #252525 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.3 : 0
          }}
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,107,53,0.5) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }}
        />

        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #252525 25%, #2d2d2d 50%, #252525 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        )}

        <motion.img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 2 : 0
          }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
            opacity: imageLoaded ? 1 : 0
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x200/1e1e1e/ff6b35?text=Product';
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Brand & Category */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {product.brand}
          </span>
          {product.tag && (
            <span style={{
              background: 'rgba(0,212,170,0.15)',
              color: '#00d4aa',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#fff',
          marginBottom: '12px',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          minHeight: '44px'
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'linear-gradient(135deg, #ffd93d 0%, #f7931e 100%)',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            <StarIcon style={{ width: '12px', height: '12px', color: '#000' }} />
            <span style={{ color: '#000', fontSize: '12px', fontWeight: '700' }}>
              {product.rating}
            </span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            ({product.reviews?.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '26px',
            fontWeight: '800',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.mrp && (
            <span style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              textDecoration: 'line-through'
            }}>
              ₹{product.mrp?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          style={{
            width: '100%',
            background: isHovered 
              ? 'var(--gradient-primary)' 
              : 'rgba(255,255,255,0.08)',
            border: isHovered ? 'none' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            padding: '14px',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s',
            boxShadow: isHovered ? '0 10px 30px rgba(255,107,53,0.3)' : 'none'
          }}
        >
          <ShoppingBagIcon style={{ width: '18px', height: '18px' }} />
          Add to Cart
        </motion.button>
      </div>

      {/* Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;