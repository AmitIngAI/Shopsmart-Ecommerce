import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import useStore from '../../store/store';
import toast from 'react-hot-toast';

const CartSidebar = () => {
  const { 
    cart, 
    cartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    addToCart  // ✅ Store se addToCart function
  } = useStore();
  
  const total = getCartTotal();
  const deliveryCharge = total > 500 ? 0 : 40;
  const finalTotal = total + deliveryCharge;

  // 🎯 RECOMMENDED PRODUCTS DATA
  const recommendedProducts = [
    {
      id: 'rec-001',  // ✅ Unique ID important hai
      name: 'Wireless Earbuds Pro',
      brand: 'boAt',
      price: 799,
      originalPrice: 2990,
      discount: 73,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
      rating: 4.2,
      category: 'electronics'
    },
    {
      id: 'rec-002',
      name: 'Shockproof Phone Case',
      brand: 'Spigen',
      price: 299,
      originalPrice: 999,
      discount: 70,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200',
      rating: 4.0,
      category: 'accessories'
    },
    {
      id: 'rec-003',
      name: 'USB-C Fast Charging Cable',
      brand: 'Anker',
      price: 199,
      originalPrice: 599,
      discount: 67,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200',
      rating: 4.5,
      category: 'accessories'
    }
  ];

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    toast.success('Order placed successfully! 🎉');
    clearCart();
    toggleCart();
  };

  // 🔥 MAIN FIX: Recommended Product Click Handler
  const handleAddRecommended = (e, product) => {
    // Step 1: Event propagation completely roko
    e.stopPropagation();
    e.preventDefault();
    
    // Step 2: Cart me add karo
    addToCart(product);
    
    // Step 3: Success message
    toast.success(`${product.name} added! 🛒`, {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: '#388e3c',
        color: '#fff',
      }
    });
    
    console.log('Product added:', product.name); // ✅ Debug ke liye
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="cart-backdrop"  // ✅ Class for debugging
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,  // ✅ Sidebar se kam rakha
            }}
          />

          {/* Sidebar Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}  // ✅ Important
            className="cart-sidebar"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              background: '#fff',
              zIndex: 1000,  // ✅ Backdrop se zyada
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#2874f0',
              color: '#fff',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBagIcon style={{ width: '24px', height: '24px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  My Cart ({cart.length})
                </h2>
              </div>
              <button
                onClick={toggleCart}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <XMarkIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch'  // ✅ iOS smooth scroll
            }}>
              {/* Cart Items Section */}
              <div style={{ padding: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#878787'
                  }}>
                    <ShoppingBagIcon style={{ 
                      width: '80px', 
                      height: '80px', 
                      margin: '0 auto 20px', 
                      opacity: 0.3 
                    }} />
                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#212121' }}>
                      Your cart is empty
                    </h3>
                    <p style={{ fontSize: '14px' }}>Add items to get started</p>
                    <button
                      onClick={toggleCart}
                      style={{
                        marginTop: '20px',
                        padding: '12px 30px',
                        background: '#2874f0',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      SHOP NOW
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        background: '#fafafa',
                        borderRadius: '4px',
                        marginBottom: '12px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: '90px',
                        height: '90px',
                        background: '#fff',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid #e0e0e0'
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '8px'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/90x90?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#212121',
                          marginBottom: '6px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </h4>
                        
                        <p style={{ fontSize: '12px', color: '#878787', marginBottom: '8px' }}>
                          {item.brand}
                        </p>

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'baseline', 
                          gap: '8px', 
                          marginBottom: '12px' 
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: '500' }}>
                            {item.discount}% off
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            background: '#fff'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, item.quantity - 1);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: '#212121'
                              }}
                            >
                              <MinusIcon style={{ width: '14px', height: '14px' }} />
                            </button>
                            
                            <span style={{
                              padding: '0 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#212121',
                              borderLeft: '1px solid #e0e0e0',
                              borderRight: '1px solid #e0e0e0'
                            }}>
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, item.quantity + 1);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: '#212121'
                              }}
                            >
                              <PlusIcon style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                              toast.success('Removed from cart');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#878787',
                              padding: '8px'
                            }}
                          >
                            <TrashIcon style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* 🎯 RECOMMENDED PRODUCTS - MAIN FIX SECTION */}
              {cart.length > 0 && (
                <div 
                  style={{
                    padding: '0 16px 16px',
                    background: '#fff'  // ✅ Background add kiya
                  }}
                >
                  <div style={{
                    borderTop: '4px solid #f0f0f0',
                    paddingTop: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#212121',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      ✨ You might also like
                    </h3>

                    {recommendedProducts.map((product) => {
                      const isInCart = cart.some(item => item.id === product.id);

                      return (
                        <div
                          key={product.id}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '12px',
                            background: '#fafafa',
                            borderRadius: '4px',
                            marginBottom: '10px',
                            border: '1px solid #e0e0e0',
                            alignItems: 'center',
                            position: 'relative',
                            isolation: 'isolate'  // ✅ New stacking context
                          }}
                        >
                          {/* Product Image */}
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#fff',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid #e0e0e0'
                          }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '4px'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60x60?text=Img';
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#212121',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {product.name}
                            </h4>
                            <div style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '6px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#212121'
                              }}>
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              <span style={{
                                fontSize: '11px',
                                color: '#878787',
                                textDecoration: 'line-through'
                              }}>
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                              <span style={{
                                fontSize: '11px',
                                color: '#388e3c',
                                fontWeight: '500'
                              }}>
                                {product.discount}% off
                              </span>
                            </div>
                          </div>

                          {/* 🔥 ADD BUTTON - CRITICAL FIX */}
                          <button
                            type="button"
                            onClick={(e) => handleAddRecommended(e, product)}
                            onMouseDown={(e) => e.stopPropagation()}  // ✅ Extra safety
                            onTouchStart={(e) => e.stopPropagation()}  // ✅ Mobile fix
                            disabled={isInCart}
                            style={{
                              padding: '8px 16px',
                              background: isInCart ? '#e0e0e0' : '#ff9f00',
                              color: isInCart ? '#878787' : '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: isInCart ? 'not-allowed' : 'pointer',
                              flexShrink: 0,
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                              position: 'relative',
                              zIndex: 10,  // ✅ Critical
                              pointerEvents: 'auto',  // ✅ Critical
                              userSelect: 'none',
                              WebkitTapHighlightColor: 'transparent',
                              touchAction: 'manipulation',  // ✅ Mobile
                              outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!isInCart) {
                                e.currentTarget.style.background = '#ff8c00';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isInCart) {
                                e.currentTarget.style.background = '#ff9f00';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            {isInCart ? '✓ ADDED' : '+ ADD'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div style={{
                borderTop: '1px solid #e0e0e0',
                padding: '16px 20px',
                background: '#fff',
                flexShrink: 0,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
              }}>
                {/* Price Breakdown */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#212121'
                  }}>
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px',
                    color: '#212121'
                  }}>
                    <span>Delivery Charges</span>
                    <span style={{ color: deliveryCharge === 0 ? '#388e3c' : '#212121' }}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px dashed #e0e0e0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#212121'
                  }}>
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Free Delivery Banner */}
                {deliveryCharge > 0 && (
                  <div style={{
                    background: '#fff6e5',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    marginBottom: '16px',
                    fontSize: '12px',
                    color: '#856404',
                    textAlign: 'center'
                  }}>
                    Add items worth ₹{500 - total} more for FREE delivery!
                  </div>
                )}

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    background: '#fb641b',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '2px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(251,100,27,0.3)'
                  }}
                >
                  PLACE ORDER
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;