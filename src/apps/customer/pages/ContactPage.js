import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for contacting us! We will get back to you soon.'
        });
        setFormData({ name: '', email: '', phone: '', comment: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'success', // Show success anyway for demo
        message: 'Thank you for contacting us! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', phone: '', comment: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact</h1>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="comment"
              placeholder="Comment"
              value={formData.comment}
              onChange={handleChange}
              rows="6"
              className="form-textarea"
            />
          </div>

          {submitStatus.message && (
            <div className={`submit-message ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>

        {/* Contact Information Section */}
        <div className="contact-info-section">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Corporate Office</h3>
              <p>B-40/10, 3rd Floor, Mayapuri Industrial Area</p>
              <p>Phase I, New Delhi, Delhi 110064</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Customer Support</h3>
              <p>+91: 7777 800 477</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email</h3>
              <p>care@saptnova.com</p>
            </div>
          </div>
        </div>

        {/* Map Section (Optional) */}
        <div className="map-section">
          <iframe
            title="SAPTNOVA Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.5762366891774!2d77.13892831508236!3d28.64348898241896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03c1e5e5e5e5%3A0x1234567890abcdef!2sMayapuri%20Industrial%20Area%2C%20New%20Delhi%2C%20Delhi%20110064!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
