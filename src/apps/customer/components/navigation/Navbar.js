
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/AuthContext';
import CartIcon from '../../../../shared/components/CartIcon';
import CartSidebar from '../../../../shared/components/CartSidebar';
import './Navbar.css';
import logo from '../../../../assets/images/logos/saptnova_logo.png';

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const collectionsRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Re-render when authentication state changes
  useEffect(() => {
    // This effect ensures the component updates when user logs in/out
    console.log('Auth state changed:', { isAuthenticated, user: user?.email });
  }, [isAuthenticated, user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collectionsRef.current && !collectionsRef.current.contains(event.target)) {
        setIsCollectionsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch categories from backend
      const response = await fetch('http://localhost:8000/categories/');
      console.log('Categories API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } else {
        console.error('Failed to fetch categories, status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback categories if API fails
      setCategories([
        { id: 1, name: 'SAPTNOVA', slug: 'saptnova' },
        { id: 2, name: 'YakritNova', slug: 'yakritnova' },
        { id: 3, name: 'MVNova', slug: 'mvnova' },
        { id: 4, name: 'MadhuNova', slug: 'madhunova' },
        { id: 5, name: 'InsuWish', slug: 'insuwish' },
        { id: 6, name: 'Cardiowish', slug: 'cardiowish' }
      ]);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all-products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/all-products?category=${category.slug}`);
    setIsCollectionsOpen(false);
  };

  return (
    <>
    <nav className="customer-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="SAPTNOVA Logo" />
        </Link>

        {/* Main Navigation Links */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          
          {/* Collections Dropdown */}
          <li className="navbar-dropdown" ref={collectionsRef}>
            <button 
              className="dropdown-trigger"
              onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
            >
              Collections
              <span className={`dropdown-arrow ${isCollectionsOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isCollectionsOpen && (
              <div className="dropdown-menu">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className="dropdown-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </li>

          <li><Link to="/all-products">All Products</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <div className="search-container" ref={searchRef}>
            <button 
              className="search-icon-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
            >
              🔍
            </button>
            {isSearchOpen && (
              <form className="search-dropdown" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-submit-btn">Search</button>
              </form>
            )}
          </div>

          {/* User Account */}
          {isAuthenticated ? (
            <Link to="/account" className="account-link">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.full_name || user?.username || 'Account'}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}

          {/* Cart Icon */}
          <button className="cart-btn" onClick={toggleCart} title="Shopping Cart">
            <CartIcon className="navbar-cart-icon" />
          </button>
        </div>
      </div>
    </nav>
    
    {/* Cart Sidebar */}
    <CartSidebar 
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
    />
    </>
  );
}

export default Navbar;
