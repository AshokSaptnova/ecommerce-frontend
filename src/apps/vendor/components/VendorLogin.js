import React, { useState } from 'react';
import '../styles/VendorLogin.css';
import { handleApiError } from '../../../shared/utils/errorHandler';
import { vendorApi } from '../services/vendorApi';

const VendorLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login
      const data = await vendorApi.login(email, password);
      
      // Verify user role by getting user info
      const userData = await vendorApi.getMe(data.access_token);
      
      if (userData.role === 'vendor') {
        // Get vendor profile
        const vendorData = await vendorApi.getVendorProfile(data.access_token);
        onLogin(userData, data.access_token, vendorData);
      } else {
        setError('Access denied. Vendor privileges required.');
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-login-container">
      <div className="vendor-login-box">
        <div className="login-header">
          <div className="vendor-icon">🏪</div>
          <h2>Vendor Login</h2>
          <p>Multi-Vendor eCommerce Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <p>Need help accessing your account?</p>
          <small>Contact support@ecommerce.com</small>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
