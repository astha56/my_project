import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './RestaurantDetail.css';

export function RestaurantDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState('');

  // Fetch restaurant and reviews on load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8000/api/restaurants/${id}/`);
        const data = await res.json();
        setRestaurant(data);
        
        // Fetch reviews for this restaurant separately from /api/reviews?restaurant=<id>
        const reviewsRes = await fetch(`http://localhost:8000/api/reviews/?restaurant=${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Filter menu items based on search and diet filter
  const filteredMenuItems = useMemo(() => {
    if (!restaurant) return [];
    return restaurant.menu_items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiet =
        dietFilter === 'all' ||
        (dietFilter === 'veg' && item.is_veg) ||
        (dietFilter === 'non-veg' && !item.is_veg);
      return matchesSearch && matchesDiet;
    });
  }, [searchTerm, dietFilter, restaurant]);

  // Submit new review to backend
  const handleReviewSubmit = async () => {
    if (!newReview.trim()) {
      setError('Please enter your review.');
      return;
    }
    setError('');

    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    const reviewPayload = {
      restaurant: id,
      customer_name: user.name,
      text: newReview,
      rating: newRating,
    };

    try {
      const res = await fetch('http://localhost:8000/api/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token here if your API requires it, e.g. Authorization: Bearer <token>
        },
        body: JSON.stringify(reviewPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to submit review');
      }

      const savedReview = await res.json();

      // Add newly saved review to the top of the list
      setReviews(prev => [savedReview, ...prev]);
      setNewReview('');
      setNewRating(5);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="restaurant-page">
      <div className="restaurant-header">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-header-img" />
        <div className="restaurant-header-overlay">
          <h1 className="restaurant-title">{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-meta">
            <span>⭐ {restaurant.rating || '4.3'}</span>
            <span>🕒 30-40 min</span>
            <span>📍 {restaurant.location || 'Banehswor, Kathmandu'}</span>
            <span>📞 {restaurant.phone || '9845312790'}</span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        <div className="menu-filters">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="menu-search"
          />
          <select className="menu-category" value="Main Course" disabled>
            <option>Main Course</option>
          </select>
          <select
            value={dietFilter}
            onChange={e => setDietFilter(e.target.value)}
            className="menu-diet"
          >
            <option value="all">All Items</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
          <div className="veg-indicator">
            <CheckCircle size={16} color="green" />
            Vegetarian items marked
          </div>
        </div>

        <div className="menu-grid">
          {filteredMenuItems.length === 0 && <p>No menu items found.</p>}
          {filteredMenuItems.map(item => (
            <div key={item.id} className="menu-card">
              <img
                src={item.image || '/images/chicken.jpg'}
                alt={item.name}
                className="menu-card-img"
              />
              <h3 className="menu-card-title">{item.name}</h3>
              <p>{item.description}</p>
              <p className="menu-card-price">Nrs. {parseFloat(item.price).toFixed(2)}</p>
              <button className="add-to-cart-btn" onClick={() => addItem(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="review-section">
        <h2>Customer Reviews</h2>

        <div className="review-form">
          <textarea
            placeholder="Write your review..."
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
          />
          <select value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} Star</option>
            ))}
          </select>
          <button onClick={handleReviewSubmit}>Submit Review</button>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="review-list">
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((rev, index) => (
            <div key={index} className="review-card">
              <p className="review-rating">⭐ {rev.rating}</p>
              <p className="review-text">"{rev.text}"</p>
              <p className="review-name">- {rev.customer_name || "Anonymous"}</p>
              <p className="review-date">{rev.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
