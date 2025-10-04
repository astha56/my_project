import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css'; // Make sure this file exists

export function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
      
      <div className="restaurant-image-container"> {/* Added a container for image and status */}
        <img
          className="restaurant-image"
          src={`http://127.0.0.1:8000${restaurant.image}`}
          alt={restaurant.name}
          
        />
        
       
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