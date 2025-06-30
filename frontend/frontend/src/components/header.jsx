import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export function Header() {
  // Stub user and items for now; replace with real auth/cart logic later
  const user = null; // or { name: 'Astha', role: 'customer' }
  const items = []; // cart items array
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic later
    alert('Logout clicked');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-circle">FC</div>
          <span className="logo-text">FoodConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {user ? (
            <div className="nav-items">
              {user.role === 'customer' && (
                <>
                  <Link to="/restaurants" className="nav-link">Restaurants</Link>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                  <Link to="/cart" className="cart-link">
                    🛒
                    {items.length > 0 && (
                      <span className="cart-badge">{items.length}</span>
                    )}
                  </Link>
                </>
              )}

              {(user.role === 'admin' || user.role === 'restaurant') && (
                <Link to={`/${user.role}`} className="nav-link">Dashboard</Link>
              )}

              <div className="user-info">
                <span role="img" aria-label="User" className="icon">👤</span>
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="nav-mobile">
          <div className="mobile-links">
            {user ? (
              <>
                {user.role === 'customer' && (
                  <>
                    <Link to="/restaurants" className="nav-link" onClick={toggleMobileMenu}>Restaurants</Link>
                    <Link to="/orders" className="nav-link" onClick={toggleMobileMenu}>My Orders</Link>
                    <Link to="/cart" className="nav-link" onClick={toggleMobileMenu}>
                      🛒 Cart ({items.length})
                    </Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'restaurant') && (
                  <Link to={`/${user.role}`} className="nav-link" onClick={toggleMobileMenu}>Dashboard</Link>
                )}
                <div className="user-info">
                  <span role="img" aria-label="User" className="icon">👤</span>
                  <span>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="register-button" onClick={toggleMobileMenu}>Register</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
