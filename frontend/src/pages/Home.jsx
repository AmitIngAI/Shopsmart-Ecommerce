import React from 'react';
import { motion } from 'framer-motion';
import HeroBanner from '../components/home/FlipkartBanner';
import CategorySection from '../components/home/FlipkartCategories';
import ProductCard from '../components/product/FlipkartProductCard';
import { products } from '../data/products';
import { SparklesIcon, FireIcon, BoltIcon, GiftIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
      <HeroBanner />
      <CategorySection />

      {/* Flash Deals */}
      <ProductSection
        icon={<BoltIcon style={{ width: '24px', height: '24px' }} />}
        title="Flash Deals"
        subtitle="Hurry! Limited time offers"
        products={products.filter(p => p.discount > 15)}
        gradient="linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
      />

      {/* New Arrivals */}
      <ProductSection
        icon={<SparklesIcon style={{ width: '24px', height: '24px' }} />}
        title="New Arrivals"
        subtitle="Fresh products just for you"
        products={products.filter(p => p.tag === 'New Launch' || p.tag === 'Trending')}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      />

      {/* Best Sellers */}
      <ProductSection
        icon={<FireIcon style={{ width: '24px', height: '24px' }} />}
        title="Best Sellers"
        subtitle="Most loved by customers"
        products={products.filter(p => p.rating >= 4.5)}
        gradient="linear-gradient(135deg, #00d4aa 0%, #00b894 100%)"
      />

      {/* All Products */}
      <div className="container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              padding: '10px 24px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <GiftIcon style={{ width: '18px', height: '18px', color: '#ff6b35' }} />
            EXPLORE ALL
          </motion.span>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
            All Products
          </h2>
          <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
            Browse our complete collection
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Section Component
const ProductSection = ({ icon, title, subtitle, products, gradient }) => {
  return (
    <div className="container" style={{ padding: '80px 24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '50px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: gradient,
            padding: '10px 20px',
            borderRadius: '50px',
            marginBottom: '16px'
          }}>
            {icon}
            <span style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>
              {title.toUpperCase()}
            </span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff' }}>
            {title}
          </h2>
          <p style={{ color: '#a0a0a0', fontSize: '16px', marginTop: '8px' }}>
            {subtitle}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '14px 32px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          View All →
        </motion.button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {products.slice(0, 4).map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Home;