import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './RestaurantDetail.css';

export function RestaurantDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/restaurants/${id}/`);
        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

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

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="restaurant-page">
      <div className="restaurant-header">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-header-img"
        />
        <div className="restaurant-header-overlay">
          <h1 className="restaurant-title">{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-meta">
            <span>⭐ {restaurant.rating || '4.3'}</span>
            <span>🕒 30-40 min</span>
            <span>📍 {restaurant.location || '456 Curry Lane, City'}</span>
            <span>📞 {restaurant.phone || '+1-234-567-8901'}</span>
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
              <p className="menu-card-price">${parseFloat(item.price).toFixed(2)}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => addItem(item)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
