import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GiftIcon,
  TruckIcon,
  ExclamationCircleIcon,
  AtSymbolIcon
} from '@heroicons/react/24/outline';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isMobile, setIsMobile] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!isLogin) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Enter valid 10-digit mobile number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!isLogin && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    toast.loading('Connecting to Google...', { id: 'google' });
    
    setTimeout(() => {
      toast.dismiss('google');
      login({ name: 'Google User', email: 'user@gmail.com' });
      toast.success('Welcome! 🎉');
      setGoogleLoading(false);
      navigate('/');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isLogin) {
      login({ name: formData.email.split('@')[0], email: formData.email });
      toast.success('Welcome back! 🎉');
      setLoading(false);
      navigate('/');
    } else {
      setLoading(false);
      setStep(2);
      toast.success('OTP sent to your phone!');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login({ name: formData.name, email: formData.email, phone: formData.phone });
    toast.success('Account created successfully! 🎉');
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div className="bg-effect-1" style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      <div className="bg-effect-2" style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="auth-branding" style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, transparent 100%)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="back-btn-desktop"
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '12px 24px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <ArrowLeftIcon style={{ width: '18px', height: '18px' }} />
          Back to Home
        </motion.button>

        <div style={{ maxWidth: '500px' }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '50px' }}
          >
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(255,107,53,0.3)'
            }}>
              <ShoppingBagIcon style={{ width: '36px', height: '36px', color: '#fff' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ShopSmart
              </h1>
              <p style={{ color: '#6b6b6b', fontSize: '14px' }}>Premium Shopping Experience</p>
            </div>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '20px'
            }}>
              {isLogin ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#a0a0a0',
              lineHeight: 1.7,
              marginBottom: '50px'
            }}>
              {isLogin 
                ? 'Sign in to access your account, track orders, and enjoy personalized recommendations.'
                : 'Create an account to unlock exclusive deals, faster checkout, and order tracking.'}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {[
              { icon: SparklesIcon, title: 'Exclusive Deals', desc: 'Get access to member-only discounts' },
              { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹999' },
              { icon: GiftIcon, title: 'Reward Points', desc: 'Earn points on every purchase' },
              { icon: ShieldCheckIcon, title: 'Secure Shopping', desc: '100% secure payment guarantee' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255,107,53,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <feature.icon style={{ width: '24px', height: '24px', color: '#ff6b35' }} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>{feature.title}</h4>
                  <p style={{ color: '#6b6b6b', fontSize: '14px' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: '60px',
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} style={{ width: '18px', height: '18px', color: '#ffd93d' }} />
              ))}
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
              "ShopSmart has completely changed my online shopping experience. Fast delivery, 
              great products, and amazing customer service!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700'
              }}>
                R
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '600' }}>Rahul Sharma</p>
                <p style={{ color: '#6b6b6b', fontSize: '13px' }}>Verified Buyer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="auth-form-container" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative'
      }}>
        {/* Mobile Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="back-btn-mobile"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '10px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            zIndex: 10
          }}
        >
          <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
          Back
        </motion.button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="auth-form-wrapper"
              style={{
                width: '100%',
                maxWidth: '480px'
              }}
            >
              {/* Mobile Logo */}
              <div className="mobile-logo" style={{ display: 'none', marginBottom: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 10px 40px rgba(255,107,53,0.3)'
                }}>
                  <ShoppingBagIcon style={{ width: '32px', height: '32px', color: '#fff' }} />
                </div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ShopSmart
                </h1>
              </div>

              {/* Form Header */}
              <div className="form-header" style={{ marginBottom: '40px' }}>
                <h2 className="form-title" style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#fff',
                  marginBottom: '12px'
                }}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ color: '#6b6b6b', fontSize: '16px' }}>
                  {isLogin 
                    ? "Don't have an account? " 
                    : 'Already have an account? '}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: '',
                        agreeTerms: false
                      });
                    }}
                    style={{
                      color: '#ff6b35',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </motion.span>
                </p>
              </div>

              {/* Google Login Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 40px rgba(66,133,244,0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="google-btn"
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  cursor: googleLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  marginBottom: '32px'
                }}
              >
                {googleLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{
                        width: '22px',
                        height: '22px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#4285f4',
                        borderRadius: '50%'
                      }}
                    />
                    <span className="google-btn-text">Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="google-btn-text">Continue with Google</span>
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span className="divider-text" style={{ color: '#6b6b6b', fontSize: '14px' }}>or continue with email</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: '20px' }}
                    >
                      <InputField
                        icon={UserIcon}
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div style={{ marginBottom: '20px' }}>
                  <EmailInputField
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    error={errors.email}
                    placeholder={isLogin ? "Enter your email" : "Enter your email address"}
                    isMobile={isMobile}
                  />
                </div>

                {/* Phone Field */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: '20px' }}
                    >
                      <InputField
                        icon={PhoneIcon}
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: value });
                        }}
                        error={errors.phone}
                        prefix="+91"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password Field */}
                <div style={{ marginBottom: '20px' }}>
                  <InputField
                    icon={LockClosedIcon}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    required
                    rightIcon={
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                      >
                        {showPassword ? (
                          <EyeSlashIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                        ) : (
                          <EyeIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                        )}
                      </motion.button>
                    }
                  />
                </div>

                {/* Confirm Password */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: '20px' }}
                    >
                      <InputField
                        icon={LockClosedIcon}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        error={errors.confirmPassword}
                        required
                        rightIcon={
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                            ) : (
                              <EyeIcon style={{ width: '20px', height: '20px', color: '#6b6b6b' }} />
                            )}
                          </motion.button>
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Me / Forgot Password */}
                {isLogin && (
                  <div className="remember-forgot" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#ff6b35' }} />
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Remember me</span>
                    </label>
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toast.success('Password reset link sent!')}
                      style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Forgot Password?
                    </motion.span>
                  </div>
                )}

                {/* Terms & Conditions */}
                {!isLogin && (
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: '#ff6b35', marginTop: '2px', flexShrink: 0 }}
                      />
                      <span style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.6 }}>
                        I agree to the{' '}
                        <span style={{ color: '#ff6b35', cursor: 'pointer' }}>Terms of Service</span>
                        {' '}and{' '}
                        <span style={{ color: '#ff6b35', cursor: 'pointer' }}>Privacy Policy</span>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p style={{ color: '#ff4757', fontSize: '12px', marginTop: '8px', marginLeft: '32px' }}>
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(255,107,53,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 20px rgba(255,107,53,0.3)'
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%'
                        }}
                      />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </form>

              {/* Password Requirements */}
              {!isLogin && formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="password-requirements"
                  style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '12px' }}>
                    Password Requirements:
                  </p>
                  <div className="requirements-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { check: formData.password.length >= 8, text: 'At least 8 characters' },
                      { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                      { check: /[0-9]/.test(formData.password), text: 'One number' },
                      { check: /[!@#$%^&*]/.test(formData.password), text: 'One special character' }
                    ].map((req, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircleIcon style={{
                          width: '16px',
                          height: '16px',
                          color: req.check ? '#00d4aa' : '#3d3d3d',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '13px', color: req.check ? '#00d4aa' : '#6b6b6b' }}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Mobile Features */}
              <div className="mobile-features" style={{ display: 'none', marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { icon: TruckIcon, text: 'Free Shipping' },
                    { icon: ShieldCheckIcon, text: 'Secure' },
                    { icon: GiftIcon, text: 'Rewards' }
                  ].map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <feature.icon style={{ width: '16px', height: '16px', color: '#ff6b35' }} />
                      <span style={{ color: '#6b6b6b', fontSize: '12px' }}>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* OTP Step */
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="otp-container"
              style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="otp-icon"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  boxShadow: '0 10px 40px rgba(0,212,170,0.3)'
                }}
              >
                <PhoneIcon style={{ width: '48px', height: '48px', color: '#fff' }} />
              </motion.div>

              <h2 className="otp-title" style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
                Verify Your Phone
              </h2>

              <p style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
                We've sent a 6-digit code to<br />
                <span style={{ color: '#fff', fontWeight: '600' }}>+91 {formData.phone}</span>
              </p>

              <div className="otp-inputs" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    whileFocus={{ scale: 1.05, borderColor: '#ff6b35' }}
                    className="otp-input"
                    style={{
                      width: '60px',
                      height: '70px',
                      textAlign: 'center',
                      fontSize: '28px',
                      fontWeight: '700',
                      background: 'rgba(255,255,255,0.05)',
                      border: '2px solid',
                      borderColor: digit ? '#ff6b35' : 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '32px' }}>
                Didn't receive?{' '}
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toast.success('OTP resent!')}
                  style={{ color: '#ff6b35', fontWeight: '600', cursor: 'pointer' }}
                >
                  Resend OTP
                </motion.span>
              </p>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(255,107,53,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px'
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setStep(1)}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  color: '#a0a0a0',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive CSS */}
      <style>{`
        /* Desktop - Default */
        .auth-branding {
          display: flex;
        }
        
        .back-btn-mobile {
          display: none !important;
        }
        
        .mobile-logo {
          display: none !important;
        }
        
        .mobile-features {
          display: none !important;
        }

        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .auth-branding {
            display: none !important;
          }
          
          .auth-form-container {
            flex: 1 !important;
            padding: 40px !important;
          }
          
          .back-btn-mobile {
            display: flex !important;
          }
          
          .mobile-logo {
            display: block !important;
          }
          
          .auth-form-wrapper {
            padding-top: 40px;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .auth-container {
            min-height: 100vh;
            min-height: -webkit-fill-available;
          }
          
          .auth-form-container {
            padding: 24px !important;
            align-items: flex-start !important;
            padding-top: 80px !important;
          }
          
          .auth-form-wrapper {
            padding-top: 20px;
          }
          
          .mobile-logo {
            margin-bottom: 24px !important;
          }
          
          .mobile-logo > div:first-child {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 12px !important;
          }
          
          .mobile-logo > div:first-child svg {
            width: 28px !important;
            height: 28px !important;
          }
          
          .mobile-logo h1 {
            font-size: 24px !important;
          }
          
          .form-header {
            margin-bottom: 28px !important;
            text-align: center;
          }
          
          .form-title {
            font-size: 26px !important;
          }
          
          .form-header p {
            font-size: 14px !important;
          }
          
          .google-btn {
            padding: 14px 20px !important;
            margin-bottom: 24px !important;
          }
          
          .google-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
          
          .google-btn-text {
            font-size: 14px !important;
          }
          
          .divider-text {
            font-size: 12px !important;
          }
          
          .submit-btn {
            padding: 16px !important;
            font-size: 15px !important;
          }
          
          .mobile-features {
            display: block !important;
          }
          
          .back-btn-mobile {
            top: 16px !important;
            left: 16px !important;
            padding: 8px 14px !important;
            font-size: 12px !important;
          }
          
          .bg-effect-1 {
            width: 300px !important;
            height: 300px !important;
            top: -100px !important;
            right: -100px !important;
          }
          
          .bg-effect-2 {
            width: 200px !important;
            height: 200px !important;
            bottom: -50px !important;
            left: -50px !important;
          }
          
          /* OTP Section */
          .otp-icon {
            width: 80px !important;
            height: 80px !important;
            margin-bottom: 24px !important;
          }
          
          .otp-icon svg {
            width: 40px !important;
            height: 40px !important;
          }
          
          .otp-title {
            font-size: 24px !important;
          }
          
          .otp-inputs {
            gap: 8px !important;
          }
          
          .otp-input {
            width: 48px !important;
            height: 56px !important;
            font-size: 22px !important;
            border-radius: 12px !important;
          }
          
          .password-requirements {
            padding: 16px !important;
          }
          
          .remember-forgot {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .auth-form-container {
            padding: 16px !important;
            padding-top: 70px !important;
          }
          
          .mobile-logo {
            margin-bottom: 20px !important;
          }
          
          .mobile-logo > div:first-child {
            width: 44px !important;
            height: 44px !important;
          }
          
          .mobile-logo h1 {
            font-size: 22px !important;
          }
          
          .form-header {
            margin-bottom: 24px !important;
          }
          
          .form-title {
            font-size: 24px !important;
          }
          
          .google-btn {
            padding: 12px 16px !important;
            border-radius: 12px !important;
          }
          
          .submit-btn {
            padding: 14px !important;
            border-radius: 12px !important;
          }
          
          .otp-input {
            width: 42px !important;
            height: 50px !important;
            font-size: 20px !important;
            border-radius: 10px !important;
          }
          
          .otp-inputs {
            gap: 6px !important;
          }
          
          .requirements-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .requirements-grid > div span {
            font-size: 11px !important;
          }
        }

        /* Very Small Mobile - 360px */
        @media (max-width: 360px) {
          .otp-input {
            width: 38px !important;
            height: 46px !important;
            font-size: 18px !important;
          }
          
          .otp-inputs {
            gap: 4px !important;
          }
          
          .form-title {
            font-size: 22px !important;
          }
          
          .requirements-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Safe area for iOS */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .auth-container {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
};

// ✨ BEAUTIFUL EMAIL INPUT FIELD COMPONENT ✨
const EmailInputField = ({ value, onChange, error, placeholder, isMobile }) => {
  const [focused, setFocused] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [showDomains, setShowDomains] = useState(false);

  const popularDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

  const typoMap = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmailcom': 'gmail.com',
    'gmal.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
    'yahoocom': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'icoud.com': 'icloud.com',
    'iclod.com': 'icloud.com'
  };

  const validateEmail = (email) => {
    if (!email) {
      setEmailStatus(null);
      setSuggestion(null);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domain = email.split('@')[1]?.toLowerCase();

    if (domain && typoMap[domain]) {
      setEmailStatus('suggestion');
      setSuggestion(email.split('@')[0] + '@' + typoMap[domain]);
      return;
    }

    if (emailRegex.test(email)) {
      setEmailStatus('valid');
      setSuggestion(null);
    } else if (email.includes('@')) {
      setEmailStatus('invalid');
      setSuggestion(null);
    } else {
      setEmailStatus(null);
      setSuggestion(null);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.includes('@') && !newValue.split('@')[1]) {
      setShowDomains(true);
    } else {
      setShowDomains(false);
    }

    setTimeout(() => validateEmail(newValue), 300);
  };

  const applySuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
      setEmailStatus('valid');
      setSuggestion(null);
    }
  };

  const selectDomain = (domain) => {
    const username = value.split('@')[0];
    onChange(username + '@' + domain);
    setShowDomains(false);
    setEmailStatus('valid');
  };

  const getBorderColor = () => {
    if (error) return '#ff4757';
    if (focused) return '#ff6b35';
    if (emailStatus === 'valid') return '#00d4aa';
    if (emailStatus === 'invalid' || emailStatus === 'suggestion') return '#ffa502';
    return 'rgba(255,255,255,0.1)';
  };

  const getIconBgColor = () => {
    if (focused) return 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(255,107,53,0.1) 100%)';
    if (emailStatus === 'valid') return 'linear-gradient(135deg, rgba(0,212,170,0.2) 0%, rgba(0,212,170,0.1) 100%)';
    return 'rgba(255,255,255,0.05)';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Label */}
      <motion.label
        animate={{
          top: focused || value ? '-10px' : '50%',
          fontSize: focused || value ? '12px' : '16px',
          color: focused ? '#ff6b35' : emailStatus === 'valid' ? '#00d4aa' : '#6b6b6b',
          background: focused || value ? '#0f0f0f' : 'transparent',
          padding: focused || value ? '0 8px' : '0'
        }}
        className="email-label"
        style={{
          position: 'absolute',
          left: '70px',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 10,
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
      >
        Email Address <span style={{ color: '#ff4757' }}>*</span>
      </motion.label>

      {/* Main Input Container */}
      <motion.div
        animate={{
          borderColor: getBorderColor(),
          boxShadow: focused 
            ? `0 0 0 4px ${emailStatus === 'valid' ? 'rgba(0,212,170,0.1)' : 'rgba(255,107,53,0.1)'}` 
            : 'none'
        }}
        className="email-input-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid',
          borderRadius: '18px',
          padding: '6px',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,107,53,0.03) 0%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Icon Container */}
        <motion.div
          animate={{
            background: getIconBgColor(),
            scale: focused ? 1.05 : 1
          }}
          className="email-icon-box"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '14px',
            transition: 'all 0.3s ease',
            position: 'relative',
            flexShrink: 0
          }}
        >
          <motion.div
            animate={{ rotate: focused ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            {emailStatus === 'valid' ? (
              <CheckBadgeIcon className="email-icon" style={{ width: '26px', height: '26px', color: '#00d4aa' }} />
            ) : (
              <EnvelopeIcon className="email-icon" style={{ 
                width: '26px', 
                height: '26px', 
                color: focused ? '#ff6b35' : '#6b6b6b',
                transition: 'all 0.3s ease'
              }} />
            )}
          </motion.div>
        </motion.div>

        {/* Input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="email"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setShowDomains(false), 200);
            }}
            placeholder={focused ? placeholder : ''}
            className="email-input"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '16px 0',
              fontSize: '16px',
              color: '#fff',
              fontWeight: '500',
              letterSpacing: '0.3px'
            }}
          />
        </div>

        {/* Status Icon */}
        <div style={{ paddingRight: '12px' }}>
          <AnimatePresence mode="wait">
            {emailStatus === 'valid' && (
              <motion.div
                key="valid"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="status-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0,212,170,0.2) 0%, rgba(0,212,170,0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircleIcon style={{ width: '22px', height: '22px', color: '#00d4aa' }} />
              </motion.div>
            )}
            {(emailStatus === 'invalid' || error) && (
              <motion.div
                key="invalid"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="status-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,71,87,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ExclamationCircleIcon style={{ width: '22px', height: '22px', color: '#ff4757' }} />
              </motion.div>
            )}
            {emailStatus === 'suggestion' && (
              <motion.div
                key="suggestion"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="status-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,165,2,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ExclamationCircleIcon style={{ width: '22px', height: '22px', color: '#ffa502' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Domain Suggestions Dropdown */}
      <AnimatePresence>
        {showDomains && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="domain-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'rgba(30,30,30,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 100,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ color: '#6b6b6b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Popular Domains
              </p>
            </div>
            {popularDomains.map((domain, i) => (
              <motion.div
                key={domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ background: 'rgba(255,107,53,0.1)' }}
                onClick={() => selectDomain(domain)}
                className="domain-item"
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <AtSymbolIcon style={{ width: '18px', height: '18px', color: '#ff6b35' }} />
                <span style={{ color: '#fff', fontSize: '15px' }}>
                  {value.split('@')[0]}@<span style={{ color: '#ff6b35', fontWeight: '600' }}>{domain}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typo Suggestion Card */}
      <AnimatePresence>
        {emailStatus === 'suggestion' && suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="suggestion-card"
            style={{
              marginTop: '12px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(255,165,2,0.1) 0%, rgba(255,107,53,0.05) 100%)',
              borderRadius: '14px',
              border: '1px solid rgba(255,165,2,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255,165,2,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <SparklesIcon style={{ width: '20px', height: '20px', color: '#ffa502' }} />
              </div>
              <div>
                <p style={{ color: '#ffa502', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                  Did you mean?
                </p>
                <p className="suggestion-text" style={{ color: '#fff', fontSize: '15px', fontWeight: '500', wordBreak: 'break-all' }}>
                  {suggestion}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applySuggestion}
              style={{
                background: 'linear-gradient(135deg, #ffa502 0%, #ff6b35 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255,165,2,0.3)',
                flexShrink: 0
              }}
            >
              Apply
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valid Email Message */}
      <AnimatePresence>
        {emailStatus === 'valid' && !error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{
              marginTop: '10px',
              marginLeft: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircleIcon style={{ width: '16px', height: '16px', color: '#00d4aa' }} />
            <span style={{ color: '#00d4aa', fontSize: '13px', fontWeight: '500' }}>
              Valid email address
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{
              marginTop: '10px',
              marginLeft: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ExclamationCircleIcon style={{ width: '16px', height: '16px', color: '#ff4757' }} />
            <span style={{ color: '#ff4757', fontSize: '13px', fontWeight: '500' }}>
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Input Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .email-label {
            left: 60px !important;
            font-size: 14px !important;
          }
          
          .email-icon-box {
            width: 44px !important;
            height: 44px !important;
            margin-right: 10px !important;
          }
          
          .email-icon {
            width: 22px !important;
            height: 22px !important;
          }
          
          .email-input {
            font-size: 15px !important;
            padding: 14px 0 !important;
          }
          
          .email-input-container {
            border-radius: 14px !important;
          }
          
          .status-icon {
            width: 32px !important;
            height: 32px !important;
          }
          
          .status-icon svg {
            width: 18px !important;
            height: 18px !important;
          }
          
          .domain-dropdown {
            border-radius: 12px !important;
          }
          
          .domain-item {
            padding: 12px 16px !important;
          }
          
          .suggestion-card {
            padding: 14px 16px !important;
          }
          
          .suggestion-text {
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          .email-label {
            left: 54px !important;
            font-size: 13px !important;
          }
          
          .email-icon-box {
            width: 40px !important;
            height: 40px !important;
            border-radius: 10px !important;
          }
          
          .email-icon {
            width: 20px !important;
            height: 20px !important;
          }
          
          .email-input {
            font-size: 14px !important;
            padding: 12px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Standard Input Field Component
const InputField = ({ icon: Icon, type, placeholder, value, onChange, error, rightIcon, prefix, required }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div>
      <motion.div 
        animate={{
          borderColor: error ? '#ff4757' : focused ? '#ff6b35' : 'rgba(255,255,255,0.1)',
          boxShadow: focused ? '0 0 0 4px rgba(255,107,53,0.1)' : 'none'
        }}
        className="input-field-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid',
          borderRadius: '18px',
          padding: '6px',
          transition: 'all 0.3s ease'
        }}
      >
        <motion.div
          animate={{
            background: focused ? 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(255,107,53,0.1) 100%)' : 'rgba(255,255,255,0.05)',
            scale: focused ? 1.05 : 1
          }}
          className="input-icon-box"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '14px',
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          <Icon className="input-icon" style={{ 
            width: '24px', 
            height: '24px', 
            color: focused ? '#ff6b35' : '#6b6b6b',
            transition: 'all 0.3s ease'
          }} />
        </motion.div>
        
        {prefix && (
          <span style={{ 
            color: '#a0a0a0', 
            marginRight: '8px', 
            fontSize: '16px', 
            fontWeight: '600' 
          }}>
            {prefix}
          </span>
        )}
        
        <input
          type={type}
          placeholder={placeholder + (required ? ' *' : '')}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="text-input"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '16px 0',
            fontSize: '16px',
            color: '#fff',
            fontWeight: '500',
            minWidth: 0
          }}
        />
        {rightIcon}
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            color: '#ff4757', 
            fontSize: '13px', 
            marginTop: '10px', 
            marginLeft: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ExclamationCircleIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          {error}
        </motion.p>
      )}

      {/* Input Field Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .input-field-container {
            border-radius: 14px !important;
          }
          
          .input-icon-box {
            width: 44px !important;
            height: 44px !important;
            margin-right: 10px !important;
          }
          
          .input-icon {
            width: 20px !important;
            height: 20px !important;
          }
          
          .text-input {
            font-size: 15px !important;
            padding: 14px 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .input-icon-box {
            width: 40px !important;
            height: 40px !important;
            border-radius: 10px !important;
          }
          
          .input-icon {
            width: 18px !important;
            height: 18px !important;
          }
          
          .text-input {
            font-size: 14px !important;
            padding: 12px 0 !important;
          }
          
          .text-input::placeholder {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;