import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ShareIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/FlipkartProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isMobile, setIsMobile] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.some(item => item.id === product?.id) || false;

  // Generate multiple images (simulated)
  const images = product ? [
    product.image,
    product.image + '?w=500',
    product.image + '?h=500',
    product.image + '?fit=crop'
  ] : [];

  // Get related products
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  // Delivery date calculator
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Load product
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);

      // Save to recently viewed
      if (foundProduct) {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updated = [foundProduct, ...recentlyViewed.filter(p => p.id !== foundProduct.id)].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }, 500);
  }, [id]);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images.length]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close share menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowShareMenu(false);
    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  // Handlers
  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/600x600/1a1a1a/ff6b35?text=${encodeURIComponent(product?.name || 'Product')}`;
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock!');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} item(s) added to cart!`, {
      icon: '🛒',
      style: { background: '#1e1e1e', color: '#fff' }
    });
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock!');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryAvailable(true);
      toast.success('Delivery available at your location!');
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  const shareOptions = [
    { 
      name: 'Copy Link', 
      icon: '🔗', 
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied!');
      }
    },
    { 
      name: 'WhatsApp', 
      icon: '💬', 
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}`);
      }
    },
    { 
      name: 'Facebook', 
      icon: '📘', 
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
      }
    },
    { 
      name: 'Twitter', 
      icon: '🐦', 
      action: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`);
      }
    }
  ];

  // Loading State
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        paddingTop: '180px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,107,53,0.2)',
            borderTopColor: '#ff6b35',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        paddingTop: '180px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '40px'
          }}
        >
          <div style={{
            fontSize: '80px',
            marginBottom: '20px'
          }}>😕</div>
          <h2 style={{
            color: '#fff',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Product Not Found
          </h2>
          <p style={{
            color: '#a0a0a0',
            fontSize: '16px',
            marginBottom: '30px'
          }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              border: 'none',
              borderRadius: '14px',
              padding: '16px 32px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh', 
      paddingTop: '180px',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      <div className="container" style={{ 
        padding: isMobile ? '0 16px' : '0 24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '12px 24px',
            color: '#fff',
            cursor: 'pointer',
            marginBottom: '40px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <ChevronLeftIcon style={{ width: '18px', height: '18px' }} />
          Back to Products
        </motion.button>

        {/* Main Product Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '30px' : '60px',
          marginBottom: '80px'
        }}>
          {/* Left - Images */}
          <div>
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                borderRadius: '24px',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '20px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  zIndex: 2
                }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>
                    {product.discount}% OFF
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                gap: '10px',
                zIndex: 2
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isInWishlist 
                      ? 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)' 
                      : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isInWishlist ? (
                    <HeartIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
                  ) : (
                    <HeartOutline style={{ width: '24px', height: '24px', color: '#fff' }} />
                  )}
                </motion.button>

                <div style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareMenu(!showShareMenu);
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShareIcon style={{ width: '22px', height: '22px', color: '#fff' }} />
                  </motion.button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        style={{
                          position: 'absolute',
                          top: '60px',
                          right: '0',
                          background: '#1e1e1e',
                          borderRadius: '14px',
                          padding: '8px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          minWidth: '180px',
                          zIndex: 100
                        }}
                      >
                        {shareOptions.map((option, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              option.action();
                              setShowShareMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: i < shareOptions.length - 1 ? '4px' : '0',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>{option.icon}</span>
                            {option.name}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: isZoomed ? 1.3 : 1 }}
                onMouseEnter={() => !isMobile && setIsZoomed(true)}
                onMouseLeave={() => !isMobile && setIsZoomed(false)}
                src={images[selectedImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: isMobile ? '300px' : '450px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                  transition: 'transform 0.3s ease'
                }}
                onError={handleImageError}
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    minWidth: '80px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    background: '#1e1e1e',
                    padding: '8px',
                    cursor: 'pointer',
                    border: selectedImage === index 
                      ? '2px solid #ff6b35' 
                      : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={handleImageError}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Brand & Category */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                background: 'rgba(0, 212, 170, 0.15)',
                color: '#00d4aa',
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {product.brand}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: isMobile ? '24px' : '36px',
              fontWeight: '800',
              color: '#fff',
              lineHeight: 1.3,
              marginBottom: '20px'
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #ffd93d 0%, #f7931e 100%)',
                padding: '8px 14px',
                borderRadius: '10px'
              }}>
                <StarIcon style={{ width: '18px', height: '18px', color: '#000' }} />
                <span style={{ color: '#000', fontSize: '16px', fontWeight: '700' }}>
                  {product.rating}
                </span>
              </div>
              <span style={{ color: '#a0a0a0', fontSize: '15px' }}>
                ({product.reviews?.toLocaleString()} reviews)
              </span>
              <span style={{ color: '#00d4aa', fontSize: '14px', fontWeight: '600' }}>
                ✓ Verified Product
              </span>
            </div>

            {/* Low Stock Warning */}
            {product.stock < 10 && product.stock > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 107, 53, 0.1)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>⚡</span>
                <div>
                  <p style={{ color: '#ff6b35', fontWeight: '600', fontSize: '14px' }}>
                    Hurry! Only {product.stock} left in stock
                  </p>
                  <p style={{ color: '#a0a0a0', fontSize: '12px' }}>
                    Order now to avoid missing out!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Out of Stock */}
            {product.stock === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                <p style={{ color: '#ff4757', fontWeight: '700', fontSize: '16px' }}>
                  ❌ Out of Stock
                </p>
                <p style={{ color: '#a0a0a0', fontSize: '13px', marginTop: '4px' }}>
                  This product is currently unavailable
                </p>
              </motion.div>
            )}

            {/* Price */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '30px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: '16px', 
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  fontSize: isMobile ? '32px' : '42px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.mrp && (
                  <span style={{
                    fontSize: isMobile ? '16px' : '20px',
                    color: '#6b6b6b',
                    textDecoration: 'line-through'
                  }}>
                    ₹{product.mrp?.toLocaleString('en-IN')}
                  </span>
                )}
                <span style={{
                  background: 'rgba(0, 212, 170, 0.15)',
                  color: '#00d4aa',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  Save ₹{(product.mrp - product.price)?.toLocaleString('en-IN')}
                </span>
              </div>
              <p style={{ color: '#a0a0a0', fontSize: '13px' }}>
                Inclusive of all taxes. Free shipping on orders above ₹999
              </p>
            </div>

            {/* Delivery Estimate */}
            <div style={{
              background: 'rgba(0, 212, 170, 0.1)',
              border: '1px solid rgba(0, 212, 170, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#00d4aa', fontSize: '14px', fontWeight: '600' }}>
                🚚 Get it by {getDeliveryDate()}
              </p>
              <p style={{ color: '#6b6b6b', fontSize: '12px', marginTop: '4px' }}>
                Order within 12 hours for same-day dispatch
              </p>
            </div>

            {/* Pincode Checker */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Check Delivery Availability
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkDelivery}
                  style={{
                    background: 'rgba(255,107,53,0.15)',
                    border: '2px solid #ff6b35',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    color: '#ff6b35',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Check
                </motion.button>
              </div>
              <AnimatePresence>
                {deliveryAvailable && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ color: '#00d4aa', fontSize: '13px', marginTop: '8px' }}
                  >
                    ✓ Delivery available at {pincode}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '30px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Quantity
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '14px',
                padding: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: quantity <= 1 ? 0.5 : 1
                  }}
                >
                  <MinusIcon style={{ width: '18px', height: '18px', color: '#fff' }} />
                </motion.button>
                <span style={{
                  minWidth: '60px',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: quantity >= product.stock 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: quantity >= product.stock ? 0.5 : 1
                  }}
                >
                  <PlusIcon style={{ width: '18px', height: '18px', color: '#fff' }} />
                </motion.button>
              </div>
              <span style={{ marginLeft: '16px', color: '#00d4aa', fontSize: '14px' }}>
                {product.stock} items in stock
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '40px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <motion.button
                whileHover={product.stock > 0 ? { scale: 1.02, boxShadow: '0 10px 40px rgba(255,107,53,0.4)' } : {}}
                whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  background: product.stock === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,107,53,0.15)',
                  border: `2px solid ${product.stock === 0 ? 'rgba(255,255,255,0.1)' : '#ff6b35'}`,
                  borderRadius: '14px',
                  padding: '18px',
                  color: product.stock === 0 ? '#666' : '#ff6b35',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: product.stock === 0 ? 0.5 : 1
                }}
              >
                <ShoppingBagIcon style={{ width: '22px', height: '22px' }} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={product.stock > 0 ? { scale: 1.02, boxShadow: '0 10px 40px rgba(255,107,53,0.4)' } : {}}
                whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  background: product.stock === 0 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '18px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  opacity: product.stock === 0 ? 0.5 : 1
                }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {[
                { icon: TruckIcon, title: 'Free Delivery', desc: 'Orders above ₹999' },
                { icon: ArrowPathIcon, title: 'Easy Returns', desc: '10 days return policy' },
                { icon: ShieldCheckIcon, title: 'Secure Payment', desc: '100% secure checkout' },
                { icon: CheckCircleIcon, title: 'Genuine Product', desc: 'Verified seller' }
              ].map((feature, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(255,107,53,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <feature.icon style={{ width: '22px', height: '22px', color: '#ff6b35' }} />
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{feature.title}</p>
                    <p style={{ color: '#6b6b6b', fontSize: '12px' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div style={{
          background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
          borderRadius: '24px',
          padding: isMobile ? '24px' : '40px',
          marginBottom: '80px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Tab Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '30px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '20px',
            overflowX: 'auto'
          }}>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '50px',
                  border: 'none',
                  background: activeTab === tab 
                    ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                    : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                  Product Description
                </h3>
                <p style={{ color: '#a0a0a0', lineHeight: 1.8, fontSize: '15px' }}>
                  {product.description || `Experience premium quality with the ${product.name}. This product from ${product.brand} offers 
                  exceptional performance and style. Built with the highest standards, it delivers 
                  outstanding value for your investment. Perfect for everyday use, this product 
                  combines functionality with modern design aesthetics.`}
                </p>
                <ul style={{ marginTop: '20px', color: '#a0a0a0', lineHeight: 2, paddingLeft: '20px' }}>
                  <li>✓ Premium build quality</li>
                  <li>✓ Latest technology features</li>
                  <li>✓ 1 Year manufacturer warranty</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                  Specifications
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '16px' 
                }}>
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Model', value: product.name },
                    { label: 'Category', value: product.category },
                    { label: 'Subcategory', value: product.subcategory },
                    { label: 'Rating', value: `${product.rating} / 5` },
                    { label: 'In Stock', value: product.stock + ' units' },
                    { label: 'Warranty', value: '1 Year' },
                    { label: 'Return Policy', value: '10 Days' }
                  ].map((spec, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px'
                    }}>
                      <span style={{ color: '#6b6b6b' }}>{spec.label}</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                  Customer Reviews
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { name: 'Rahul S.', rating: 5, comment: 'Amazing product! Totally worth the price. Great quality and fast delivery.', date: '2 days ago' },
                    { name: 'Priya M.', rating: 4, comment: 'Good quality, fast delivery. Recommended! Minor packaging issue but product is excellent.', date: '1 week ago' },
                    { name: 'Amit K.', rating: 5, comment: 'Best purchase I made this year! Exceeded my expectations in every way.', date: '2 weeks ago' }
                  ].map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '20px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#fff'
                          }}>
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ color: '#fff', fontWeight: '600' }}>{review.name}</p>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[...Array(5)].map((_, j) => (
                                <StarIcon 
                                  key={j}
                                  style={{ 
                                    width: '14px', 
                                    height: '14px', 
                                    color: j < review.rating ? '#ffd93d' : '#3d3d3d' 
                                  }} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span style={{ color: '#6b6b6b', fontSize: '13px' }}>{review.date}</span>
                      </div>
                      <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.6 }}>{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ 
              color: '#fff', 
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: '800', 
              marginBottom: '30px' 
            }}>
              Related Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? 'repeat(auto-fill, minmax(150px, 1fr))' 
                : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
              zIndex: 999
            }}
          >
            <ChevronUpIcon style={{ width: '28px', height: '28px', color: '#fff' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;