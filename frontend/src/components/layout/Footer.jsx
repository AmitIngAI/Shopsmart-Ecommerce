import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0f0f0f 0%, #000 100%)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      marginTop: '100px'
    }}>
      {/* Newsletter Section */}
      <div style={{
        background: 'var(--gradient-primary)',
        padding: '60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-200px',
          right: '-100px'
        }} />
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Subscribe to our Newsletter
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
              Get exclusive offers, new arrivals and more!
            </p>
          </div>
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50px',
            padding: '6px',
            backdropFilter: 'blur(10px)'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '14px 24px',
                fontSize: '15px',
                color: '#fff',
                width: '280px'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success('Subscribed successfully!')}
              style={{
                background: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '14px 32px',
                color: '#ff6b35',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container" style={{ padding: '80px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '50px'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'var(--gradient-primary)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBagIcon style={{ width: '28px', height: '28px', color: '#fff' }} />
              </div>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '800',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ShopSmart
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
              Your premium destination for quality products. We deliver excellence with every order.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['📘', '📷', '🐦', '▶️'].map((emoji, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.1 }}
                  onClick={() => toast.success('Opening social media...')}
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '20px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {[
            {
              title: 'Shop',
              links: ['New Arrivals', 'Best Sellers', 'Trending', 'Sale', 'Collections']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Track Order', 'Returns', 'Shipping', 'Contact Us']
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Press', 'Blog', 'Affiliates']
            }
          ].map((section, i) => (
            <div key={i}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {section.links.map((link, j) => (
                  <li key={j} style={{ marginBottom: '14px' }}>
                    <motion.a
                      whileHover={{ x: 5, color: '#ff6b35' }}
                      onClick={() => toast.success(`Opening ${link}...`)}
                      style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'inline-block',
                        transition: 'color 0.2s'
                      }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: MapPinIcon, text: 'Mumbai, Maharashtra, India' },
                { icon: PhoneIcon, text: '+91 1800-123-4567' },
                { icon: EnvelopeIcon, text: 'hello@shopsmart.com' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,107,53,0.15)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <item.icon style={{ width: '18px', height: '18px', color: '#ff6b35' }} />
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '24px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            © {currentYear} ShopSmart. All rights reserved. Made with ❤️ in India
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link, i) => (
              <motion.a
                key={i}
                whileHover={{ color: '#ff6b35' }}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {link}
              </motion.a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['💳 Visa', '💳 Mastercard', '🏦 UPI', '💵 COD'].map((pay, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;