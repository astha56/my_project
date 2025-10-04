// src/components/MenuItemCard.jsx
import React from 'react';
import { Star, Plus, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MenuItemCard.css';

export function MenuItemCard({ item }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  

  return (
    <div className="menu-item-card">
      <div className="image-container">
        <img src={item.image} alt={item.name} className="menu-item-image" />
        <div className="badges">
          {item.isVeg && (
            <div className="veg-icon">
              <Leaf className="icon green" />
            </div>
          )}
          {!item.isAvailable && (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>

      <div className="menu-item-content">
        <h3 className="menu-item-title">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>

        <div className="menu-item-meta">
          <div className="rating">
            <Star className="icon yellow" />
            <span className="rating-value">{item.rating}</span>
            <span className="rating-count">({item.reviews})</span>
          </div>
          <span className="price">Nrs.{item.price}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          className={`add-to-cart-button Nrs. {item.isAvailable ? '' : 'disabled'}`}
          
        >
          <Plus className="icon" />
          <span>{item.isAvailable ? 'Add to Cart' : 'Unavailable'}</span>
        </button>
      </div>
    </div>
  );
}
