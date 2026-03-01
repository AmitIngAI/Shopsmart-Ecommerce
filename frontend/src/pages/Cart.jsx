import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  GiftIcon,
  TicketIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/FlipkartProductCard';
import { products } from '../data/products';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    addToWishlist,
    wishlist
  } = useStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const subtotal = getCartTotal();
  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;

  const availableCoupons = [
    { code: 'WELCOME10', discount: 10, minOrder: 500, description: '10% off on first order' },
    { code: 'SAVE20', discount: 20, minOrder: 2000, description: '20% off on orders above ₹2000' },
    { code: 'FLAT500', discount: 500, minOrder: 3000, description: 'Flat ₹500 off on orders above ₹3000', flat: true },
    { code: 'FREESHIP', discount: 0, minOrder: 0, description: 'Free shipping on any order', freeShip: true }
  ];

  const handleApplyCoupon = (coupon) => {
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      toast.error(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }
    setAppliedCoupon(coupon);
    setShowCouponModal(false);
    setCouponCode(coupon.code);
    toast.success(`Coupon "${coupon.code}" applied! 🎉`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
    toast.success('Moved to wishlist ❤️');
  };

  const isInWishlist = (id) => wishlist?.some(item => item.id === id);

  // Get recommended products (not in cart)
  const recommendedProducts = products
    .filter(p => !cart.some(c => c.id === p.id))
    .slice(0, 4);

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div style={{
        background: '#0f0f0f',
        minHeight: '100vh',
        paddingTop: '60px',
        paddingBottom: '80px'
      }}>
        <div className="container" style={{ 
          padding: '0 24px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
              borderRadius: '28px',
              padding: '80px 40px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
              marginTop: '40px'
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 40px'
              }}
            >
              <ShoppingBagIcon style={{ width: '70px', height: '70px', color: '#ff6b35' }} />
            </motion.div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '16px'
            }}>
              Your Cart is Empty
            </h1>

            <p style={{
              color: '#6b6b6b',
              fontSize: '18px',
              marginBottom: '40px',
              maxWidth: '400px',
              margin: '0 auto 40px',
              lineHeight: 1.6
            }}>
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255,107,53,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '18px 40px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <SparklesIcon style={{ width: '20px', height: '20px' }} />
                Start Shopping
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/wishlist')}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                  padding: '18px 40px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <HeartIcon style={{ width: '20px', height: '20px' }} />
                View Wishlist
              </motion.button>
            </div>
          </motion.div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <GiftIcon style={{ width: '28px', height: '28px', color: '#ff6b35' }} />
                Recommended For You
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px'
              }}>
                {recommendedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0f0f0f',
      minHeight: '100vh',
      paddingTop: '60px',
      paddingBottom: '80px'
    }}>
      <div className="container" style={{ 
        padding: '0 24px', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            marginTop: '40px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeftIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </motion.button>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShoppingBagIcon style={{ width: '36px', height: '36px', color: '#ff6b35' }} />
                Shopping Cart
              </h1>
              <p style={{ color: '#6b6b6b', fontSize: '15px', marginTop: '4px' }}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              clearCart();
              toast.success('Cart cleared');
            }}
            style={{
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.2)',
              borderRadius: '12px',
              padding: '12px 24px',
              color: '#ff4757',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <TrashIcon style={{ width: '18px', height: '18px' }} />
            Clear Cart
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Cart Items */}
          <div>
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  style={{
                    background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    gap: '24px'
                  }}
                >
                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/product/${item.id}`)}
                    style={{
                      width: '160px',
                      height: '160px',
                      borderRadius: '16px',
                      background: '#252525',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/160x160/1e1e1e/ff6b35?text=Product';
                      }}
                    />
                  </motion.div>

                  {/* Product Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Brand & Title */}
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        color: '#ff6b35',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {item.brand}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${item.id}`)}
                        style={{
                          color: '#fff',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '6px 0 0 0',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = '#fff'}
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                      {item.tag && (
                        <span style={{
                          background: 'rgba(0,212,170,0.15)',
                          color: '#00d4aa',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {item.tag}
                        </span>
                      )}
                      <span style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#a0a0a0',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        In Stock
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                      <span style={{
                        fontSize: '26px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.mrp && (
                        <span style={{
                          fontSize: '16px',
                          color: '#6b6b6b',
                          textDecoration: 'line-through'
                        }}>
                          ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                      {item.discount > 0 && (
                        <span style={{
                          color: '#00d4aa',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quantity & Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '14px',
                        padding: '6px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border: 'none',
                            background: item.quantity <= 1 
                              ? 'rgba(255,255,255,0.05)' 
                              : 'rgba(255,255,255,0.1)',
                            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: item.quantity <= 1 ? 0.5 : 1
                          }}
                        >
                          <MinusIcon style={{ width: '18px', height: '18px', color: '#fff' }} />
                        </motion.button>

                        <span style={{
                          minWidth: '50px',
                          textAlign: 'center',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#fff'
                        }}>
                          {item.quantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PlusIcon style={{ width: '18px', height: '18px', color: '#fff' }} />
                        </motion.button>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoveToWishlist(item)}
                          style={{
                            background: isInWishlist(item.id) 
                              ? 'rgba(255,71,87,0.2)' 
                              : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            color: isInWishlist(item.id) ? '#ff4757' : '#fff',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          {isInWishlist(item.id) ? (
                            <HeartSolid style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <HeartIcon style={{ width: '18px', height: '18px' }} />
                          )}
                          Save
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.success('Item removed');
                          }}
                          style={{
                            background: 'rgba(255,71,87,0.1)',
                            border: '1px solid rgba(255,71,87,0.2)',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            color: '#ff4757',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <TrashIcon style={{ width: '18px', height: '18px' }} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                gap: '30px'
              }}
            >
              {[
                { icon: TruckIcon, title: 'Free Delivery', desc: 'On orders above ₹999', color: '#00d4aa' },
                { icon: ShieldCheckIcon, title: 'Secure Payment', desc: '100% secure checkout', color: '#667eea' },
                { icon: GiftIcon, title: 'Gift Wrap', desc: 'Available at checkout', color: '#f7931e' }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <feature.icon style={{ width: '24px', height: '24px', color: feature.color }} />
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: 0 }}>
                      {feature.title}
                    </p>
                    <p style={{ color: '#6b6b6b', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '200px' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <h2 style={{
                color: '#fff',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <TagIcon style={{ width: '24px', height: '24px', color: '#ff6b35' }} />
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div style={{ marginBottom: '28px' }}>
                {appliedCoupon ? (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(0,212,170,0.05) 100%)',
                      border: '1px solid rgba(0,212,170,0.3)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#00d4aa' }} />
                      <div>
                        <p style={{ color: '#00d4aa', fontWeight: '700', fontSize: '14px', margin: 0 }}>
                          {appliedCoupon.code}
                        </p>
                        <p style={{ color: '#6b6b6b', fontSize: '12px', margin: '2px 0 0 0' }}>
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={handleRemoveCoupon}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                    >
                      <XMarkIcon style={{ width: '20px', height: '20px', color: '#ff4757' }} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowCouponModal(true)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '2px dashed rgba(255,107,53,0.3)',
                      borderRadius: '14px',
                      padding: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      color: '#ff6b35',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  >
                    <TicketIcon style={{ width: '22px', height: '22px' }} />
                    Apply Coupon Code
                  </motion.button>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ marginBottom: '28px' }}>
                {[
                  { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}`, color: '#fff' },
                  { label: 'Discount', value: discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0', color: '#00d4aa' },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}`, color: shipping === 0 ? '#00d4aa' : '#fff' },
                  { label: 'Tax (5%)', value: `₹${tax.toLocaleString('en-IN')}`, color: '#fff' }
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <span style={{ color: '#a0a0a0', fontSize: '15px' }}>{row.label}</span>
                    <span style={{ color: row.color, fontSize: '15px', fontWeight: '600' }}>{row.value}</span>
                  </div>
                ))}

                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  margin: '20px 0'
                }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>Total</span>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: '#00d4aa',
                      fontSize: '14px',
                      textAlign: 'right',
                      marginTop: '8px',
                      fontWeight: '600'
                    }}
                  >
                    🎉 You're saving ₹{discount.toLocaleString('en-IN')}!
                  </motion.p>
                )}
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(255,107,53,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '20px',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 30px rgba(255,107,53,0.3)'
                }}
              >
                Proceed to Checkout
                <ArrowRightIcon style={{ width: '22px', height: '22px' }} />
              </motion.button>

              {/* Continue Shopping */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  color: '#a0a0a0',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '14px'
                }}
              >
                Continue Shopping
              </motion.button>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '28px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.05)'
              }}>
                {['🔒 Secure', '✅ Verified', '🚚 Fast'].map((badge, i) => (
                  <span key={i} style={{ color: '#6b6b6b', fontSize: '12px' }}>
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {showCouponModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCouponModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                borderRadius: '24px',
                padding: '32px',
                width: '100%',
                maxWidth: '500px',
                zIndex: 2001,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px'
              }}>
                <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                  Apply Coupon
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={() => setShowCouponModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <XMarkIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
                </motion.button>
              </div>

              {/* Manual Input */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '28px'
              }}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const coupon = availableCoupons.find(c => c.code === couponCode);
                    if (coupon) {
                      handleApplyCoupon(coupon);
                    } else {
                      toast.error('Invalid coupon code');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 28px',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </motion.button>
              </div>

              {/* Available Coupons */}
              <p style={{ color: '#6b6b6b', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Available Coupons
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availableCoupons.map((coupon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '14px',
                      padding: '18px',
                      border: '1px dashed rgba(255,255,255,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{
                        color: '#ff6b35',
                        fontWeight: '700',
                        fontSize: '16px',
                        margin: 0,
                        letterSpacing: '1px'
                      }}>
                        {coupon.code}
                      </p>
                      <p style={{ color: '#a0a0a0', fontSize: '13px', margin: '6px 0 0 0' }}>
                        {coupon.description}
                      </p>
                      {coupon.minOrder > 0 && (
                        <p style={{ color: '#6b6b6b', fontSize: '11px', margin: '4px 0 0 0' }}>
                          Min. order: ₹{coupon.minOrder}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApplyCoupon(coupon)}
                      disabled={coupon.minOrder && subtotal < coupon.minOrder}
                      style={{
                        background: coupon.minOrder && subtotal < coupon.minOrder
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(255,107,53,0.15)',
                        border: '1px solid',
                        borderColor: coupon.minOrder && subtotal < coupon.minOrder
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(255,107,53,0.3)',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        color: coupon.minOrder && subtotal < coupon.minOrder
                          ? '#6b6b6b'
                          : '#ff6b35',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: coupon.minOrder && subtotal < coupon.minOrder
                          ? 'not-allowed'
                          : 'pointer'
                      }}
                    >
                      Apply
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;