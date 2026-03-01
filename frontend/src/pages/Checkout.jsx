import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CreditCardIcon, 
  TruckIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: ''
  });

  // ✅ NEW: Errors State
  const [errors, setErrors] = useState({});
  
  // ✅ NEW: Touched State (show errors only after user interacts)
  const [touched, setTouched] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const tax = Math.round(total * 0.18);
  const finalTotal = total + shipping + tax;

  // ✅ NEW: Validation Rules
  const validationRules = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      messages: {
        required: 'Full name is required',
        minLength: 'Name must be at least 3 characters',
        maxLength: 'Name cannot exceed 50 characters',
        pattern: 'Name should contain only letters'
      }
    },
    phone: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      messages: {
        required: 'Phone number is required',
        pattern: 'Enter valid 10-digit mobile number (starting with 6-9)'
      }
    },
    pincode: {
      required: true,
      pattern: /^[1-9][0-9]{5}$/,
      messages: {
        required: 'Pincode is required',
        pattern: 'Enter valid 6-digit pincode'
      }
    },
    address: {
      required: true,
      minLength: 10,
      maxLength: 200,
      messages: {
        required: 'Address is required',
        minLength: 'Address must be at least 10 characters',
        maxLength: 'Address cannot exceed 200 characters'
      }
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      messages: {
        required: 'City is required',
        minLength: 'City must be at least 2 characters',
        pattern: 'City should contain only letters'
      }
    },
    state: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      messages: {
        required: 'State is required',
        minLength: 'State must be at least 2 characters',
        pattern: 'State should contain only letters'
      }
    }
  };

  // ✅ NEW: Validate Single Field
  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    const trimmedValue = value.trim();

    // Required check
    if (rules.required && !trimmedValue) {
      return rules.messages.required;
    }

    // If empty and not required, skip other validations
    if (!trimmedValue) return '';

    // Min length check
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.messages.minLength;
    }

    // Max length check
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return rules.messages.maxLength;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      return rules.messages.pattern;
    }

    return '';
  };

  // ✅ NEW: Validate All Fields
  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, address[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // ✅ NEW: Handle Input Change with Real-time Validation
  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Special handling for different fields
    switch (field) {
      case 'phone':
        // Only allow digits, max 10
        processedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'pincode':
        // Only allow digits, max 6
        processedValue = value.replace(/\D/g, '').slice(0, 6);
        break;
      case 'name':
      case 'city':
      case 'state':
        // Remove numbers, allow only letters and spaces
        processedValue = value.replace(/[0-9]/g, '');
        break;
      default:
        processedValue = value;
    }

    setAddress({ ...address, [field]: processedValue });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // ✅ NEW: Handle Field Blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, address[field]);
    setErrors({ ...errors, [field]: error });
  };

  // ✅ NEW: Handle Step 1 Continue
  const handleContinueToPayment = () => {
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
      toast.error('Please fill all fields correctly', {
        icon: '⚠️',
        style: {
          background: '#ff4444',
          color: '#fff',
        }
      });
      return;
    }

    setStep(2);
    toast.success('Address saved successfully! ✓');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    setLoading(false);
    toast.success('Order placed successfully! 🎉');
    navigate('/order-success');
  };

  if (cart.length === 0) {
    return (
      <div style={{ 
        background: '#0f0f0f', 
        minHeight: '100vh', 
        paddingTop: '180px',
        paddingBottom: '80px'
      }}>
        <div className="container" style={{ padding: '0 24px', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
            borderRadius: '24px',
            padding: '80px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#a0a0a0', marginBottom: '30px' }}>
              Add items to proceed with checkout
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
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
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh', 
      paddingTop: '180px',
      paddingBottom: '80px'
    }}>
      <div className="container" style={{ padding: '0 24px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: '#fff', 
          marginBottom: '40px' 
        }}>
          Checkout
        </h1>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '50px',
          gap: '20px'
        }}>
          {[
            { num: 1, label: 'Address', icon: MapPinIcon },
            { num: 2, label: 'Payment', icon: CreditCardIcon },
            { num: 3, label: 'Review', icon: CheckCircleIcon }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: step >= s.num 
                    ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                    : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}>
                  <s.icon style={{ width: '24px', height: '24px', color: '#fff' }} />
                </div>
                <span style={{ 
                  color: step >= s.num ? '#ff6b35' : '#6b6b6b', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  width: '80px',
                  height: '2px',
                  background: step > s.num 
                    ? 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%)' 
                    : 'rgba(255,255,255,0.1)',
                  marginTop: '25px',
                  borderRadius: '2px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '40px'
        }}>
          {/* Left Side - Forms */}
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
                  Delivery Address
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* ✅ UPDATED: InputField with validation */}
                  <InputField 
                    label="Full Name" 
                    value={address.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="John Doe"
                    error={touched.name && errors.name}
                    required
                  />
                  <InputField 
                    label="Phone Number" 
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="9876543210"
                    error={touched.phone && errors.phone}
                    required
                    maxLength={10}
                  />
                  <InputField 
                    label="Pincode" 
                    value={address.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    onBlur={() => handleBlur('pincode')}
                    placeholder="400001"
                    error={touched.pincode && errors.pincode}
                    required
                    maxLength={6}
                  />
                  <InputField 
                    label="City" 
                    value={address.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="Mumbai"
                    error={touched.city && errors.city}
                    required
                  />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <InputField 
                      label="Address" 
                      value={address.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="House no, Street, Landmark"
                      error={touched.address && errors.address}
                      required
                    />
                  </div>
                  <InputField 
                    label="State" 
                    value={address.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    onBlur={() => handleBlur('state')}
                    placeholder="Maharashtra"
                    error={touched.state && errors.state}
                    required
                  />
                </div>
                
                {/* ✅ UPDATED: Button with validation */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueToPayment}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '18px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '30px'
                  }}
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
                  Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { id: 'upi', label: 'UPI', desc: 'Pay using UPI apps', icon: '📱' },
                    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '🏦' },
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' }
                  ].map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        background: paymentMethod === method.id 
                          ? 'rgba(255,107,53,0.1)' 
                          : 'rgba(255,255,255,0.03)',
                        borderRadius: '14px',
                        border: paymentMethod === method.id 
                          ? '2px solid #ff6b35' 
                          : '2px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '32px' }}>{method.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>{method.label}</p>
                        <p style={{ color: '#6b6b6b', fontSize: '13px' }}>{method.desc}</p>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: paymentMethod === method.id ? '#ff6b35' : '#3d3d3d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {paymentMethod === method.id && (
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#ff6b35'
                          }} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      padding: '18px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    style={{
                      flex: 2,
                      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '18px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Review Order
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
                  Review Your Order
                </h2>

                {/* Address Summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '20px',
                  borderRadius: '14px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <MapPinIcon style={{ width: '20px', height: '20px', color: '#ff6b35' }} />
                    <span style={{ color: '#fff', fontWeight: '600' }}>Delivery Address</span>
                  </div>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.6 }}>
                    {address.name}, {address.phone}<br />
                    {address.address}, {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                {/* Payment Summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '20px',
                  borderRadius: '14px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCardIcon style={{ width: '20px', height: '20px', color: '#ff6b35' }} />
                    <span style={{ color: '#fff', fontWeight: '600' }}>
                      Payment: {paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    Order Items ({cart.length})
                  </h3>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      marginBottom: '12px'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#252525'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x60/1e1e1e/ff6b35?text=Item';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
                        <p style={{ color: '#6b6b6b', fontSize: '13px' }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ color: '#ff6b35', fontWeight: '600' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      padding: '18px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{
                      flex: 2,
                      background: loading ? '#666' : 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '18px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <LockClosedIcon style={{ width: '20px', height: '20px' }} />
                    {loading ? 'Processing...' : `Place Order • ₹${finalTotal.toLocaleString('en-IN')}`}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div style={{
            background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(255,255,255,0.05)',
            height: 'fit-content',
            position: 'sticky',
            top: '200px'
          }}>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0a0a0' }}>Subtotal ({cart.length} items)</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0a0a0' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#00d4aa' : '#fff', fontWeight: '600' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0a0a0' }}>Tax (18%)</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ 
                height: '1px', 
                background: 'rgba(255,255,255,0.1)', 
                margin: '8px 0' 
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>Total</span>
                <span style={{ 
                  fontSize: '24px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 212, 170, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <TruckIcon style={{ width: '24px', height: '24px', color: '#00d4aa' }} />
              <div>
                <p style={{ color: '#00d4aa', fontSize: '14px', fontWeight: '600' }}>
                  Estimated Delivery
                </p>
                <p style={{ color: '#a0a0a0', fontSize: '13px' }}>
                  3-5 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ UPDATED: Input Field Component with Validation
const InputField = ({ 
  label, 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  error,
  required,
  maxLength 
}) => {
  const hasError = !!error;
  const isValid = !hasError && value && value.trim() !== '';

  return (
    <div>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '4px',
        color: hasError ? '#ff4444' : '#a0a0a0', 
        fontSize: '13px', 
        fontWeight: '500', 
        marginBottom: '8px',
        transition: 'color 0.3s'
      }}>
        {label}
        {required && <span style={{ color: '#ff6b35' }}>*</span>}
      </label>
      
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            background: hasError ? 'rgba(255,68,68,0.1)' : 'rgba(255,255,255,0.05)',
            border: `2px solid ${hasError ? '#ff4444' : isValid ? '#00d4aa' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            padding: '16px',
            paddingRight: '44px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.target.style.borderColor = '#ff6b35';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
            }
          }}
          onBlurCapture={(e) => {
            e.target.style.boxShadow = 'none';
            if (!hasError && !isValid) {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
            }
          }}
        />
        
        {/* Status Icon */}
        <AnimatePresence>
          {(hasError || isValid) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {hasError ? (
                <ExclamationCircleIcon style={{ 
                  width: '20px', 
                  height: '20px', 
                  color: '#ff4444' 
                }} />
              ) : (
                <CheckCircleIcon style={{ 
                  width: '20px', 
                  height: '20px', 
                  color: '#00d4aa' 
                }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            style={{
              color: '#ff4444',
              fontSize: '12px',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ExclamationCircleIcon style={{ width: '14px', height: '14px' }} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;