import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Truck, Star } from 'lucide-react';
import '../pages/Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { RestaurantCard } from '../components/RestaurantCard';


export default function HomePage() {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/restaurants/')
    
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch restaurants');
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Connecting You with Local Flavors</h1>
            <p>Discover amazing restaurants in your neighborhood</p>

            {!user && (
              <div className="hero-buttons">
                <Link to="/register" className="btn primary">
                  Get Started
                </Link>
                <Link to="/restaurants" className="btn secondary">
                  Browse Restaurants
                </Link>
              </div>
            )}
            {user && user.role === 'customer' && (
              <Link to="/restaurants" className="btn primary">
                Start Ordering
              </Link>
            )}
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-bar">
            <input type="text" placeholder="Search restaurants..." />
            <button>
              <Search size={20} />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Why Choose FoodConnect?</h2>
          <div className="features-grid">
            <div className="feature-item orange">
              <div className="icon">
                <Search />
              </div>
              <h3>Easy Discovery</h3>
              <p>Find restaurants by cuisine, rating, or dietary preferences</p>
            </div>
            <div className="feature-item green">
              <div className="icon">
                <Truck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery from your favorite local spots</p>
            </div>
            <div className="feature-item blue">
              <div className="icon">
                <Star />
              </div>
              <h3>Quality Assured</h3>
              <p>Reviews and ratings help you make the best choices</p>
            </div>
          </div>
        </section>

        {/* Featured Restaurants */}
        <section>
          <div className="featured-section">
            <div className="featured-container">
              <div className="featured-header">
                <h2 className="featured-title">Featured Restaurants</h2>
                <Link to="/restaurants" className="featured-links">
                  View All →
                </Link>
              </div>
            </div>
            <div className="featured-grid">
              {loading && <p>Loading restaurants...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading &&
                !error &&
                restaurants.slice(0, 3).map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section className="partner-section">
          <div className="partner-container">
            <h2 className="partner-heading"> Own a Restaurant </h2>
            <p className="partner-sub-text">
              Join our platform and reach more customers
            </p>
            <Link to="/register" className="partner-button">
              Partner with Us
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2025 FoodConnect. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
