import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About SAPTNOVA</h1>
            <p className="hero-subtitle">
              Whole body healing system resides in one word that is Ayurveda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="container">
          {/* Introduction */}
          <div className="content-section">
            <div className="section-header">
              <h2>Our Philosophy</h2>
              <div className="section-divider"></div>
            </div>
            <div className="content-grid">
              <div className="content-text">
                <p className="lead-text">
                  Being ancient and around 3000 years old rooting from India, Ayurveda believes in creating balance between mind soul and body, and so does SAPTNOVA LLP!
                </p>
                <p>
                  SAPTNOVA focuses on the ayurvedic belief of creating harmony with universe and thus bringing balance and achieving good health. An evolving brand, we cater to provide wellness solutions to you through quality health products.
                </p>
                <p>
                  SAPTNOVA provides uniquely formulated, tailored and manufactured products to increase and improve body functions with regular intake. SAPTNOVA takes care of maintaining natural components while manufacturing the supplements which enhance liveliness of organs retain balance and regain freshness and growth.
                </p>
              </div>
              <div className="content-visual">
                <div className="ayurveda-symbol">
                  <div className="symbol-circle">
                    <span className="symbol-text">🕉</span>
                  </div>
                  <p className="symbol-caption">Ancient Ayurvedic Wisdom</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="content-section mission-section">
            <div className="section-header">
              <h2>Our Mission</h2>
              <div className="section-divider"></div>
            </div>
            <div className="mission-content">
              <div className="mission-card">
                <div className="mission-icon">🌿</div>
                <h3>Natural & Pure</h3>
                <p>
                  In India the huge wellness range is available with products packed with toxic chemicals artificial fragrances and colours. SAPTNOVA is trying to cater to this gap and has brought natural offerings for the customers with natural and non-toxic range of products that are free from chemicals and artificiality.
                </p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">⚖️</div>
                <h3>Balance & Harmony</h3>
                <p>
                  The Indian lifestyle is changing as we are adopting according to new world but we are not able to create a balance between the new lifestyle and healthy living. To fill this gap Saptnova is making all possible efforts to create a balance between the 3 Doshas and changing lifestyle and dietary habits of Indian consumers.
                </p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">💊</div>
                <h3>Complete Care</h3>
                <p>
                  Saptnova provides both nutritional and personal care range for its users, ensuring comprehensive wellness solutions for modern living while staying true to ancient Ayurvedic principles.
                </p>
              </div>
            </div>
          </div>

          {/* Offerings Section */}
          <div className="content-section offerings-section">
            <div className="section-header">
              <h2>Our Offerings</h2>
              <div className="section-divider"></div>
            </div>
            <div className="offerings-grid">
              <div className="offering-item">
                <div className="offering-icon">💊</div>
                <h3>Multivitamins</h3>
                <p>Complete nutritional support for daily wellness</p>
              </div>
              <div className="offering-item">
                <div className="offering-icon">⚖️</div>
                <h3>Weight Loss Medicines</h3>
                <p>Natural solutions for healthy weight management</p>
              </div>
              <div className="offering-item">
                <div className="offering-icon">🫀</div>
                <h3>Liver Care Medicines</h3>
                <p>Specialized care for liver health and detoxification</p>
              </div>
              <div className="offering-item">
                <div className="offering-icon">🛡️</div>
                <h3>Immunity Boosters</h3>
                <p>Strengthen your body's natural defense system</p>
              </div>
              <div className="offering-item">
                <div className="offering-icon">💪</div>
                <h3>Protein Supplements</h3>
                <p>Quality protein for muscle health and growth</p>
              </div>
              <div className="offering-item">
                <div className="offering-icon">🌱</div>
                <h3>General Remedies</h3>
                <p>Traditional solutions for common health concerns</p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="content-section values-section">
            <div className="section-header">
              <h2>Our Values</h2>
              <div className="section-divider"></div>
            </div>
            <div className="values-content">
              <div className="value-item">
                <h3>🌿 Natural Ingredients</h3>
                <p>We use only the finest natural components, free from harmful chemicals and artificial additives.</p>
              </div>
              <div className="value-item">
                <h3>🏛️ Ancient Wisdom</h3>
                <p>Our formulations are based on 3000 years of Ayurvedic knowledge and traditional healing practices.</p>
              </div>
              <div className="value-item">
                <h3>🔬 Modern Science</h3>
                <p>We combine traditional wisdom with modern manufacturing techniques for optimal effectiveness.</p>
              </div>
              <div className="value-item">
                <h3>✨ Quality Assurance</h3>
                <p>Every product undergoes rigorous testing to ensure purity, potency, and safety for our customers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Experience the Power of Ayurveda</h2>
            <p>Join thousands of satisfied customers on their journey to better health with SAPTNOVA's natural wellness solutions.</p>
            <div className="cta-buttons">
              <a href="/products" className="btn btn-primary">Explore Products</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;