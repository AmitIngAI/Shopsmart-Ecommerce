import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  XMarkIcon,
  ShoppingCartIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { products, categories } from '../data/products';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const Category = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  // ✅ FIX - Get wishlist array instead of isInWishlist function
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useStore();
  
  // ✅ FIX - Create helper function
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  // Get category info
  const categoryInfo = categories.find(
    cat => cat.name.toLowerCase().replace(/\s+/g, '-') === categoryName?.toLowerCase()
  );

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (categoryName && categoryName !== 'all') {
      const formattedCategory = categoryName.replace(/-/g, ' ');
      filtered = products.filter(product => 
        product.category.toLowerCase() === formattedCategory.toLowerCase() ||
        product.subcategory?.toLowerCase() === formattedCategory.toLowerCase()
      );
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [categoryName, sortBy, priceRange, selectedBrands, selectedRating]);

  // Get unique brands
  const allBrands = [...new Set(products.map(p => p.brand))].filter(Boolean);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f0f0f',
      paddingBottom: '60px'
    }}>
      {/* Category Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '40px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#6b6b6b'
            }}>
              <span 
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', color: '#6366f1' }}
              >
                Home
              </span>
              <span>/</span>
              <span style={{ color: '#fff', textTransform: 'capitalize' }}>
                {categoryInfo?.name || categoryName?.replace(/-/g, ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {categoryInfo?.icon && (
                <span style={{ fontSize: '48px' }}>{categoryInfo.icon}</span>
              )}
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#fff',
                  marginBottom: '8px',
                  textTransform: 'capitalize'
                }}>
                  {categoryInfo?.name || categoryName?.replace(/-/g, ' ')}
                </h1>
                <p style={{ color: '#6b6b6b', fontSize: '16px' }}>
                  {filteredProducts.length} products found
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="filters-sidebar"
          style={{
            width: '280px',
            flexShrink: 0
          }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky',
            top: '180px'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AdjustmentsHorizontalIcon style={{ width: '20px', height: '20px' }} />
              Filters
            </h3>

            {/* Price Range */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Price Range
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Brands */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Brands
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {allBrands.slice(0, 10).map((brand) => (
                  <label
                    key={brand}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      color: '#a0a0a0',
                      fontSize: '14px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                      style={{ accentColor: '#6366f1' }}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Rating
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      color: '#a0a0a0',
                      fontSize: '14px'
                    }}
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      style={{ accentColor: '#6366f1' }}
                    />
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarSolid
                          key={i}
                          style={{
                            width: '14px',
                            height: '14px',
                            color: i < rating ? '#ffd93d' : '#3d3d3d'
                          }}
                        />
                      ))}
                    </div>
                    <span>& up</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setPriceRange([0, 300000]);
                setSelectedBrands([]);
                setSelectedRating(0);
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                color: '#6366f1',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              background: 'rgba(255,255,255,0.03)',
              padding: '16px 20px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* View Toggle */}
              <div style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                padding: '4px'
              }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: viewMode === 'grid' ? '#6366f1' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <Squares2X2Icon style={{ width: '18px', height: '18px' }} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: viewMode === 'list' ? '#6366f1' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <ListBulletIcon style={{ width: '18px', height: '18px' }} />
                </motion.button>
              </div>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#6b6b6b', fontSize: '14px' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </motion.div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' 
                ? 'repeat(auto-fill, minmax(260px, 1fr))' 
                : '1fr',
              gap: '20px'
            }}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: viewMode === 'list' ? 'flex' : 'block'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    width: viewMode === 'list' ? '200px' : '100%',
                    height: viewMode === 'list' ? '200px' : '220px',
                    background: '#1a1a1a',
                    flexShrink: 0
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {product.discount}% OFF
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(product);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolid style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                      ) : (
                        <HeartIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
                      )}
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px', flex: 1 }}>
                    {/* Brand */}
                    <p style={{
                      color: '#6366f1',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {product.brand}
                    </p>

                    {/* Name */}
                    <h3 style={{
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '10px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: viewMode === 'grid' ? 'nowrap' : 'normal'
                    }}>
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(34,197,94,0.1)',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        <StarSolid style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                        <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600' }}>
                          {product.rating}
                        </span>
                      </div>
                      <span style={{ color: '#6b6b6b', fontSize: '13px' }}>
                        ({product.reviews?.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#fff'
                      }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > product.price && (
                        <span style={{
                          fontSize: '14px',
                          color: '#6b6b6b',
                          textDecoration: 'line-through'
                        }}>
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
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
                        gap: '8px'
                      }}
                    >
                      <ShoppingCartIcon style={{ width: '18px', height: '18px' }} />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* No Products */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '80px 20px'
              }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <span style={{ fontSize: '48px' }}>🔍</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                No products found
              </h3>
              <p style={{ color: '#6b6b6b', fontSize: '16px', marginBottom: '24px' }}>
                Try adjusting your filters
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPriceRange([0, 300000]);
                  setSelectedBrands([]);
                  setSelectedRating(0);
                }}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .filters-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Category;