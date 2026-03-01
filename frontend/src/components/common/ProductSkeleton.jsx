import React from 'react';

const ProductSkeleton = () => {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      {/* Image Skeleton */}
      <div style={{
        width: '100%',
        height: '220px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }} />

      {/* Content Skeleton */}
      <div style={{ padding: '15px' }}>
        <div style={{
          height: '12px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: '8px',
          borderRadius: '4px',
          width: '60%'
        }} />
        
        <div style={{
          height: '16px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: '12px',
          borderRadius: '4px'
        }} />

        <div style={{
          height: '14px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: '12px',
          borderRadius: '4px',
          width: '40%'
        }} />

        <div style={{
          height: '38px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px'
        }} />
      </div>
    </div>
  );
};

export default ProductSkeleton;