import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css'; // Make sure this file exists

export function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
      <div className="restaurant-image-container"> {/* Added a container for image and status */}
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <span
          className={`restaurant-status ${
            restaurant.status === 'active' ? 'status-active' : 'status-pending'
          }`}
        >
          {restaurant.status === 'active' ? 'Open' : 'Pending'}
        </span>
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-description">{restaurant.description}</p>

        <div className="restaurant-meta">
          <div className="rating">
            ★
            <span>{restaurant.rating}</span>
          </div>
          <div className="delivery-time">
            ⏱
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>

        <div className="restaurant-footer">
          <span className="restaurant-cuisine">{restaurant.cuisine}</span>
          <span className="view-menu">View Menu →</span>
        </div>
      </div>
    </Link>
  );
}