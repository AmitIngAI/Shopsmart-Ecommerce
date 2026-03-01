import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  CheckIcon,
  ChevronRightIcon,
  StarIcon,
  TagIcon,
  CreditCardIcon,
  ArrowPathIcon,
  GiftIcon,
  BoltIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid, 
  StarIcon as StarSolid,
  CheckCircleIcon 
} from '@heroicons/react/24/solid';
import { products } from '../data/products';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useStore();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);

  // Helper function for wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Load product when ID changes
  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1);
      setSelectedImage(0);
      setShowFullDescription(false);
      setSelectedTab('description');
      
      // Get related products
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 8);
      setRelatedProducts(related);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      toast.error('Product not found');
    }
  }, [id, navigate]);

  // Generate multiple images for gallery
  const productImages = product ? [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image
  ] : [];

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#22c55e' }} />
          <div>
            <p style={{ fontWeight: '600', margin: 0 }}>Added to Cart!</p>
            <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>{product.name}</p>
          </div>
        </div>
      );
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  // Handle wishlist
  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist! ❤️');
    }
  };

  // Handle related product click
  const handleRelatedProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} - ₹${product?.price}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      toast.error('Failed to share');
    }
  };

  // Check delivery
  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        date: '3-5 business days',
        cod: true
      });
      toast.success('Delivery available!');
    } else {
      toast.error('Enter valid 6-digit pincode');
    }
  };

  // Loading state
  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(99,102,241,0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%'
          }}
        />
        <p style={{ color: '#6b6b6b', fontSize: '16px' }}>Loading product...</p>
      </div>
    );
  }

  const discountPercent = product.discount || Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const savings = product.mrp - product.price;

  // Product specifications
  const specifications = [
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category },
    { label: 'Subcategory', value: product.subcategory || 'N/A' },
    { label: 'Rating', value: `${product.rating} / 5` },
    { label: 'Reviews', value: product.reviews?.toLocaleString() || '0' },
    { label: 'In Stock', value: product.stock > 0 ? 'Yes' : 'No' },
    { label: 'SKU', value: `SKU-${product.id.padStart(6, '0')}` },
    { label: 'Warranty', value: '1 Year Brand Warranty' }
  ];

  // Fake reviews
  const reviews = [
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      rating: 5, 
      date: '2 days ago',
      title: 'Excellent product!',
      comment: 'Amazing quality and fast delivery. Highly recommended!',
      verified: true,
      helpful: 124
    },
    { 
      id: 2, 
      name: 'Priya Patel', 
      rating: 4, 
      date: '1 week ago',
      title: 'Good value for money',
      comment: 'Product is good as described. Packaging was also great.',
      verified: true,
      helpful: 89
    },
    { 
      id: 3, 
      name: 'Amit Kumar', 
      rating: 5, 
      date: '2 weeks ago',
      title: 'Best purchase ever!',
      comment: 'Exceeded my expectations. Will buy again for sure.',
      verified: true,
      helpful: 56
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      paddingBottom: '80px'
    }}>
      {/* Breadcrumb */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 24px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6b6b6b',
            flexWrap: 'wrap'
          }}
        >
          <span 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', color: '#6366f1', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Home
          </span>
          <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
          <span 
            onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`)}
            style={{ cursor: 'pointer', color: '#6366f1' }}
          >
            {product.category}
          </span>
          {product.subcategory && (
            <>
              <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
              <span style={{ color: '#6366f1', cursor: 'pointer' }}>
                {product.subcategory}
              </span>
            </>
          )}
          <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
          <span style={{ color: '#a0a0a0', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </span>
        </motion.div>
      </div>

      {/* Main Product Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px'
        }}>
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  onClick={() => setImageZoom(true)}
                  style={{
                    width: '100%',
                    height: '550px',
                    objectFit: 'contain',
                    cursor: 'zoom-in',
                    padding: '40px'
                  }}
                />
              </AnimatePresence>

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    padding: '12px 20px',
                    borderRadius: '30px',
                    fontSize: '16px',
                    fontWeight: '800',
                    boxShadow: '0 8px 25px rgba(239,68,68,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BoltIcon style={{ width: '18px', height: '18px' }} />
                  {discountPercent}% OFF
                </motion.div>
              )}

              {/* Tag Badge */}
              {product.tag && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <TagIcon style={{ width: '14px', height: '14px' }} />
                  {product.tag}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isInWishlist(product.id) 
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isInWishlist(product.id) ? '0 8px 25px rgba(239,68,68,0.4)' : 'none'
                  }}
                >
                  {isInWishlist(product.id) ? (
                    <HeartSolid style={{ width: '26px', height: '26px', color: '#fff' }} />
                  ) : (
                    <HeartIcon style={{ width: '26px', height: '26px', color: '#fff' }} />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ShareIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImageZoom(true)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <PhotoIcon style={{ width: '24px', height: '24px', color: '#fff' }} />
                </motion.button>
              </div>

              {/* Image Counter */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {selectedImage + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {productImages.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: selectedImage === i 
                      ? '3px solid #6366f1' 
                      : '2px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    background: '#1a1a1a',
                    boxShadow: selectedImage === i ? '0 8px 25px rgba(99,102,241,0.3)' : 'none'
                  }}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      padding: '8px'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                padding: '8px 18px',
                borderRadius: '25px',
                marginBottom: '16px',
                border: '1px solid rgba(99,102,241,0.3)'
              }}
            >
              <CheckBadgeIcon style={{ width: '18px', height: '18px', color: '#6366f1' }} />
              <span style={{
                color: '#6366f1',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px'
              }}>
                {product.brand}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: '34px',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '20px',
                lineHeight: 1.3,
                letterSpacing: '-0.5px'
              }}
            >
              {product.name}
            </motion.h1>

            {/* Rating & Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.15) 100%)',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(34,197,94,0.3)'
              }}>
                <StarSolid style={{ width: '20px', height: '20px', color: '#22c55e' }} />
                <span style={{ color: '#22c55e', fontSize: '18px', fontWeight: '800' }}>
                  {product.rating}
                </span>
                <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>
                  / 5
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#6b6b6b', fontSize: '14px' }}>
                  {product.reviews?.toLocaleString()} Reviews
                </span>
                <span style={{ color: '#3d3d3d' }}>|</span>
                <span style={{ color: '#6b6b6b', fontSize: '14px' }}>
                  5K+ Bought
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '20px',
                background: product.stock > 10 
                  ? 'rgba(34,197,94,0.1)' 
                  : product.stock > 0 
                    ? 'rgba(245,158,11,0.1)' 
                    : 'rgba(239,68,68,0.1)',
                border: `1px solid ${product.stock > 10 ? 'rgba(34,197,94,0.3)' : product.stock > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: product.stock > 10 ? '#22c55e' : product.stock > 0 ? '#f59e0b' : '#ef4444'
                }} />
                <span style={{
                  color: product.stock > 10 ? '#22c55e' : product.stock > 0 ? '#f59e0b' : '#ef4444',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>
            </motion.div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '28px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '16px',
                marginBottom: '14px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  fontSize: '42px',
                  fontWeight: '900',
                  color: '#fff',
                  lineHeight: 1
                }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                
                {product.mrp > product.price && (
                  <>
                    <span style={{
                      fontSize: '22px',
                      color: '#6b6b6b',
                      textDecoration: 'line-through',
                      fontWeight: '500'
                    }}>
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#fff',
                        padding: '8px 18px',
                        borderRadius: '25px',
                        fontSize: '15px',
                        fontWeight: '700',
                        boxShadow: '0 6px 20px rgba(34,197,94,0.3)'
                      }}
                    >
                      Save ₹{savings.toLocaleString('en-IN')}
                    </motion.span>
                  </>
                )}
              </div>
              
              <p style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '16px' }}>
                Inclusive of all taxes • EMI from ₹{Math.round(product.price / 12).toLocaleString()}/month
              </p>

              {/* Offers */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { icon: CreditCardIcon, text: 'Bank Offer: 10% instant discount on HDFC Cards', color: '#3b82f6' },
                  { icon: GiftIcon, text: 'Buy 2 Get 1 Free on accessories', color: '#8b5cf6' },
                  { icon: TagIcon, text: 'Use code HERO10 for extra 10% off', color: '#f59e0b' }
                ].map((offer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: `${offer.color}10`,
                      borderRadius: '12px',
                      border: `1px solid ${offer.color}30`
                    }}
                  >
                    <offer.icon style={{ width: '20px', height: '20px', color: offer.color, flexShrink: 0 }} />
                    <span style={{ color: '#d0d0d0', fontSize: '13px', fontWeight: '500' }}>
                      {offer.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Check */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <MapPinIcon style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
                  Check Delivery
                </span>
              </div>
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
                    padding: '14px 18px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={checkDelivery}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Check
                </motion.button>
              </div>
              {deliveryInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    marginTop: '16px',
                    padding: '14px',
                    background: 'rgba(34,197,94,0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(34,197,94,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e' }}>
                    <CheckCircleIcon style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: '600' }}>Delivery in {deliveryInfo.date}</span>
                  </div>
                  {deliveryInfo.cod && (
                    <p style={{ color: '#6b6b6b', fontSize: '13px', marginTop: '6px', marginLeft: '26px' }}>
                      Cash on Delivery available
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ marginBottom: '28px' }}
            >
              <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>
                Quantity
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden'
                }}>
                  <motion.button
                    whileHover={{ background: 'rgba(99,102,241,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'transparent',
                      border: 'none',
                      color: quantity <= 1 ? '#3d3d3d' : '#fff',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <MinusIcon style={{ width: '22px', height: '22px' }} />
                  </motion.button>
                  <span style={{
                    width: '70px',
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: '700',
                    background: 'rgba(99,102,241,0.1)',
                    padding: '12px 0'
                  }}>
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ background: 'rgba(99,102,241,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'transparent',
                      border: 'none',
                      color: quantity >= product.stock ? '#3d3d3d' : '#fff',
                      cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <PlusIcon style={{ width: '22px', height: '22px' }} />
                  </motion.button>
                </div>
                <span style={{ color: '#6b6b6b', fontSize: '14px' }}>
                  {product.stock} available
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '32px'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: '20px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '2px solid #6366f1',
                  borderRadius: '16px',
                  color: '#6366f1',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <ShoppingCartIcon style={{ width: '24px', height: '24px' }} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(99,102,241,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  padding: '20px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.3)'
                }}
              >
                <BoltIcon style={{ width: '24px', height: '24px' }} />
                Buy Now
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px'
              }}
            >
              {[
                { icon: TruckIcon, title: 'Free Delivery', desc: 'Above ₹999', color: '#3b82f6' },
                { icon: ShieldCheckIcon, title: '1 Year Warranty', desc: 'Brand Assured', color: '#22c55e' },
                { icon: ArrowPathIcon, title: 'Easy Returns', desc: '7 Days Policy', color: '#f59e0b' },
                { icon: CheckBadgeIcon, title: '100% Genuine', desc: 'Verified Seller', color: '#8b5cf6' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, boxShadow: `0 10px 30px ${feature.color}20` }}
                  style={{
                    background: `${feature.color}08`,
                    borderRadius: '16px',
                    padding: '18px 14px',
                    textAlign: 'center',
                    border: `1px solid ${feature.color}20`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <feature.icon style={{ width: '24px', height: '24px', color: feature.color }} />
                  </div>
                  <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    {feature.title}
                  </p>
                  <p style={{ color: '#6b6b6b', fontSize: '11px' }}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: '60px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden'
          }}
        >
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ background: 'rgba(99,102,241,0.1)' }}
                onClick={() => setSelectedTab(tab)}
                style={{
                  flex: 1,
                  padding: '20px',
                  background: selectedTab === tab ? 'rgba(99,102,241,0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: selectedTab === tab ? '3px solid #6366f1' : '3px solid transparent',
                  color: selectedTab === tab ? '#6366f1' : '#6b6b6b',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
                {tab === 'reviews' && (
                  <span style={{
                    marginLeft: '8px',
                    background: '#6366f1',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {reviews.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            <AnimatePresence mode="wait">
              {selectedTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                    Product Description
                  </h3>
                  <p style={{
                    color: '#a0a0a0',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    marginBottom: '16px'
                  }}>
                    {product.description || `Experience premium quality with ${product.name}. This ${product.category.toLowerCase()} product from ${product.brand} delivers exceptional performance and style. Perfect for everyday use, it combines durability with elegant design.`}
                  </p>
                  <p style={{
                    color: '#a0a0a0',
                    fontSize: '15px',
                    lineHeight: 1.8
                  }}>
                    With a rating of {product.rating}/5 from {product.reviews?.toLocaleString()} customers, this product has proven its worth in the market. Whether you're looking for reliability, style, or value for money, this {product.brand} product is an excellent choice.
                  </p>

                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                      Key Features:
                    </h4>
                    <ul style={{ 
                      color: '#a0a0a0', 
                      fontSize: '14px', 
                      lineHeight: 2,
                      paddingLeft: '20px'
                    }}>
                      <li>Premium quality materials</li>
                      <li>Brand warranty included</li>
                      <li>Easy to use and maintain</li>
                      <li>Modern design aesthetics</li>
                      <li>Eco-friendly packaging</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {selectedTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                    Specifications
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px'
                  }}>
                    {specifications.map((spec, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          padding: '16px 20px',
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderRadius: '12px'
                        }}
                      >
                        <span style={{ color: '#6b6b6b', fontSize: '14px', width: '140px', flexShrink: 0 }}>
                          {spec.label}
                        </span>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700' }}>
                      Customer Reviews
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Write a Review
                    </motion.button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                        style={{
                          padding: '24px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: '700',
                              fontSize: '16px'
                            }}>
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#fff', fontWeight: '600' }}>{review.name}</span>
                                {review.verified && (
                                  <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'rgba(34,197,94,0.1)',
                                    color: '#22c55e',
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    <CheckCircleIcon style={{ width: '12px', height: '12px' }} />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <span style={{ color: '#6b6b6b', fontSize: '13px' }}>{review.date}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarSolid
                                key={i}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  color: i < review.rating ? '#ffd93d' : '#3d3d3d'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                          {review.title}
                        </h4>
                        <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.6 }}>
                          {review.comment}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                          <span style={{ color: '#6b6b6b', fontSize: '13px' }}>
                            {review.helpful} found this helpful
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            style={{
                              padding: '6px 14px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#a0a0a0',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Helpful
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '60px' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                You May Also Like
                <span style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#6366f1',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {relatedProducts.length} Products
                </span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6366f1',
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                View All
                <ChevronRightIcon style={{ width: '18px', height: '18px' }} />
              </motion.button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    height: '220px',
                    background: '#1a1a1a',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />

                    {/* Discount */}
                    {relatedProduct.discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(239,68,68,0.4)'
                      }}>
                        {relatedProduct.discount}% OFF
                      </div>
                    )}

                    {/* Wishlist */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInWishlist(relatedProduct.id)) {
                          removeFromWishlist(relatedProduct.id);
                          toast.success('Removed from wishlist');
                        } else {
                          addToWishlist(relatedProduct);
                          toast.success('Added to wishlist! ❤️');
                        }
                      }}
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isInWishlist(relatedProduct.id) 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {isInWishlist(relatedProduct.id) ? (
                        <HeartSolid style={{ width: '20px', height: '20px', color: '#fff' }} />
                      ) : (
                        <HeartIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
                      )}
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <p style={{
                      color: '#6366f1',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {relatedProduct.brand}
                    </p>

                    <h3 style={{
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.4
                    }}>
                      {relatedProduct.name}
                    </h3>

                    {/* Rating */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '14px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(34,197,94,0.1)',
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}>
                        <StarSolid style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                        <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600' }}>
                          {relatedProduct.rating}
                        </span>
                      </div>
                      <span style={{ color: '#6b6b6b', fontSize: '12px' }}>
                        ({relatedProduct.reviews?.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#fff'
                      }}>
                        ₹{relatedProduct.price.toLocaleString('en-IN')}
                      </span>
                      {relatedProduct.mrp > relatedProduct.price && (
                        <span style={{
                          fontSize: '14px',
                          color: '#6b6b6b',
                          textDecoration: 'line-through'
                        }}>
                          ₹{relatedProduct.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(relatedProduct);
                        toast.success(`${relatedProduct.name} added to cart!`);
                      }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 6px 20px rgba(99,102,241,0.25)'
                      }}
                    >
                      <ShoppingCartIcon style={{ width: '18px', height: '18px' }} />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {imageZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImageZoom(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
              padding: '40px'
            }}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={productImages[selectedImage]}
              alt={product.name}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '16px'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setImageZoom(false)}
              style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: '#fff', fontSize: '24px' }}>×</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1200px) {
          .product-grid {
            gap: 40px !important;
          }
        }
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;