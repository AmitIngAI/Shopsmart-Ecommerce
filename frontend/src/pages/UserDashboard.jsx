// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BellIcon,
  ShieldCheckIcon,
  MoonIcon,
  GlobeAltIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  XMarkIcon,
  TruckIcon,
  ClockIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  GiftIcon,
  ReceiptPercentIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  StarIcon as StarOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { tab: urlTab } = useParams();
  
  const { 
    user, 
    isAuthenticated,
    logout, 
    cart, 
    wishlist, 
    orders,
    addresses,
    removeFromCart, 
    updateQuantity, 
    removeFromWishlist,
    addToCart,
    clearCart,
    getCartTotal,
    getCartCount,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    moveToCart
  } = useStore();

  const [activeTab, setActiveTab] = useState(urlTab || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '',
    gender: user?.gender || 'male',
    dob: user?.dob || ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      sms: true
    },
    preferences: {
      darkMode: true,
      language: 'en',
      currency: 'INR'
    }
  });

  // New Address Form
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  // Sample orders data (if no orders in store)
  const sampleOrders = orders.length > 0 ? orders : [
    {
      id: 'ORD001234567',
      date: '2024-01-15',
      status: 'delivered',
      total: 2499,
      items: [
        { id: 1, name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', price: 1499, quantity: 1 },
        { id: 2, name: 'Phone Case', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=100', price: 499, quantity: 2 }
      ],
      deliveredDate: '2024-01-18'
    },
    {
      id: 'ORD001234568',
      date: '2024-01-20',
      status: 'shipped',
      total: 15999,
      items: [
        { id: 3, name: 'Smart Watch Pro', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100', price: 15999, quantity: 1 }
      ],
      expectedDelivery: '2024-01-25'
    },
    {
      id: 'ORD001234569',
      date: '2024-01-22',
      status: 'processing',
      total: 3299,
      items: [
        { id: 4, name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100', price: 3299, quantity: 1 }
      ]
    }
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to access dashboard');
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  // Update active tab from URL
  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon, badge: sampleOrders.length },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, badge: wishlist.length },
    { id: 'cart', label: 'Cart', icon: ShoppingCartIcon, badge: getCartCount() },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ];

  // Cart calculations
  const cartSubtotal = getCartTotal();
  const cartDiscount = cart.reduce((sum, item) => sum + ((item.mrp - item.price) * item.quantity), 0);
  const deliveryFee = cartSubtotal > 999 ? 0 : 99;
  const cartTotal = cartSubtotal + deliveryFee;

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  // Add new address
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.pincode || !newAddress.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    addAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({ type: 'Home', name: '', address: '', city: '', state: '', pincode: '', phone: '' });
    toast.success('Address added successfully!');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#00d4aa';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#ffa502';
      case 'cancelled': return '#ff4757';
      default: return '#6b6b6b';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircleIcon;
      case 'shipped': return TruckIcon;
      case 'processing': return ClockIcon;
      case 'cancelled': return XMarkIcon;
      default: return ClockIcon;
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      position: 'relative'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 40px'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Back & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 20px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ArrowLeftIcon style={{ width: '18px', height: '18px' }} />
              Back to Shop
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBagIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ShopSmart
                </h1>
                <p style={{ color: '#6b6b6b', fontSize: '12px' }}>My Account</p>
              </div>
            </div>
          </div>

          {/* User Quick Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,71,87,0.1)',
                border: '1px solid rgba(255,71,87,0.2)',
                borderRadius: '12px',
                padding: '10px 20px',
                color: '#ff4757',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <ArrowRightOnRectangleIcon style={{ width: '18px', height: '18px' }} />
              Logout
            </motion.button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px 8px 8px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{profileData.name}</p>
                <p style={{ color: '#6b6b6b', fontSize: '12px' }}>{profileData.email}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px',
        display: 'flex',
        gap: '40px'
      }}>
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            width: '280px',
            flexShrink: 0
          }}
        >
          {/* User Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.02) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '24px',
            padding: '30px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '800',
                fontSize: '40px',
                boxShadow: '0 10px 40px rgba(99,102,241,0.3)'
              }}>
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  border: '2px solid #6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <CameraIcon style={{ width: '16px', height: '16px', color: '#6366f1' }} />
              </motion.button>
            </div>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {profileData.name}
            </h3>
            <p style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '16px' }}>{profileData.email}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0,212,170,0.1)',
              borderRadius: '50px',
              border: '1px solid rgba(0,212,170,0.2)'
            }}>
              <CheckBadgeIcon style={{ width: '18px', height: '18px', color: '#00d4aa' }} />
              <span style={{ color: '#00d4aa', fontSize: '13px', fontWeight: '600' }}>Verified Account</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)' 
                    : 'transparent',
                  border: activeTab === tab.id 
                    ? '1px solid rgba(99,102,241,0.3)' 
                    : '1px solid transparent',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <tab.icon style={{ 
                    width: '22px', 
                    height: '22px', 
                    color: activeTab === tab.id ? '#fff' : '#6b6b6b' 
                  }} />
                </div>
                <span style={{
                  color: activeTab === tab.id ? '#fff' : '#a0a0a0',
                  fontSize: '15px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  flex: 1,
                  textAlign: 'left'
                }}>
                  {tab.label}
                </span>
                {tab.badge > 0 && (
                  <span style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Quick Stats */}
          <div style={{
            marginTop: '24px',
            padding: '24px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px'
          }}>
            <h4 style={{ color: '#6b6b6b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Quick Stats
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Total Orders', value: sampleOrders.length, icon: ShoppingBagIcon, color: '#3b82f6' },
                { label: 'Wishlist Items', value: wishlist.length, icon: HeartIcon, color: '#ff4757' },
                { label: 'Cart Items', value: getCartCount(), icon: ShoppingCartIcon, color: '#6366f1' },
                { label: 'Reward Points', value: '2,450', icon: GiftIcon, color: '#ffd93d' }
              ].map((stat, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <stat.icon style={{ width: '18px', height: '18px', color: stat.color }} />
                    <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{stat.label}</span>
                  </div>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          <AnimatePresence mode="wait">
            {/* ========== PROFILE TAB ========== */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Profile Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px'
                }}>
                  <div>
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                      My Profile
                    </h2>
                    <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                      Manage your personal information and preferences
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: isEditing 
                        ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' 
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: isEditing 
                        ? '0 4px 20px rgba(0,212,170,0.3)' 
                        : '0 4px 20px rgba(99,102,241,0.3)'
                    }}
                  >
                    {isEditing ? (
                      <>
                        <CheckCircleIcon style={{ width: '18px', height: '18px' }} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <PencilIcon style={{ width: '18px', height: '18px' }} />
                        Edit Profile
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Personal Information Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px',
                  padding: '32px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ 
                    color: '#fff', 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <UserIcon style={{ width: '22px', height: '22px', color: '#6366f1' }} />
                    Personal Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {/* Full Name */}
                    <ProfileField
                      label="Full Name"
                      value={profileData.name}
                      onChange={(val) => setProfileData({...profileData, name: val})}
                      isEditing={isEditing}
                      icon={UserIcon}
                    />
                    
                    {/* Email */}
                    <ProfileField
                      label="Email Address"
                      value={profileData.email}
                      onChange={(val) => setProfileData({...profileData, email: val})}
                      isEditing={isEditing}
                      icon={EnvelopeIcon}
                      verified
                    />
                    
                    {/* Phone */}
                    <ProfileField
                      label="Phone Number"
                      value={profileData.phone || 'Not provided'}
                      onChange={(val) => setProfileData({...profileData, phone: val})}
                      isEditing={isEditing}
                      icon={PhoneIcon}
                      prefix="+91"
                    />
                    
                    {/* Date of Birth */}
                    <ProfileField
                      label="Date of Birth"
                      value={profileData.dob || 'Not provided'}
                      onChange={(val) => setProfileData({...profileData, dob: val})}
                      isEditing={isEditing}
                      icon={CalendarIcon}
                      type="date"
                    />
                    
                    {/* Gender */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                        Gender
                      </label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {['male', 'female', 'other'].map((gender) => (
                          <motion.button
                            key={gender}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => isEditing && setProfileData({...profileData, gender})}
                            disabled={!isEditing}
                            style={{
                              flex: 1,
                              padding: '16px 24px',
                              background: profileData.gender === gender 
                                ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)' 
                                : 'rgba(255,255,255,0.02)',
                              border: profileData.gender === gender 
                                ? '2px solid rgba(99,102,241,0.5)' 
                                : '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '14px',
                              color: profileData.gender === gender ? '#6366f1' : '#a0a0a0',
                              fontSize: '15px',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              cursor: isEditing ? 'pointer' : 'default',
                              opacity: isEditing ? 1 : 0.7
                            }}
                          >
                            {gender}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px',
                  padding: '32px'
                }}>
                  <h3 style={{ 
                    color: '#fff', 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <ShieldCheckIcon style={{ width: '22px', height: '22px', color: '#6366f1' }} />
                    Account Security
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => toast.success('Password reset link sent!')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(99,102,241,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ShieldCheckIcon style={{ width: '24px', height: '24px', color: '#6366f1' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ color: '#fff', fontWeight: '600', marginBottom: '4px' }}>Change Password</p>
                          <p style={{ color: '#6b6b6b', fontSize: '13px' }}>Last changed 30 days ago</p>
                        </div>
                      </div>
                      <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 5 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => toast.success('2FA setup initiated!')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(0,212,170,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <PhoneIcon style={{ width: '24px', height: '24px', color: '#00d4aa' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ color: '#fff', fontWeight: '600' }}>Two-Factor Authentication</p>
                            <span style={{
                              background: 'rgba(0,212,170,0.1)',
                              color: '#00d4aa',
                              fontSize: '11px',
                              fontWeight: '600',
                              padding: '4px 10px',
                              borderRadius: '50px'
                            }}>
                              Recommended
                            </span>
                          </div>
                          <p style={{ color: '#6b6b6b', fontSize: '13px' }}>Add extra security to your account</p>
                        </div>
                      </div>
                      <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== ORDERS TAB ========== */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                    My Orders
                  </h2>
                  <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                    Track and manage your orders
                  </p>
                </div>

                {/* Order Filters */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px',
                  overflowX: 'auto',
                  paddingBottom: '8px'
                }}>
                  {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter, i) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '10px 20px',
                        background: i === 0 ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.05)',
                        border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>

                {/* Orders List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {sampleOrders.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '80px 40px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '24px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <ShoppingBagIcon style={{ width: '80px', height: '80px', color: '#3d3d3d', margin: '0 auto 24px' }} />
                      <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>No Orders Yet</h3>
                      <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>Start shopping to see your orders here</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        style={{
                          padding: '14px 32px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Start Shopping
                      </motion.button>
                    </div>
                  ) : (
                    sampleOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '20px',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Order Header */}
                          <div style={{
                            padding: '20px 24px',
                            background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                padding: '10px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '10px'
                              }}>
                                <p style={{ color: '#6b6b6b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Order ID</p>
                                <p style={{ color: '#fff', fontWeight: '700' }}>{order.id}</p>
                              </div>
                              <div>
                                <p style={{ color: '#6b6b6b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Order Date</p>
                                <p style={{ color: '#fff', fontWeight: '600' }}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 20px',
                              background: `${getStatusColor(order.status)}15`,
                              border: `1px solid ${getStatusColor(order.status)}30`,
                              borderRadius: '50px'
                            }}>
                              <StatusIcon style={{ width: '18px', height: '18px', color: getStatusColor(order.status) }} />
                              <span style={{ 
                                color: getStatusColor(order.status), 
                                fontSize: '14px', 
                                fontWeight: '600',
                                textTransform: 'capitalize'
                              }}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div style={{ padding: '24px' }}>
                            {order.items.map((item, idx) => (
                              <div 
                                key={item.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '20px',
                                  padding: idx > 0 ? '20px 0 0 0' : '0',
                                  borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                  marginTop: idx > 0 ? '20px' : '0'
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    background: '#1a1a1a'
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ color: '#fff', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h4>
                                  <p style={{ color: '#6b6b6b', fontSize: '14px' }}>Qty: {item.quantity}</p>
                                </div>
                                <p style={{ color: '#6366f1', fontWeight: '700', fontSize: '18px' }}>
                                  ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div style={{
                            padding: '20px 24px',
                            background: 'rgba(255,255,255,0.02)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px'
                          }}>
                            <div>
                              {order.status === 'delivered' && (
                                <p style={{ color: '#00d4aa', fontSize: '14px' }}>
                                  ✓ Delivered on {new Date(order.deliveredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                              )}
                              {order.status === 'shipped' && (
                                <p style={{ color: '#3b82f6', fontSize: '14px' }}>
                                  🚚 Expected by {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                              )}
                              {order.status === 'processing' && (
                                <p style={{ color: '#ffa502', fontSize: '14px' }}>
                                  ⏳ Your order is being processed
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <p style={{ color: '#6b6b6b', fontSize: '14px' }}>Total:</p>
                              <p style={{ color: '#fff', fontWeight: '800', fontSize: '20px' }}>
                                ₹{order.total.toLocaleString()}
                              </p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  padding: '10px 24px',
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '10px',
                                  color: '#fff',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                View Details
                                <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* ========== WISHLIST TAB ========== */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                    My Wishlist
                  </h2>
                  <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                    {wishlist.length} items saved for later
                  </p>
                </div>

                {wishlist.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 40px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <HeartIcon style={{ width: '80px', height: '80px', color: '#3d3d3d', margin: '0 auto 24px' }} />
                    <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Your Wishlist is Empty</h3>
                    <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>Save items you love to your wishlist</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/')}
                      style={{
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Explore Products
                    </motion.button>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '24px' 
                  }}>
                    {wishlist.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        {/* Discount Badge */}
                        {item.discount > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            zIndex: 10
                          }}>
                            {item.discount}% OFF
                          </div>
                        )}

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            removeFromWishlist(item.id);
                            toast.success('Removed from wishlist');
                          }}
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255,71,87,0.9)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        >
                          <HeartSolid style={{ width: '20px', height: '20px', color: '#fff' }} />
                        </motion.button>

                        {/* Image */}
                        <div 
                          style={{
                            height: '200px',
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '160px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div style={{ padding: '20px' }}>
                          <h3 style={{ 
                            color: '#fff', 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>

                          {/* Rating */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[...Array(5)].map((_, i) => (
                                <StarSolid 
                                  key={i} 
                                  style={{ 
                                    width: '14px', 
                                    height: '14px', 
                                    color: i < Math.floor(item.rating || 4) ? '#ffd93d' : '#3d3d3d' 
                                  }} 
                                />
                              ))}
                            </div>
                            <span style={{ color: '#6b6b6b', fontSize: '13px' }}>
                              {item.rating || 4.5} ({item.reviews || 100})
                            </span>
                          </div>

                          {/* Price */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '20px' }}>
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.mrp > item.price && (
                              <span style={{ 
                                color: '#6b6b6b', 
                                fontSize: '14px', 
                                textDecoration: 'line-through' 
                              }}>
                                ₹{item.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(item.id);
                              toast.success('Moved to cart!');
                            }}
                            style={{
                              width: '100%',
                              padding: '14px',
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '14px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                          >
                            <ShoppingCartIcon style={{ width: '18px', height: '18px' }} />
                            Move to Cart
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== CART TAB ========== */}
            {activeTab === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                    Shopping Cart
                  </h2>
                  <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                    {getCartCount()} items in your cart
                  </p>
                </div>

                {cart.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 40px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <ShoppingCartIcon style={{ width: '80px', height: '80px', color: '#3d3d3d', margin: '0 auto 24px' }} />
                    <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Your Cart is Empty</h3>
                    <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>Add items to your cart to checkout</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/')}
                      style={{
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Start Shopping
                    </motion.button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Cart Items */}
                    <div style={{ flex: 1, minWidth: '400px' }}>
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            display: 'flex',
                            gap: '24px',
                            padding: '24px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '20px',
                            marginBottom: '16px'
                          }}
                        >
                          {/* Image */}
                          <div 
                            style={{
                              width: '120px',
                              height: '120px',
                              borderRadius: '16px',
                              background: '#1a1a1a',
                              overflow: 'hidden',
                              flexShrink: 0,
                              cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>

                          {/* Details */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <h3 
                                style={{ color: '#fff', fontSize: '18px', fontWeight: '600', cursor: 'pointer' }}
                                onClick={() => navigate(`/product/${item.id}`)}
                              >
                                {item.name}
                              </h3>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  removeFromCart(item.id);
                                  toast.success('Item removed from cart');
                                }}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  background: 'rgba(255,71,87,0.1)',
                                  border: '1px solid rgba(255,71,87,0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <TrashIcon style={{ width: '18px', height: '18px', color: '#ff4757' }} />
                              </motion.button>
                            </div>

                            <p style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '12px' }}>
                              {item.brand || 'Brand'}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                              <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '22px' }}>
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.mrp > item.price && (
                                <>
                                  <span style={{ 
                                    color: '#6b6b6b', 
                                    fontSize: '14px', 
                                    textDecoration: 'line-through' 
                                  }}>
                                    ₹{item.mrp.toLocaleString()}
                                  </span>
                                  <span style={{
                                    background: 'rgba(0,212,170,0.1)',
                                    color: '#00d4aa',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    padding: '4px 10px',
                                    borderRadius: '6px'
                                  }}>
                                    Save ₹{((item.mrp - item.price) * item.quantity).toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Quantity */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ color: '#6b6b6b', fontSize: '14px' }}>Qty:</span>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                padding: '4px'
                              }}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff'
                                  }}
                                >
                                  <MinusIcon style={{ width: '16px', height: '16px' }} />
                                </motion.button>
                                <span style={{ 
                                  color: '#fff', 
                                  fontWeight: '700', 
                                  fontSize: '16px',
                                  minWidth: '40px',
                                  textAlign: 'center'
                                }}>
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff'
                                  }}
                                >
                                  <PlusIcon style={{ width: '16px', height: '16px' }} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{ width: '380px', flexShrink: 0 }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '24px',
                        padding: '28px',
                        position: 'sticky',
                        top: '120px'
                      }}>
                        <h3 style={{ 
                          color: '#fff', 
                          fontSize: '20px', 
                          fontWeight: '700', 
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <ReceiptPercentIcon style={{ width: '24px', height: '24px', color: '#6366f1' }} />
                          Order Summary
                        </h3>

                        {/* Coupon */}
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          marginBottom: '24px'
                        }}>
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            style={{
                              flex: 1,
                              padding: '14px 18px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.success('Coupon applied!')}
                            style={{
                              padding: '14px 20px',
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#fff',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Apply
                          </motion.button>
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ 
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          paddingTop: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#a0a0a0' }}>Subtotal ({getCartCount()} items)</span>
                            <span style={{ color: '#fff', fontWeight: '600' }}>₹{cartSubtotal.toLocaleString()}</span>
                          </div>
                          {cartDiscount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#a0a0a0' }}>Discount</span>
                              <span style={{ color: '#00d4aa', fontWeight: '600' }}>-₹{cartDiscount.toLocaleString()}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#a0a0a0' }}>Delivery</span>
                            <span style={{ color: deliveryFee === 0 ? '#00d4aa' : '#fff', fontWeight: '600' }}>
                              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                            </span>
                          </div>
                        </div>

                        {/* Total */}
                        <div style={{
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          marginTop: '20px',
                          paddingTop: '20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>Total</span>
                          <span style={{ color: '#6366f1', fontSize: '28px', fontWeight: '800' }}>
                            ₹{cartTotal.toLocaleString()}
                          </span>
                        </div>

                        {/* Checkout Button */}
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(99,102,241,0.4)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/checkout')}
                          style={{
                            width: '100%',
                            padding: '18px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            border: 'none',
                            borderRadius: '14px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginTop: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                          }}
                        >
                          Proceed to Checkout
                          <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
                        </motion.button>

                        {/* Security Badge */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '20px',
                          padding: '12px',
                          background: 'rgba(0,212,170,0.05)',
                          borderRadius: '10px'
                        }}>
                          <ShieldCheckIcon style={{ width: '18px', height: '18px', color: '#00d4aa' }} />
                          <span style={{ color: '#00d4aa', fontSize: '13px', fontWeight: '500' }}>
                            100% Secure Payment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== ADDRESSES TAB ========== */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px'
                }}>
                  <div>
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                      Saved Addresses
                    </h2>
                    <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                      Manage your delivery addresses
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddressModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <PlusIcon style={{ width: '18px', height: '18px' }} />
                    Add New Address
                  </motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {addresses.map((addr) => (
                    <motion.div
                      key={addr.id}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        padding: '24px',
                        background: addr.isDefault 
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)' 
                          : 'rgba(255,255,255,0.02)',
                        border: addr.isDefault 
                          ? '2px solid rgba(99,102,241,0.3)' 
                          : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '18px',
                        position: 'relative'
                      }}
                    >
                      {addr.isDefault && (
                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 12px',
                          borderRadius: '50px'
                        }}>
                          DEFAULT
                        </span>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          padding: '8px 16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {addr.type}
                        </div>
                      </div>
                      <p style={{ color: '#fff', fontWeight: '600', marginBottom: '8px' }}>{addr.name}</p>
                      <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
                        {addr.address}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p style={{ color: '#6b6b6b', fontSize: '13px' }}>
                        📞 +91 {addr.phone}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#a0a0a0',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                          onClick={() => toast.success('Edit feature coming soon!')}
                        >
                          Edit
                        </motion.button>
                        {!addr.isDefault && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(99,102,241,0.1)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                borderRadius: '8px',
                                color: '#6366f1',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                setDefaultAddress(addr.id);
                                toast.success('Default address updated!');
                              }}
                            >
                              Set Default
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(255,71,87,0.1)',
                                border: '1px solid rgba(255,71,87,0.2)',
                                borderRadius: '8px',
                                color: '#ff4757',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                deleteAddress(addr.id);
                                toast.success('Address deleted!');
                              }}
                            >
                              Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ========== SETTINGS TAB ========== */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                    Settings
                  </h2>
                  <p style={{ color: '#6b6b6b', fontSize: '15px' }}>
                    Manage your account settings and preferences
                  </p>
                </div>

                {/* Notifications Settings */}
                <SettingsSection
                  title="Notifications"
                  icon={BellIcon}
                  description="Control how you receive notifications"
                >
                  <SettingsToggle
                    label="Order Updates"
                    description="Get notified about your order status"
                    checked={settings.notifications.orderUpdates}
                    onChange={(val) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, orderUpdates: val }
                    })}
                  />
                  <SettingsToggle
                    label="Promotions & Offers"
                    description="Receive promotional emails and offers"
                    checked={settings.notifications.promotions}
                    onChange={(val) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, promotions: val }
                    })}
                  />
                  <SettingsToggle
                    label="Newsletter"
                    description="Weekly newsletter with latest products"
                    checked={settings.notifications.newsletter}
                    onChange={(val) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newsletter: val }
                    })}
                  />
                  <SettingsToggle
                    label="SMS Notifications"
                    description="Receive SMS for important updates"
                    checked={settings.notifications.sms}
                    onChange={(val) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: val }
                    })}
                  />
                </SettingsSection>

                {/* Preferences */}
                <SettingsSection
                  title="Preferences"
                  icon={Cog6ToothIcon}
                  description="Customize your experience"
                >
                  <SettingsToggle
                    label="Dark Mode"
                    description="Use dark theme across the app"
                    checked={settings.preferences.darkMode}
                    onChange={(val) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, darkMode: val }
                    })}
                    icon={MoonIcon}
                  />
                  <SettingsSelect
                    label="Language"
                    description="Choose your preferred language"
                    value={settings.preferences.language}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'hi', label: 'हिंदी' },
                      { value: 'ta', label: 'தமிழ்' }
                    ]}
                    onChange={(val) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: val }
                    })}
                    icon={GlobeAltIcon}
                  />
                </SettingsSection>

                {/* Help & Support */}
                <SettingsSection
                  title="Help & Support"
                  icon={QuestionMarkCircleIcon}
                  description="Get help with your account"
                >
                  <SettingsLink
                    label="FAQs"
                    description="Frequently asked questions"
                    onClick={() => toast.success('Opening FAQs...')}
                  />
                  <SettingsLink
                    label="Contact Support"
                    description="Get in touch with our support team"
                    onClick={() => toast.success('Support chat opened')}
                  />
                  <SettingsLink
                    label="Terms of Service"
                    description="Read our terms and conditions"
                    onClick={() => {}}
                  />
                  <SettingsLink
                    label="Privacy Policy"
                    description="Learn how we handle your data"
                    onClick={() => {}}
                  />
                </SettingsSection>

                {/* Danger Zone */}
                <div style={{
                  background: 'rgba(255,71,87,0.05)',
                  border: '1px solid rgba(255,71,87,0.2)',
                  borderRadius: '24px',
                  padding: '32px',
                  marginTop: '24px'
                }}>
                  <h3 style={{ 
                    color: '#ff4757', 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <ExclamationTriangleIcon style={{ width: '22px', height: '22px' }} />
                    Danger Zone
                  </h3>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '20px' }}>
                    These actions are permanent and cannot be undone
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowLogoutModal(true)}
                      style={{
                        padding: '14px 24px',
                        background: 'rgba(255,71,87,0.1)',
                        border: '1px solid rgba(255,71,87,0.3)',
                        borderRadius: '12px',
                        color: '#ff4757',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Logout from all devices
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast.error('This feature is disabled for demo')}
                      style={{
                        padding: '14px 24px',
                        background: '#ff4757',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '420px',
                width: '90%',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,71,87,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <ArrowRightOnRectangleIcon style={{ width: '40px', height: '40px', color: '#ff4757' }} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Logout?
              </h3>
              <p style={{ color: '#a0a0a0', fontSize: '15px', marginBottom: '32px' }}>
                Are you sure you want to logout from your account?
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: '#ff4757',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddressModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
                Add New Address
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Address Type */}
                <div>
                  <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Address Type
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Home', 'Office', 'Other'].map((type) => (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewAddress({...newAddress, type})}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: newAddress.type === type ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                          border: newAddress.type === type ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: newAddress.type === type ? '#6366f1' : '#a0a0a0',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    placeholder="Enter full name"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    placeholder="10-digit mobile number"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Address */}
                <div>
                  <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Address *
                  </label>
                  <textarea
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    placeholder="House No., Building, Street, Area"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* City & State */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="City"
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      State
                    </label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      placeholder="State"
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label style={{ color: '#6b6b6b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    placeholder="6-digit pincode"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddressModal(false)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddAddress}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Save Address
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ========== HELPER COMPONENTS ==========

// Profile Field Component
const ProfileField = ({ label, value, onChange, isEditing, icon: Icon, type = 'text', prefix, verified }) => (
  <div>
    <label style={{ 
      color: '#6b6b6b', 
      fontSize: '13px', 
      fontWeight: '600', 
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px' 
    }}>
      <Icon style={{ width: '16px', height: '16px' }} />
      {label}
      {verified && (
        <span style={{
          background: 'rgba(0,212,170,0.1)',
          color: '#00d4aa',
          fontSize: '11px',
          fontWeight: '600',
          padding: '2px 8px',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckBadgeIcon style={{ width: '12px', height: '12px' }} />
          Verified
        </span>
      )}
    </label>
    {isEditing ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '14px 0 0 14px',
            color: '#a0a0a0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRight: 'none'
          }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: prefix ? '0 14px 14px 0' : '14px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none'
          }}
        />
      </div>
    ) : (
      <p style={{
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '500'
      }}>
        {prefix && <span style={{ color: '#6b6b6b' }}>{prefix} </span>}
        {value}
      </p>
    )}
  </div>
);

// Settings Section Component
const SettingsSection = ({ title, icon: Icon, description, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '24px'
  }}>
    <h3 style={{ 
      color: '#fff', 
      fontSize: '18px', 
      fontWeight: '700', 
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <Icon style={{ width: '22px', height: '22px', color: '#6366f1' }} />
      {title}
    </h3>
    <p style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '24px' }}>
      {description}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {children}
    </div>
  </div>
);

// Settings Toggle Component
const SettingsToggle = ({ label, description, checked, onChange, icon: Icon }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {Icon && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
        </div>
      )}
      <div>
        <p style={{ color: '#fff', fontWeight: '600', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#6b6b6b', fontSize: '13px' }}>{description}</p>
      </div>
    </div>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(!checked)}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '50px',
        background: checked ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.1)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        style={{
          position: 'absolute',
          top: '2px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      />
    </motion.button>
  </div>
);

// Settings Link Component
const SettingsLink = ({ label, description, onClick, badge }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left'
    }}
  >
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ color: '#fff', fontWeight: '600' }}>{label}</p>
        {badge && (
          <span style={{
            background: 'rgba(0,212,170,0.1)',
            color: '#00d4aa',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '50px'
          }}>
            {badge}
          </span>
        )}
      </div>
      <p style={{ color: '#6b6b6b', fontSize: '13px' }}>{description}</p>
    </div>
    <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
  </motion.button>
);

// Settings Select Component
const SettingsSelect = ({ label, description, value, options, onChange, icon: Icon }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {Icon && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
        </div>
      )}
      <div>
        <p style={{ color: '#fff', fontWeight: '600', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#6b6b6b', fontSize: '13px' }}>{description}</p>
      </div>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        cursor: 'pointer'
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a' }}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default UserDashboard;