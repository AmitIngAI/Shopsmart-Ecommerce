import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success('Moved to cart!');
  };

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh', 
      paddingTop: '180px',
      paddingBottom: '80px'
    }}>
      <div className="container" style={{ padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '50px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartIcon style={{ width: '32px', height: '32px', color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff' }}>
                My Wishlist
              </h1>
              <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </motion.div>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
              borderRadius: '24px',
              padding: '80px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255,71,87,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px'
            }}>
              <HeartIcon style={{ width: '50px', height: '50px', color: '#ff4757' }} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '30px' }}>
              Save items you love by clicking the heart icon
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                border: 'none',
                borderRadius: '50px',
                padding: '16px 40px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {/* Image */}
                <div 
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    height: '200px',
                    background: '#252525',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200/1e1e1e/ff6b35?text=Product';
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <p style={{ color: '#ff6b35', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                    {item.brand}
                  </p>
                  <h3 style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                      ₹{item.price?.toLocaleString('en-IN')}
                    </span>
                    {item.mrp && (
                      <span style={{ fontSize: '14px', color: '#6b6b6b', textDecoration: 'line-through' }}>
                        ₹{item.mrp?.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span style={{ fontSize: '14px', color: '#00d4aa', fontWeight: '600' }}>
                      {item.discount}% off
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(item)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <ShoppingBagIcon style={{ width: '18px', height: '18px' }} />
                      Move to Cart
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.success('Removed from wishlist');
                      }}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'rgba(255,71,87,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <TrashIcon style={{ width: '20px', height: '20px', color: '#ff4757' }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;