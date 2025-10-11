import React from 'react';
import EnhancedModernFooter from './shared/components/layout/EnhancedModernFooter';
import './shared/components/layout/ModernFooter.css';

const FooterDemo = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Demo Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '700' }}>
          🚀 Modern Footer Demo
        </h1>
        <p style={{ margin: '1rem 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Professional SAPTNOVA-inspired footer component
        </p>
      </header>

      {/* Demo Content */}
      <main style={{ 
        flex: 1, 
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '800px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #1a4d3b, #2d8659)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ Features of Our Modern Footer
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ color: '#1a4d3b', marginBottom: '1rem' }}>🎨 Design Features</h3>
              <ul style={{ color: '#666', lineHeight: '1.6' }}>
                <li>Modern gradient background</li>
                <li>Responsive grid layout</li>
                <li>Animated social icons</li>
                <li>Professional typography</li>
                <li>Glass morphism effects</li>
              </ul>
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ color: '#1a4d3b', marginBottom: '1rem' }}>⚡ Functionality</h3>
              <ul style={{ color: '#666', lineHeight: '1.6' }}>
                <li>Working newsletter signup</li>
                <li>Payment method displays</li>
                <li>Social media links</li>
                <li>Contact information</li>
                <li>Organized navigation</li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #64d87d, #4ade80)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
              📱 Fully responsive design that matches the SAPTNOVA brand aesthetic!
            </p>
          </div>
        </div>
      </main>

      {/* The Beautiful Footer */}
      <EnhancedModernFooter />
    </div>
  );
};

export default FooterDemo;