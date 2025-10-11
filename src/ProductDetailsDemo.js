import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from './shared/hooks/useProducts';

const ProductDetailsDemo = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9ff 100%)',
        minHeight: '100vh'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '3rem', 
      background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9ff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          textAlign: 'center', 
          color: '#1a4d3b', 
          marginBottom: '2rem',
          textShadow: '0 2px 10px rgba(26, 77, 59, 0.1)'
        }}>
          🛍️ Product Details Page Demo
        </h1>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1a4d3b', marginBottom: '1rem' }}>
            ✨ SAPTNOVA-Inspired Product Details UI
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.6' }}>
            Experience our modern product details page with beautiful design, interactive features, 
            and comprehensive product information. Click any product below to explore!
          </p>
        </div>

        {products && products.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {products.slice(0, 6).map((product) => {
              const productSlug = product.product_id || product.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link 
                  key={product.id}
                  to={`/product/${productSlug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '2px solid #e0f2e7',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(26, 77, 59, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(26, 77, 59, 0.2)';
                    e.currentTarget.style.borderColor = '#1a4d3b';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(26, 77, 59, 0.1)';
                    e.currentTarget.style.borderColor = '#e0f2e7';
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #1a4d3b, #2d8659)',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white'
                  }}>
                    🌿
                  </div>
                  <h3 style={{ 
                    color: '#1a4d3b', 
                    marginBottom: '0.5rem',
                    fontSize: '1.2rem'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {product.description?.substring(0, 80)}...
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700', 
                      color: '#1a4d3b' 
                    }}>
                      ₹{product.price}
                    </span>
                    <span style={{
                      background: '#64d87d',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      View Details →
                    </span>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1a4d3b', marginBottom: '1rem' }}>
            🎨 Features of the Product Details Page
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
              <h4 style={{ color: '#1a4d3b', fontSize: '1rem' }}>Responsive Design</h4>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
              <h4 style={{ color: '#1a4d3b', fontSize: '1rem' }}>Shopping Features</h4>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <h4 style={{ color: '#1a4d3b', fontSize: '1rem' }}>Reviews & Ratings</h4>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
              <h4 style={{ color: '#1a4d3b', fontSize: '1rem' }}>Product Benefits</h4>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          padding: '1rem' 
        }}>
          <Link 
            to="/" 
            style={{
              background: 'linear-gradient(135deg, #1a4d3b, #2d8659)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(26, 77, 59, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(26, 77, 59, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 77, 59, 0.3)';
            }}
          >
            ← Back to Product Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDemo;