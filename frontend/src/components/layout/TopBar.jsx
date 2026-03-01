import React from 'react';
import { MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const TopBar = () => {
  return (
    <div style={{
      background: '#232f3e',
      color: '#fff',
      padding: '8px 0',
      fontSize: '13px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <MapPinIcon style={{ width: '16px', height: '16px' }} />
            <span>Deliver to Mumbai 400001</span>
            <ChevronDownIcon style={{ width: '14px', height: '14px' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '25px' }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Sell on ShopSmart</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Customer Care</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Download App</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;