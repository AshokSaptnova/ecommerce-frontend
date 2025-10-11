import React, { useState } from 'react';
import '../styles/VendorLogin.css';
import { handleApiError } from '../../../shared/utils/errorHandler';

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
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Verify user role by getting user info
        const userResponse = await fetch('http://127.0.0.1:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.role === 'vendor') {
            // Get vendor profile
            const vendorResponse = await fetch('http://127.0.0.1:8000/vendors/me', {
              headers: {
                'Authorization': `Bearer ${data.access_token}`
              }
            });

            if (vendorResponse.ok) {
              const vendorData = await vendorResponse.json();
              onLogin(userData, data.access_token, vendorData);
            } else {
              setError('Vendor profile not found. Please contact administrator.');
            }
          } else {
            setError('Access denied. Vendor privileges required.');
          }
        } else {
          setError('Failed to verify user credentials.');
        }
      } else {
        const errorMessage = await handleApiError(response);
        setError(errorMessage);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
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
