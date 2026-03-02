import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/home/FlipkartBanner';
import CategorySection from '../components/home/FlipkartCategories';
import ProductCard from '../components/product/FlipkartProductCard';
import { products } from '../data/products';
import { productService } from '../services/productService';
import { 
  SparklesIcon, 
  FireIcon, 
  BoltIcon, 
  GiftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState(products); // Default to local
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products - SILENT (no error toast)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        if (data && data.length > 0) {
          setAllProducts(data);
          console.log('✅ Products loaded from backend:', data.length);
        }
      } catch (error) {
        // ✅ SILENT FALLBACK - No toast, just use local data
        console.log('ℹ️ Using local products data');
        setAllProducts(products);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Handle View All click
  const handleViewAll = (category, title) => {
    navigate(`/category/${encodeURIComponent(category)}`, { 
      state: { title } 
    });
  };

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh',
      paddingTop: isMobile ? '70px' : '0'
    }}>
      <HeroBanner />
      <CategorySection />

      {/* Flash Deals */}
      <ProductSection
        icon={<BoltIcon style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px' }} />}
        title="Flash Deals"
        subtitle="Hurry! Limited time offers"
        products={allProducts.filter(p => p.discount > 15)}
        gradient="linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
        onViewAll={() => handleViewAll('deals', 'Flash Deals')}
        isMobile={isMobile}
      />

      {/* New Arrivals */}
      <ProductSection
        icon={<SparklesIcon style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px' }} />}
        title="New Arrivals"
        subtitle="Fresh products just for you"
        products={allProducts.filter(p => p.tag === 'New Launch' || p.tag === 'Trending' || p.category === 'New Arrivals')}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        onViewAll={() => handleViewAll('New Arrivals', 'New Arrivals')}
        isMobile={isMobile}
      />
      
      {/* All Products */}
      <div className="container" style={{ 
        padding: isMobile ? '40px 16px' : '80px 24px' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? '30px' : '60px' 
        }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              padding: isMobile ? '8px 16px' : '10px 24px',
              borderRadius: '50px',
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: isMobile ? '12px' : '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <GiftIcon style={{ 
              width: isMobile ? '14px' : '18px', 
              height: isMobile ? '14px' : '18px', 
              color: '#ff6b35' 
            }} />
            EXPLORE ALL
          </motion.span>
          <h2 style={{ 
            fontSize: isMobile ? '28px' : '42px', 
            fontWeight: '800', 
            color: '#fff', 
            marginBottom: isMobile ? '8px' : '16px' 
          }}>
            All Products
          </h2>
          <p style={{ 
            color: '#a0a0a0', 
            fontSize: isMobile ? '14px' : '18px' 
          }}>
            Browse our complete collection
          </p>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? '12px' : '30px'
        }}>
          {allProducts.slice(0, isMobile ? 8 : 12).map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* View All Button */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: isMobile ? '30px' : '50px' 
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllProducts(!showAllProducts)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '8px' : '10px',
              padding: isMobile ? '14px 24px' : '18px 40px',
              background: showAllProducts 
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              border: showAllProducts 
                ? '2px solid rgba(255,255,255,0.2)' 
                : 'none',
              borderRadius: '50px',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '16px',
              boxShadow: showAllProducts 
                ? 'none' 
                : '0 10px 30px rgba(255,107,53,0.3)',
              transition: 'all 0.3s ease',
              minWidth: isMobile ? '200px' : '280px'
            }}
          >
            {showAllProducts ? (
              <>
                Show Less
                <ChevronUpIcon style={{ 
                  width: isMobile ? '18px' : '20px', 
                  height: isMobile ? '18px' : '20px' 
                }} />
              </>
            ) : (
              <>
                View All {products.length} Products
                <ChevronDownIcon style={{ 
                  width: isMobile ? '18px' : '20px', 
                  height: isMobile ? '18px' : '20px' 
                }} />
              </>
            )}
          </motion.button>
        </div>
      </div>
      {/* Mobile Bottom Spacing */}
      {isMobile && <div style={{ height: '80px' }} />}
    </div>
  );
};

// Product Section Component
const ProductSection = ({ 
  icon, 
  title, 
  subtitle, 
  products, 
  gradient, 
  onViewAll,
  isMobile 
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="container" style={{ 
      padding: isMobile ? '40px 16px' : '80px 24px' 
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: isMobile ? '24px' : '50px',
        flexWrap: 'wrap',
        gap: isMobile ? '12px' : '20px'
      }}>
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '10px',
            background: gradient,
            padding: isMobile ? '6px 12px' : '10px 20px',
            borderRadius: '50px',
            marginBottom: isMobile ? '10px' : '16px'
          }}>
            {icon}
            <span style={{ 
              color: '#fff', 
              fontWeight: '600', 
              fontSize: isMobile ? '10px' : '13px' 
            }}>
              {title.toUpperCase()}
            </span>
          </div>
          <h2 style={{ 
            fontSize: isMobile ? '24px' : '36px', 
            fontWeight: '800', 
            color: '#fff',
            marginBottom: isMobile ? '4px' : '8px'
          }}>
            {title}
          </h2>
          <p style={{ 
            color: '#a0a0a0', 
            fontSize: isMobile ? '13px' : '16px' 
          }}>
            {subtitle}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: isMobile ? '10px 20px' : '14px 32px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: isMobile ? '12px' : '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          View All
          <ArrowRightIcon style={{ 
            width: isMobile ? '14px' : '16px', 
            height: isMobile ? '14px' : '16px' 
          }} />
        </motion.button>
      </div>

      {/* Products */}
      {isMobile ? (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '12px',
          paddingBottom: '16px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {products.slice(0, 6).map((product, index) => (
            <div 
              key={product.id}
              style={{
                minWidth: '160px',
                maxWidth: '160px',
                scrollSnapAlign: 'start'
              }}
            >
              <ProductCard 
                product={product} 
                index={index}
                isMobile={true}
                compact={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {products.slice(0, 4).map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
              isMobile={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;