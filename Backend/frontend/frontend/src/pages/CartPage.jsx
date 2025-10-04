import React from 'react';
import { Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/cart.css';

export function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty. Add some items before checkout.");
      return;
    }
    

    const address = prompt("Enter delivery address:");
    if (!address) return;

    try {
      const res = await fetch("http://localhost:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_address: address,
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            name: item.name,    // send if backend expects this
            price: item.price,  // send if backend expects this
          })),
          total_cost: parseFloat((total + 99 + total * 0.08).toFixed(2)),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Checkout error:", errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Checkout failed");
      }

      alert("Order placed successfully!");
      navigate("/orders");

    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-container">
          <div className="cart-empty-box">
            <div className="cart-empty-icon">
              <CreditCard className="icon" />
            </div>
            <h2 className="cart-empty-heading">Your cart is empty</h2>
            <p className="cart-empty-text">Add some delicious items from our restaurants!</p>
            <Link to="/restaurants" className="cart-empty-button">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-heading">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-box">
              <div className="cart-item-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">Nrs.{item.price}</p>
                    </div>

                    <div className="cart-quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="icon-small" />
                      </button>
                      <span className="cart-qty-text">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus className="icon-small" />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      <p className="cart-item-subtotal">Nrs.{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cart-remove-btn"
                        aria-label="Remove item"
                      >
                        <Trash2 className="icon-small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-summary">
            <div className="order-summary-box">
              <h3 className="order-summary-heading">Order Summary</h3>

              <div className="order-summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Nrs.{total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>Nrs. 99</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>Nrs.{(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>Nrs.{(total + 99 + total * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="checkout-button">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
