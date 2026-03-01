import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../search/SearchBar';
import { 
  ShoppingBagIcon,
  UserCircleIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  MapPinIcon,
  GiftIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  ShoppingBagIcon as ShoppingBagSolid,
  HeartIcon as HeartSolid 
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../../store/store';
import toast from 'react-hot-toast';

const ShopSmartHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount, wishlist, user, isAuthenticated, logout, orders } = useStore();
  const cartCount = getCartCount();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenu(false);
    setShowUserMenu(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenu]);

  const categories = [
    { name: 'New Arrivals', icon: '✨', hot: true },
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home & Living', icon: '🏠' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Deals', icon: '🔥', hot: true }
  ];

  // User menu items - Navigate to Dashboard tabs
  const userMenuItems = [
    { 
      label: 'My Profile', 
      icon: UserIcon, 
      tab: 'profile',
      color: '#ff6b35',
      description: 'Manage your account'
    },
    { 
      label: 'My Orders', 
      icon: ShoppingBagIcon, 
      tab: 'orders',
      color: '#f7931e',
      description: 'Track your orders',
      badge: orders?.length || 0
    },
    { 
      label: 'My Wishlist', 
      icon: HeartIcon, 
      tab: 'wishlist',
      color: '#ff4757',
      description: 'Items you saved',
      badge: wishlist?.length || 0
    },
    { 
      label: 'My Cart', 
      icon: ShoppingBagIcon, 
      tab: 'cart',
      color: '#00d4aa',
      description: 'Ready to checkout',
      badge: cartCount
    },
    { 
      label: 'Addresses', 
      icon: MapPinIcon, 
      tab: 'addresses',
      color: '#3b82f6',
      description: 'Saved addresses'
    },
    { 
      label: 'Settings', 
      icon: Cog6ToothIcon, 
      tab: 'settings',
      color: '#8b5cf6',
      description: 'Account settings'
    },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenu(false);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const navigateToDashboard = (tab) => {
    navigate(`/dashboard/${tab}`);
    setShowUserMenu(false);
    setMobileMenu(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled 
            ? 'rgba(15, 15, 15, 0.98)' 
            : 'linear-gradient(to bottom, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {/* Top Bar - Promotional Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradientMove 3s ease infinite',
          padding: '8px 16px',
          textAlign: 'center'
        }}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <motion.p
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="promo-text"
              style={{
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: 0
              }}
            >
              <BoltIcon style={{ width: '14px', height: '14px' }} />
              FREE SHIPPING above ₹999
              <span className="promo-divider" style={{ color: 'rgba(255,255,255,0.5)', margin: '0 8px' }}>|</span>
              <GiftIcon style={{ width: '14px', height: '14px' }} />
              Code: <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                fontWeight: '700'
              }}>WELCOME10</span>
            </motion.p>
          </motion.div>
        </div>

        {/* Main Header */}
        <div style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Bars3Icon style={{ width: '22px', height: '22px', color: '#fff' }} />
          </motion.button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
              position: 'relative'
            }}>
              <ShoppingBagIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
            </div>
            <div className="logo-text">
              <h1 style={{
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
                margin: 0
              }}>
                ShopSmart
              </h1>
              <p style={{
                fontSize: '9px',
                color: '#6b6b6b',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                margin: 0
              }}>
                Premium Shopping
              </p>
            </div>
          </motion.div>

          {/* Search Bar - Desktop */}
          <div className="desktop-search" style={{ flex: 1, maxWidth: '600px' }}>
            <SearchBar />
          </div>

          {/* Mobile Search Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMobileSearch(true)}
            className="mobile-search-btn"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            <MagnifyingGlassIcon style={{ width: '22px', height: '22px', color: '#fff' }} />
          </motion.button>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Wishlist - Hidden on small mobile */}
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isAuthenticated ? navigate('/dashboard/wishlist') : navigate('/auth')}
              className="action-btn wishlist-btn"
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                background: wishlist.length > 0 
                  ? 'rgba(255, 71, 87, 0.1)' 
                  : 'rgba(255,255,255,0.05)',
                border: wishlist.length > 0 
                  ? '1px solid rgba(255, 71, 87, 0.2)' 
                  : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease'
              }}
            >
              {wishlist.length > 0 ? (
                <HeartSolid style={{ width: '22px', height: '22px', color: '#ff4757' }} />
              ) : (
                <HeartIcon style={{ width: '22px', height: '22px', color: '#a0a0a0' }} />
              )}
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ff4757',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    border: '2px solid #0f0f0f'
                  }}
                >
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </motion.span>
              )}
            </motion.div>

            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                background: cartCount > 0 
                  ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                  : 'rgba(255,255,255,0.05)',
                border: cartCount > 0 
                  ? 'none' 
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: cartCount > 0 ? '0 4px 20px rgba(255, 107, 53, 0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {cartCount > 0 ? (
                <ShoppingBagSolid style={{ width: '22px', height: '22px', color: '#fff' }} />
              ) : (
                <ShoppingBagIcon style={{ width: '22px', height: '22px', color: '#a0a0a0' }} />
              )}
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#fff',
                    color: '#ff6b35',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '800',
                    border: '2px solid #ff6b35'
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </motion.div>

            {/* User - Authenticated */}
            {isAuthenticated ? (
              <div className="user-menu-container" style={{ position: 'relative' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="user-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '6px 14px 6px 6px',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(247,147,30,0.1) 100%)',
                    border: '1px solid rgba(255,107,53,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: '#fff',
                    boxShadow: '0 2px 10px rgba(255,107,53,0.4)'
                  }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-info">
                    <p style={{ 
                      color: '#fff', 
                      fontWeight: '600', 
                      fontSize: '13px', 
                      margin: 0,
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p style={{ 
                      color: '#6b6b6b', 
                      fontSize: '10px', 
                      margin: 0 
                    }}>
                      My Account
                    </p>
                  </div>
                </motion.div>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        marginTop: '12px',
                        background: 'linear-gradient(145deg, #1a1a1a 0%, #121212 100%)',
                        borderRadius: '20px',
                        padding: '8px',
                        minWidth: '280px',
                        zIndex: 1001,
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset'
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
                        borderRadius: '14px',
                        marginBottom: '8px',
                        border: '1px solid rgba(255,107,53,0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '20px',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(255,107,53,0.4)'
                          }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <p style={{ 
                                color: '#fff', 
                                fontWeight: '700', 
                                fontSize: '16px', 
                                margin: 0 
                              }}>
                                {user?.name || 'User'}
                              </p>
                              <CheckBadgeIcon style={{ width: '18px', height: '18px', color: '#00d4aa' }} />
                            </div>
                            <p style={{ 
                              color: '#6b6b6b', 
                              fontSize: '13px', 
                              margin: '4px 0 0 0',
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {user?.email || 'user@email.com'}
                            </p>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '16px'
                        }}>
                          <div style={{
                            flex: 1,
                            padding: '10px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <p style={{ color: '#ff6b35', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                              {orders?.length || 0}
                            </p>
                            <p style={{ color: '#6b6b6b', fontSize: '10px', margin: 0 }}>Orders</p>
                          </div>
                          <div style={{
                            flex: 1,
                            padding: '10px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <p style={{ color: '#ff4757', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                              {wishlist?.length || 0}
                            </p>
                            <p style={{ color: '#6b6b6b', fontSize: '10px', margin: 0 }}>Wishlist</p>
                          </div>
                          <div style={{
                            flex: 1,
                            padding: '10px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <p style={{ color: '#00d4aa', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                              {cartCount}
                            </p>
                            <p style={{ color: '#6b6b6b', fontSize: '10px', margin: 0 }}>Cart</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '4px 0' }}>
                        {userMenuItems.map((item, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                            onClick={() => navigateToDashboard(item.tab)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                          >
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: `${item.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ 
                                color: '#fff', 
                                fontWeight: '600', 
                                fontSize: '13px', 
                                margin: 0 
                              }}>
                                {item.label}
                              </p>
                              <p style={{ 
                                color: '#6b6b6b', 
                                fontSize: '11px', 
                                margin: '2px 0 0 0' 
                              }}>
                                {item.description}
                              </p>
                            </div>
                            {item.badge > 0 && (
                              <span style={{
                                background: `${item.color}20`,
                                color: item.color,
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '4px 8px',
                                borderRadius: '50px'
                              }}>
                                {item.badge}
                              </span>
                            )}
                            <ChevronRightIcon style={{ width: '14px', height: '14px', color: '#4d4d4d' }} />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Divider */}
                      <div style={{ 
                        height: '1px', 
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', 
                        margin: '8px 16px' 
                      }} />
                      
                      {/* Logout Button */}
                      <motion.div
                        whileHover={{ x: 5, background: 'rgba(255,71,87,0.1)' }}
                        onClick={handleLogout}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: 'rgba(255,71,87,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ArrowRightOnRectangleIcon style={{ width: '18px', height: '18px', color: '#ff4757' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#ff4757', fontWeight: '600', fontSize: '13px', margin: 0 }}>
                            Logout
                          </p>
                          <p style={{ color: '#6b6b6b', fontSize: '11px', margin: '2px 0 0 0' }}>
                            Sign out of your account
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In Button - Not Authenticated */
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(255, 107, 53, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="signin-btn"
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <UserCircleIcon style={{ width: '18px', height: '18px' }} />
                <span className="signin-text">Sign In</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <div className="category-nav" style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            overflowX: 'auto',
            maxWidth: '1400px',
            margin: '0 auto'
          }} className="category-scroll">
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate(`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`);
                }}
                style={{
                  background: cat.hot 
                    ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                    : 'rgba(255,255,255,0.05)',
                  border: cat.hot 
                    ? 'none' 
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '50px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: cat.hot ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
                {cat.hot && <SparklesIcon style={{ width: '12px', height: '12px' }} />}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 1100,
              padding: '20px',
              paddingTop: '80px'
            }}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileSearch(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                padding: '12px',
                cursor: 'pointer'
              }}
            >
              <XMarkIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
            </motion.button>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <SearchBar autoFocus onSearch={() => setShowMobileSearch(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 1050
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '320px',
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
                zIndex: 1051,
                overflowY: 'auto',
                borderRight: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Mobile Menu Header */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingBagIcon style={{ width: '22px', height: '22px', color: '#fff' }} />
                    </div>
                    <div>
                      <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                        ShopSmart
                      </h2>
                      <p style={{ color: '#6b6b6b', fontSize: '10px', margin: 0 }}>Premium Shopping</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenu(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <XMarkIcon style={{ width: '22px', height: '22px', color: '#fff' }} />
                  </motion.button>
                </div>

                {/* User Info in Mobile */}
                {isAuthenticated ? (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setMobileMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#fff'
                    }}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontWeight: '600', margin: 0, fontSize: '14px' }}>{user?.name || 'User'}</p>
                      <p style={{ color: '#6b6b6b', fontSize: '12px', margin: 0 }}>View Profile</p>
                    </div>
                    <ChevronRightIcon style={{ width: '18px', height: '18px', color: '#6b6b6b' }} />
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <UserCircleIcon style={{ width: '20px', height: '20px' }} />
                    Sign In / Register
                  </motion.button>
                )}
              </div>

              {/* Quick Actions - Mobile */}
              {isAuthenticated && (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate('/dashboard/orders');
                        setMobileMenu(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 10px',
                        background: 'rgba(255,107,53,0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,107,53,0.2)'
                      }}
                    >
                      <ShoppingBagIcon style={{ width: '22px', height: '22px', color: '#ff6b35', margin: '0 auto 6px' }} />
                      <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600', margin: 0 }}>Orders</p>
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate('/dashboard/wishlist');
                        setMobileMenu(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 10px',
                        background: 'rgba(255,71,87,0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,71,87,0.2)',
                        position: 'relative'
                      }}
                    >
                      <HeartIcon style={{ width: '22px', height: '22px', color: '#ff4757', margin: '0 auto 6px' }} />
                      <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600', margin: 0 }}>Wishlist</p>
                      {wishlist.length > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#ff4757',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '50px'
                        }}>
                          {wishlist.length}
                        </span>
                      )}
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate('/cart');
                        setMobileMenu(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 10px',
                        background: 'rgba(0,212,170,0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '1px solid rgba(0,212,170,0.2)',
                        position: 'relative'
                      }}
                    >
                      <ShoppingBagIcon style={{ width: '22px', height: '22px', color: '#00d4aa', margin: '0 auto 6px' }} />
                      <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600', margin: 0 }}>Cart</p>
                      {cartCount > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#00d4aa',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '50px'
                        }}>
                          {cartCount}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ 
                  color: '#6b6b6b', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  marginBottom: '12px' 
                }}>
                  Shop by Category
                </p>
                {categories.map((cat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`);
                      setMobileMenu(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#fff',
                      marginBottom: '4px',
                      background: cat.hot ? 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)' : 'transparent',
                      border: cat.hot ? '1px solid rgba(255,107,53,0.2)' : '1px solid transparent'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                    <span style={{ fontWeight: '500', flex: 1, fontSize: '14px' }}>{cat.name}</span>
                    {cat.hot && <SparklesIcon style={{ width: '16px', height: '16px', color: '#ff6b35' }} />}
                    <ChevronRightIcon style={{ width: '16px', height: '16px', color: '#4d4d4d' }} />
                  </motion.div>
                ))}
              </div>

              {/* Settings & Logout for Authenticated Users */}
              {isAuthenticated && (
                <div style={{ padding: '0 20px 20px' }}>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
                  
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setMobileMenu(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#fff',
                      marginBottom: '8px'
                    }}
                  >
                    <Cog6ToothIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>Settings</span>
                  </motion.div>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#ff4757',
                      background: 'rgba(255,71,87,0.1)'
                    }}
                  >
                    <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>Logout</span>
                  </motion.div>
                </div>
              )}

              {/* Bottom Info */}
              <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: 'auto',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TruckIcon style={{ width: '16px', height: '16px', color: '#00d4aa' }} />
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>Free delivery above ₹999</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheckIcon style={{ width: '16px', height: '16px', color: '#00d4aa' }} />
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>100% Secure payment</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <GiftIcon style={{ width: '16px', height: '16px', color: '#ff6b35' }} />
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>Earn rewards on every order</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="header-spacer" style={{ height: '160px' }} />

      {/* CSS Animations and Responsive Styles */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Hide scrollbar but allow scrolling */
        .category-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        
        /* Desktop - Full view */
        @media (min-width: 1025px) {
          .mobile-menu-btn,
          .mobile-search-btn {
            display: none !important;
          }
        }
        
        /* Tablet - 768px to 1024px */
        @media (max-width: 1024px) {
          .logo-text {
            display: none;
          }
          .user-info {
            display: none;
          }
          .desktop-search {
            flex: 1;
            max-width: none;
          }
        }
        
        /* Mobile - Below 768px */
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-search-btn {
            display: flex !important;
          }
          .desktop-search {
            display: none !important;
          }
          .category-nav {
            display: none;
          }
          .header-spacer {
            height: 110px !important;
          }
          .wishlist-btn {
            display: none !important;
          }
          .signin-btn {
            padding: 10px 14px !important;
          }
          .signin-text {
            display: none;
          }
          .user-btn {
            padding: 6px !important;
            border-radius: 50% !important;
          }
          .user-btn .user-info {
            display: none !important;
          }
          .promo-divider {
            display: none;
          }
          .promo-text {
            font-size: 11px !important;
          }
        }
        
        /* Small Mobile - Below 480px */
        @media (max-width: 480px) {
          .header-spacer {
            height: 100px !important;
          }
          .action-btn {
            padding: 8px !important;
          }
          .action-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
        
        /* Custom scrollbar for menu */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
        }
      `}</style>
    </>
  );
};

export default ShopSmartHeader;