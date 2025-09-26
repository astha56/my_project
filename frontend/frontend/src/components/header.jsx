import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';  
import './header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();   // get cart items
  const cartCount = items?.length ?? 0;  // safe access
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-circle">FC</div>
          <span className="logo-text">FoodConnect</span>
        </Link>

        <nav className="nav-desktop">
          {user ? (
            <div className="nav-items">
              {user.role === 'customer' && (
                <>
                  <Link to="/restaurants" className="nav-link">Restaurants</Link>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                  <Link to= "/notification" className= "nav-link">Notification </Link>
                  <Link to="/cart" className="cart-link">
                    <ShoppingCart />
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </Link> 
                </>
              )}

              {(user.role === 'admin' || user.role === 'restaurant') && (
                <Link to={`/${user.role}`} className="nav-link">Dashboard</Link>
              )}

              <div className="user-info">
                <User className="icon" />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-button">
                  <LogOut />
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </nav>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="nav-mobile">
          <div className="mobile-links">
            {user ? (
              <>
                {user.role === 'customer' && (
                  <>
                    <Link to="/restaurants" onClick={toggleMobileMenu}>Restaurants</Link>
                    <Link to="/orders" onClick={toggleMobileMenu}>My Orders</Link>
                    <Link to="/cart" onClick={toggleMobileMenu}>
                      <ShoppingCart /> ({cartCount})
                    </Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'restaurant') && (
                  <Link to={`/${user.role}`} onClick={toggleMobileMenu}>Dashboard</Link>
                )}
                <div className="user-info">
                  <User className="icon" />
                  <span>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                  <LogOut />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" onClick={toggleMobileMenu}>Register</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
