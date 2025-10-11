
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './shared/context/CartContext';
import { AuthProvider } from './shared/context/AuthContext';
import Navbar from './apps/customer/components/navigation/Navbar';
import ProductCatalog from './apps/customer/components/catalog/ModernProductCatalog';
import SaptnovaProductCatalog from './apps/customer/components/catalog/SaptnovaProductCatalog';
import AllProductsPage from './apps/customer/components/catalog/AllProductsPage';
import PresentationMode from './apps/customer/components/catalog/PresentationMode';
import AdminPanel from './apps/admin/AdminPanel';
import VendorPanel from './apps/vendor/VendorPanel';
import { ModernFooter } from './shared/components/layout';
import FooterDemo from './FooterDemo';
import Page_1 from './apps/customer/components/products/Page_1_-_SAPTNOVA';
import Page_2 from './apps/customer/components/products/Page_2_-_About_Us';
import Page_3 from './apps/customer/components/products/Page_3_-_YakritNova';
import Page_4 from './apps/customer/components/products/Page_4_-_MVNova';
import Page_5 from './apps/customer/components/products/Page_5_-_MadhuNova';
import Page_6 from './apps/customer/components/products/Page_6_-_InsuWish';
import Page_7 from './apps/customer/components/products/Page_7_-_Cardiowish';
import ProductDetailsPage from './apps/customer/components/products/ProductDetailsPage';
import ProductDetailsDemo from './ProductDetailsDemo';
import RegisterPage from './apps/customer/pages/RegisterPage';
import LoginPage from './apps/customer/pages/LoginPage';
import AccountPage from './apps/customer/pages/AccountPage';
import ContactPage from './apps/customer/pages/ContactPage';
import OrdersPage from './apps/customer/pages/OrdersPage';
import WishlistPage from './apps/customer/pages/WishlistPage';
import TrackOrderPage from './apps/customer/pages/TrackOrderPage';
import ProtectedRoute from './shared/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Routes>
        {/* Admin Panel - Full screen without navbar */}
        <Route path="/admin/*" element={<AdminPanel />} />
        
        {/* Vendor Panel - Full screen without navbar */}
        <Route path="/vendor/*" element={<VendorPanel />} />
        
        {/* Presentation mode without navbar for full-screen experience */}
        <Route path="/presentation" element={<PresentationMode />} />
        
        {/* Footer Demo - Full screen */}
        <Route path="/footer-demo" element={<FooterDemo />} />
        
        {/* Product Details Demo - Full screen */}
        <Route path="/product-details-demo" element={<ProductDetailsDemo />} />
        
        {/* Authentication Pages - Full screen */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/track-order" element={<TrackOrderPage />} />
        
        {/* Regular pages with navbar and footer */}
        <Route path="/*" element={
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<SaptnovaProductCatalog />} />
                <Route path="/all-products" element={<AllProductsPage />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Product Detail Pages - Support both /product/ and /products/ */}
                <Route path="/product/:productId" element={<ProductDetailsPage />} />
                <Route path="/products/:productId" element={<ProductDetailsPage />} />
                
                {/* Legacy Product Pages */}
                <Route path="/saptnova" element={<Page_1 />} />
                <Route path="/about" element={<Page_2 />} />
                <Route path="/yakritnova" element={<Page_3 />} />
                <Route path="/mvnova" element={<Page_4 />} />
                <Route path="/madhunova" element={<Page_5 />} />
                <Route path="/insuwish" element={<Page_6 />} />
                <Route path="/cardiowish" element={<Page_7 />} />
              </Routes>
            </main>
            <ModernFooter />
          </div>
        } />
      </Routes>
    </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
