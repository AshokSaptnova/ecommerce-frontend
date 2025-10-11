import React from 'react';
import { useProducts } from '../../../../shared/hooks/useProducts';

export default function Page_1() {
  const { products, loading, error } = useProducts();
  
  // Find SAPTNOVA product from API data
  const saptnovaProduct = products?.find(product => 
    product.name.toLowerCase().includes('saptnova') || 
    product.product_id?.toLowerCase().includes('saptnova')
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Loading SAPTNOVA product information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-section">
          <p>❌ Error loading product: {error}</p>
        </div>
      </div>
    );
  }

  if (!saptnovaProduct) {
    return (
      <div className="page-container">
        <div className="not-found-section">
          <p>📦 SAPTNOVA product not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #ff6b6b, #ffa500)', 
          borderRadius: '15px', 
          padding: '2rem', 
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>SAPTNOVA</h1>
          <p style={{ fontSize: '1.5rem', margin: '0' }}>Authentic Ayurvedic Products</p>
          <p style={{ fontSize: '1.2rem', margin: '1rem 0 0 0' }}>
            {saptnovaProduct?.tagline}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ color: '#e74c3c', fontSize: '1.8rem', marginBottom: '1rem' }}>
              📦 Product Information
            </h2>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px' }}>
              <p><strong>Type:</strong> {saptnovaProduct?.type}</p>
              <p><strong>Packing:</strong> {saptnovaProduct?.packing}</p>
              <p><strong>Dosage:</strong> {saptnovaProduct?.dosage}</p>
              {saptnovaProduct?.mrp && (
                <p><strong>Price:</strong> ₹{saptnovaProduct.mrp} {saptnovaProduct.old_mrp && saptnovaProduct.old_mrp > saptnovaProduct.mrp && <span style={{textDecoration: 'line-through', opacity: 0.6}}>₹{saptnovaProduct.old_mrp}</span>}</p>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#e74c3c', fontSize: '1.8rem', marginBottom: '1rem' }}>
              ✨ Key Benefits
            </h2>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px' }}>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {saptnovaProduct?.benefits?.map((benefit) => (
                  <li key={benefit.id} style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {benefit.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
                  <div>
          <h2 style={{ color: '#e74c3c', fontSize: '1.8rem', marginBottom: '1rem' }}>
            🌿 Ingredients (Each {saptnovaProduct?.packing} {saptnovaProduct?.type} Contains Extracts of:)
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '1rem' 
          }}>
            {saptnovaProduct?.ingredients?.map((ingredient) => (
              <div key={ingredient.id} style={{ 
                background: 'white', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <strong style={{ color: '#2c3e50', fontSize: '0.95rem' }}>
                      {ingredient.name}
                    </strong>
                    {ingredient.latin && (
                      <div style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>
                        ({ingredient.latin})
                      </div>
                    )}
                  </div>
                  <span style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {ingredient.quantity}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: '#666', 
                  margin: 0, 
                  lineHeight: '1.4' 
                }}>
                  {ingredient.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          textAlign: 'center',
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>PROPER MEDICINE</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>GMP CERTIFIED</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>SCIENTIFICALLY TESTED</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>MADE PERFECT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
