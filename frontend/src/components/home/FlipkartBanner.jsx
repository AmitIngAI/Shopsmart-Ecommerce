// src/components/home/FlipkartBanner.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  SparklesIcon,
  FireIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  PlayIcon,
  BoltIcon,
  TruckIcon,
  ShieldCheckIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const banners = [
  {
    id: 1,
    title: 'Summer Collection',
    subtitle: 'Up to 70% Off',
    description: 'Discover the latest trends in fashion with our exclusive summer collection',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accent: '#6366f1',
    category: 'fashion',
    featuredProducts: [
      { id: '17', name: 'Nike Shoes', price: 6995, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
      { id: '15', name: 'Floral Dress', price: 2499, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300' },
      { id: '24', name: 'Ray-Ban', price: 7999, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300' }
    ],
    stats: { products: '500+', discount: '70%', customers: '10K+' }
  },
  {
    id: 2,
    title: 'Tech Gadgets',
    subtitle: 'New Arrivals',
    description: 'Experience the future with cutting-edge technology and smart devices',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    accent: '#ec4899',
    category: 'electronics',
    featuredProducts: [
      { id: '1', name: 'iPhone 15 Pro', price: 134900, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300' },
      { id: '11', name: 'AirPods Pro', price: 24900, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300' },
      { id: '7', name: 'Apple Watch', price: 89900, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300' }
    ],
    stats: { products: '300+', discount: '40%', customers: '25K+' }
  },
  {
    id: 3,
    title: 'Home & Living',
    subtitle: 'Premium Quality',
    description: 'Transform your living space with elegant furniture and decor',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    accent: '#14b8a6',
    category: 'home-&-living',
    featuredProducts: [
      { id: '25', name: 'L-Shaped Sofa', price: 45999, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300' },
      { id: '28', name: 'LED Chandelier', price: 8999, image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300' },
      { id: '30', name: 'Memory Mattress', price: 24999, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' }
    ],
    stats: { products: '200+', discount: '50%', customers: '8K+' }
  },
  {
    id: 4,
    title: 'Flash Sale',
    subtitle: 'Limited Time Only',
    description: 'Grab amazing deals before they\'re gone! Hurry up!',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    accent: '#f59e0b',
    category: 'deals',
    featuredProducts: [
      { id: '65', name: 'Boat Earbuds', price: 999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300' },
      { id: '67', name: 'MI Power Bank', price: 999, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300' },
      { id: '70', name: 'JBL Speaker', price: 1999, image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300' }
    ],
    stats: { products: '100+', discount: '80%', customers: '50K+' },
    isFlashSale: true,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
  }
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isHovered && !isMobile) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, isMobile]);

  useEffect(() => {
    const flashSaleBanner = banners.find(b => b.isFlashSale);
    if (!flashSaleBanner) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = flashSaleBanner.endTime - now;
      
      if (diff > 0) {
        setCountdown({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigateSlide = (dir) => {
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return (prev + 1) % banners.length;
      return (prev - 1 + banners.length) % banners.length;
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleShopNow = () => {
    navigate(`/category/${banners[current].category}`);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const currentBanner = banners[current];

  return (
    <div 
      className="hero-banner-container"
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: '0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Particles - Hidden on Mobile */}
      <div className="particles-container" style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(isMobile ? 5 : 15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              bottom: '-20px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: currentBanner.gradient,
            opacity: 0.95
          }} />
          
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
            src={currentBanner.image}
            alt={currentBanner.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.2
            }}
          />

          {/* Decorative Glow */}
          <div className="decorative-glow" style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />

          {/* Content */}
          <div className="banner-content" style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            zIndex: 5,
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="banner-left-content"
            >
              {/* Flash Sale Timer */}
              {currentBanner.isFlashSale && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flash-sale-timer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    marginBottom: '14px'
                  }}
                >
                  <BoltIcon style={{ width: '16px', height: '16px', color: '#ffd93d' }} />
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '12px' }}>
                    Ends in:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { value: countdown.hours, label: 'H' },
                      { value: countdown.minutes, label: 'M' },
                      { value: countdown.seconds, label: 'S' }
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: '#fff',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        minWidth: '32px',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#f59e0b' }}>
                          {String(item.value).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: '8px', color: '#878787', marginLeft: '1px' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="banner-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  marginBottom: '16px',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <SparklesIcon style={{ width: '16px', height: '16px', color: '#ffd93d' }} />
                </motion.div>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '12px', letterSpacing: '1px' }}>
                  {currentBanner.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="banner-title"
                style={{
                  fontWeight: '900',
                  color: '#fff',
                  lineHeight: 1.05,
                  marginBottom: '16px',
                  textShadow: '2px 4px 40px rgba(0,0,0,0.3)',
                  letterSpacing: '-2px'
                }}
              >
                {currentBanner.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="banner-description"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '24px',
                  lineHeight: 1.6
                }}
              >
                {currentBanner.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="banner-stats"
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '24px'
                }}
              >
                {[
                  { label: 'Products', value: currentBanner.stats.products },
                  { label: 'Up to', value: currentBanner.stats.discount },
                  { label: 'Customers', value: currentBanner.stats.customers }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="stat-value" style={{ fontWeight: '800', color: '#fff' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="banner-buttons"
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 50px rgba(0,0,0,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShopNow}
                  className="shop-now-btn"
                  style={{
                    background: '#fff',
                    color: '#0f0f0f',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ShoppingBagIcon style={{ width: '18px', height: '18px' }} />
                  Shop Now
                  <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/category/${currentBanner.category}`)}
                  className="explore-btn"
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <PlayIcon style={{ width: '16px', height: '16px' }} />
                  Explore
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right - Featured Products (Hidden on Mobile) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="featured-products-section"
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* Glow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(30px)'
                }} />

                {/* Products */}
                {currentBanner.featuredProducts.map((product, index) => {
                  const positions = [
                    { top: '0%', right: '0%', rotate: 5, delay: 0.5, size: 280 },
                    { top: '30%', right: '-10%', rotate: -3, delay: 0.7, size: 160 },
                    { top: '55%', right: '15%', rotate: 8, delay: 0.9, size: 140 }
                  ];
                  const pos = positions[index];

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 50, rotate: pos.rotate }}
                      animate={{ opacity: 1, y: 0, rotate: pos.rotate }}
                      transition={{ delay: pos.delay, type: 'spring' }}
                      whileHover={{ 
                        scale: 1.08, 
                        rotate: 0,
                        zIndex: 20,
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                      }}
                      onClick={() => handleProductClick(product.id)}
                      style={{
                        position: index === 0 ? 'relative' : 'absolute',
                        top: pos.top,
                        right: pos.right,
                        width: `${pos.size}px`,
                        background: '#fff',
                        borderRadius: '20px',
                        padding: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                        zIndex: 10 - index,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: index === 0 ? '200px' : '100px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: '#f5f5f5',
                        marginBottom: '10px'
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <h4 style={{
                        fontSize: index === 0 ? '16px' : '12px',
                        fontWeight: '700',
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
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: index === 0 ? '18px' : '13px',
                          fontWeight: '800',
                          color: currentBanner.accent
                        }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        {index === 0 && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarSolid key={i} style={{ width: '12px', height: '12px', color: '#ffd93d' }} />
                            ))}
                          </div>
                        )}
                      </div>

                      {index === 0 && (
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: currentBanner.gradient,
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '16px',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FireIcon style={{ width: '12px', height: '12px' }} />
                          Hot
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        whileHover={{ scale: 1.15, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateSlide(-1)}
        className="nav-arrow nav-arrow-left"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <ChevronLeftIcon className="nav-arrow-icon" style={{ color: '#fff' }} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.15, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateSlide(1)}
        className="nav-arrow nav-arrow-right"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <ChevronRightIcon className="nav-arrow-icon" style={{ color: '#fff' }} />
      </motion.button>

      {/* Dots */}
      <div className="banner-dots" style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        {banners.map((banner, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="dot-btn"
            style={{
              width: current === i ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: current === i ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {current === i && !isHovered && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 6, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: banners[i].accent,
                  borderRadius: '5px'
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Slide Counter - Hidden on Mobile */}
      <div className="slide-counter" style={{
        position: 'absolute',
        top: '24px',
        right: '60px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: 10
      }}>
        <span style={{ color: '#fff', fontSize: '22px', fontWeight: '800' }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <span style={{ margin: '0 6px' }}>/</span>
        <span>{String(banners.length).padStart(2, '0')}</span>
      </div>

      {/* Bottom Features */}
      <div className="bottom-features" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="features-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {[
            { icon: TruckIcon, text: 'Free Shipping', sub: 'Orders ₹999+' },
            { icon: ShieldCheckIcon, text: 'Secure Payment', sub: '100% Safe' },
            { icon: GiftIcon, text: 'Easy Returns', sub: '30-day Policy' },
            { icon: BoltIcon, text: 'Fast Delivery', sub: '2-3 Days' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="feature-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <div className="feature-icon-box" style={{
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <feature.icon className="feature-icon" style={{ color: '#fff' }} />
              </div>
              <div className="feature-text">
                <div style={{ color: '#fff', fontWeight: '600' }}>
                  {feature.text}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {feature.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .hero-banner-container {
          height: 600px;
        }

        .banner-content {
          padding: 0 60px;
        }

        .banner-left-content {
          flex: 1;
          max-width: 520px;
        }

        .banner-title {
          font-size: 64px;
        }

        .banner-description {
          font-size: 18px;
          max-width: 420px;
        }

        .stat-value {
          font-size: 24px;
        }

        .shop-now-btn {
          padding: 16px 36px;
        }

        .explore-btn {
          padding: 16px 32px;
        }

        .nav-arrow {
          width: 56px;
          height: 56px;
        }

        .nav-arrow-left {
          left: 24px;
        }

        .nav-arrow-right {
          right: 24px;
        }

        .nav-arrow-icon {
          width: 24px;
          height: 24px;
        }

        .bottom-features {
          padding: 16px 0;
        }

        .feature-icon-box {
          width: 42px;
          height: 42px;
        }

        .feature-icon {
          width: 20px;
          height: 20px;
        }

        .feature-text > div:first-child {
          font-size: 13px;
        }

        .feature-text > div:last-child {
          font-size: 11px;
        }

        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .hero-banner-container {
            height: 550px;
          }

          .banner-content {
            padding: 0 40px;
          }

          .banner-title {
            font-size: 52px;
          }

          .banner-description {
            font-size: 16px;
            max-width: 380px;
          }

          .stat-value {
            font-size: 20px;
          }

          .featured-products-section {
            transform: scale(0.85);
            transform-origin: center right;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .hero-banner-container {
            height: 480px;
          }

          .banner-content {
            padding: 0 20px;
            flex-direction: column;
            justify-content: center;
          }

          .banner-left-content {
            max-width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .banner-title {
            font-size: 36px;
            letter-spacing: -1px;
          }

          .banner-description {
            font-size: 14px;
            max-width: 100%;
            margin-bottom: 20px;
          }

          .banner-stats {
            justify-content: center;
            gap: 24px;
          }

          .stat-value {
            font-size: 18px;
          }

          .banner-buttons {
            justify-content: center;
          }

          .shop-now-btn {
            padding: 12px 24px;
            font-size: 13px;
          }

          .explore-btn {
            padding: 12px 20px;
            font-size: 13px;
          }

          .featured-products-section {
            display: none !important;
          }

          .decorative-glow {
            width: 200px !important;
            height: 200px !important;
          }

          .nav-arrow {
            width: 44px;
            height: 44px;
          }

          .nav-arrow-left {
            left: 12px;
          }

          .nav-arrow-right {
            right: 12px;
          }

          .nav-arrow-icon {
            width: 20px;
            height: 20px;
          }

          .slide-counter {
            display: none;
          }

          .banner-dots {
            bottom: 80px;
          }

          .dot-btn {
            width: 8px !important;
            height: 8px !important;
          }

          .dot-btn[style*="width: 32px"] {
            width: 24px !important;
          }

          .bottom-features {
            padding: 12px 16px;
            overflow-x: auto;
          }

          .features-container {
            justify-content: flex-start !important;
            gap: 20px;
            min-width: max-content;
            padding: 0 10px;
          }

          .feature-item {
            flex-shrink: 0;
          }

          .feature-icon-box {
            width: 36px;
            height: 36px;
          }

          .feature-icon {
            width: 18px;
            height: 18px;
          }

          .feature-text > div:first-child {
            font-size: 12px;
          }

          .feature-text > div:last-child {
            font-size: 10px;
          }

          .flash-sale-timer {
            padding: 6px 12px;
          }

          .flash-sale-timer > div > div {
            padding: 2px 4px !important;
            min-width: 28px !important;
          }

          .flash-sale-timer span {
            font-size: 11px !important;
          }

          .banner-badge {
            padding: 6px 14px;
          }

          .banner-badge span {
            font-size: 11px;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .hero-banner-container {
            height: 420px;
          }

          .banner-content {
            padding: 0 16px;
          }

          .banner-title {
            font-size: 28px;
          }

          .banner-description {
            font-size: 13px;
            line-height: 1.5;
          }

          .banner-stats {
            gap: 16px;
            margin-bottom: 20px;
          }

          .stat-value {
            font-size: 16px;
          }

          .shop-now-btn {
            padding: 10px 20px;
            font-size: 12px;
          }

          .explore-btn {
            padding: 10px 16px;
            font-size: 12px;
          }

          .nav-arrow {
            width: 38px;
            height: 38px;
          }

          .nav-arrow-left {
            left: 8px;
          }

          .nav-arrow-right {
            right: 8px;
          }

          .nav-arrow-icon {
            width: 18px;
            height: 18px;
          }

          .banner-dots {
            bottom: 70px;
            gap: 8px;
          }

          .feature-text {
            display: none;
          }

          .feature-icon-box {
            width: 40px;
            height: 40px;
          }

          .features-container {
            justify-content: space-around !important;
            gap: 0;
            min-width: auto;
          }
        }

        /* Hide scrollbar for features */
        .bottom-features::-webkit-scrollbar {
          display: none;
        }
        .bottom-features {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;