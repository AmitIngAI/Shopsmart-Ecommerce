// src/components/home/FlipkartCategories.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    description: 'Smartphones, Laptops, TVs & more',
    productCount: 12,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    icon: '👕',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
    description: 'Clothing, Footwear & Accessories',
    productCount: 12,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: 'Home & Living',
    slug: 'home-&-living',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    description: 'Furniture, Decor & Kitchen',
    productCount: 10,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: 'Beauty',
    slug: 'beauty',
    icon: '💄',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    description: 'Skincare, Makeup & Fragrances',
    productCount: 10,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 5,
    name: 'Sports',
    slug: 'sports',
    icon: '⚽',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    description: 'Fitness, Equipment & Outdoor',
    productCount: 10,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 6,
    name: 'New Arrivals',
    slug: 'new-arrivals',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500',
    description: 'Latest Products Just Launched',
    productCount: 10,
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
  },
  {
    id: 7,
    name: 'Deals',
    slug: 'deals',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500',
    description: 'Best Deals & Flash Sales',
    productCount: 10,
    gradient: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)'
  }
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div className="category-section" style={{ 
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Section Header */}
      <div className="section-header" style={{ textAlign: 'center' }}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-badge"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            borderRadius: '50px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          CATEGORIES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
          style={{
            fontWeight: '800',
            color: '#fff'
          }}
        >
          Browse by Category
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle"
          style={{ color: '#a0a0a0' }}
        >
          Explore our wide range of products
        </motion.p>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => handleCategoryClick(category)}
            className="category-card"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            {/* Background Image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease',
                filter: 'brightness(1.05) contrast(1.1)'
              }}
              className="category-bg"
            />

            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, transparent 60%)`
            }} />

            {/* Colored Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '5px',
              height: '100%',
              background: category.gradient
            }} />

            {/* Content */}
            <div className="category-content" style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Top Section */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <div 
                    className="category-icon-box"
                    style={{
                      borderRadius: '14px',
                      background: category.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    <span className="category-emoji">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="category-name" style={{
                      fontWeight: '700',
                      color: '#fff',
                      margin: 0
                    }}>
                      {category.name}
                    </h3>
                    <p className="category-desc" style={{
                      color: '#a0a0a0',
                      margin: '4px 0 0 0'
                    }}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div 
                  className="product-count-badge"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px'
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: '600' }}>
                    {category.productCount}+ Products
                  </span>
                </div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="explore-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: category.gradient,
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: '600' }}>
                    Explore
                  </span>
                  <ArrowRightIcon className="explore-icon" style={{ color: '#fff' }} />
                </motion.div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: `${category.gradient.replace('100%)', '30%)')}`,
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        .category-section {
          padding: 80px 24px;
        }

        .section-header {
          margin-bottom: 60px;
        }

        .section-badge {
          padding: 10px 24px;
          font-size: 12px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 42px;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .category-card {
          height: 220px;
        }

        .category-content {
          padding: 28px;
        }

        .category-icon-box {
          width: 56px;
          height: 56px;
        }

        .category-emoji {
          font-size: 28px;
        }

        .category-name {
          font-size: 24px;
        }

        .category-desc {
          font-size: 13px;
        }

        .product-count-badge {
          padding: 8px 16px;
        }

        .product-count-badge span {
          font-size: 14px;
        }

        .explore-button {
          padding: 10px 20px;
        }

        .explore-button span {
          font-size: 14px;
        }

        .explore-icon {
          width: 16px;
          height: 16px;
        }

        /* Hover effect for background */
        .category-card:hover .category-bg {
          transform: scale(1.1);
        }

        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .category-section {
            padding: 60px 20px;
          }

          .section-header {
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 36px;
          }

          .section-subtitle {
            font-size: 16px;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }

          .category-card {
            height: 200px;
          }

          .category-content {
            padding: 24px;
          }

          .category-icon-box {
            width: 50px;
            height: 50px;
          }

          .category-emoji {
            font-size: 24px;
          }

          .category-name {
            font-size: 20px;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .category-section {
            padding: 50px 16px;
          }

          .section-header {
            margin-bottom: 32px;
          }

          .section-badge {
            padding: 8px 18px;
            font-size: 10px;
            margin-bottom: 14px;
          }

          .section-title {
            font-size: 28px;
            margin-bottom: 12px;
          }

          .section-subtitle {
            font-size: 14px;
          }

          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .category-card {
            height: 180px;
            border-radius: 18px;
          }

          .category-content {
            padding: 16px;
          }

          .category-icon-box {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }

          .category-emoji {
            font-size: 22px;
          }

          .category-name {
            font-size: 16px;
          }

          .category-desc {
            font-size: 11px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .product-count-badge {
            padding: 6px 12px;
          }

          .product-count-badge span {
            font-size: 11px;
          }

          .explore-button {
            padding: 8px 14px;
          }

          .explore-button span {
            font-size: 12px;
          }

          .explore-icon {
            width: 14px;
            height: 14px;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .category-section {
            padding: 40px 12px;
          }

          .section-header {
            margin-bottom: 24px;
          }

          .section-badge {
            padding: 6px 14px;
            font-size: 9px;
            margin-bottom: 12px;
          }

          .section-title {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .section-subtitle {
            font-size: 13px;
          }

          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .category-card {
            height: 150px;
            border-radius: 14px;
          }

          .category-content {
            padding: 12px;
          }

          .category-icon-box {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }

          .category-emoji {
            font-size: 18px;
          }

          .category-name {
            font-size: 14px;
          }

          .category-desc {
            display: none;
          }

          .product-count-badge {
            padding: 4px 10px;
          }

          .product-count-badge span {
            font-size: 10px;
          }

          .explore-button {
            padding: 6px 12px;
          }

          .explore-button span {
            font-size: 11px;
          }

          .explore-icon {
            width: 12px;
            height: 12px;
          }
        }

        /* Very Small Mobile - 360px */
        @media (max-width: 360px) {
          .categories-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .category-card {
            height: 140px;
          }

          .category-desc {
            display: block;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySection;