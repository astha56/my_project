import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RestaurantOwnerDashboard.css";

export default function RestaurantOwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [loading, setLoading] = useState(true);

  const restaurantId = 1; // Replace with dynamic restaurant ID based on logged-in owner

  useEffect(() => {
    const fetchRestaurant = axios.get(`http://127.0.0.1:8000/api/restaurants/${restaurantId}/`);
    const fetchOrders = axios.get(`http://127.0.0.1:8000/api/restaurant/${restaurantId}/orders/`);
    const fetchReviews = axios.get(`http://127.0.0.1:8000/api/restaurant/${restaurantId}/reviews/`);

    Promise.all([fetchRestaurant, fetchOrders, fetchReviews])
      .then(([resRestaurant, resOrders, resReviews]) => {
        setRestaurant({
          ...resRestaurant.data,
          about_us: "Welcome to Spice bites, where culinary passion meets exceptional dining experiences. Founded with a mission to bring fresh, flavorful, and memorable meals to our community, we take pride in crafting dishes that combine quality ingredients with authentic flavors. From our signature dishes to our seasonal specials, every item on our menu is carefully prepared with love and attention to detail. At Gourmet Haven, we believe that dining is not just about food—it’s about creating moments, sharing joy, and delighting every guest who walks through our doors. Join us, and experience the perfect blend of taste, ambiance, and hospitality!"
        });
        setMenuItems(resRestaurant.data.menu_items || []);
        setOrders(resOrders.data);
        setReviews(resReviews.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [restaurantId]);

  const handleOrderAction = (id, action) => {
    axios.post(`http://127.0.0.1:8000/api/restaurant/orders/${id}/${action}/`)
      .then(() => {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: action } : o)));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        {restaurant.image && <img src={restaurant.image} alt={restaurant.name} className="hero-image"/>}
        <div className="hero-text">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="stats">
            <div className="stat">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat">
              <h3>${orders.reduce((a,b)=>a+(b.total_cost||0),0)}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="stat">
              <h3>{orders.filter(o=>o.status==="pending").length}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <h2>Our Menus</h2>
        <div className="menu-cards">
          {menuItems.length === 0 && <p>No menu items yet.</p>}
          {menuItems.map(item => (
            <div className="menu-card" key={item.id}>
              {item.image && <img src={item.image} alt={item.name} />}
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="menu-price">${item.price}</p>
              <p>{item.is_veg ? "🌱 Veg" : "🍖 Non-Veg"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Orders Section */}
      <section className="orders-section">
        <h2>Orders</h2>
        <div className="orders-cards">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className={`badge ${order.status}`}>{order.status || "pending"}</span>
              </div>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Items:</strong> {(order.items || []).map(i=>i.name).join(", ")}</p>
              <p><strong>Total:</strong> ${order.total_cost}</p>
              {order.status==="pending" && (
                <div className="order-actions">
                  <button className="btn-accept" onClick={()=>handleOrderAction(order.id,"accepted")}>Accept</button>
                  <button className="btn-reject" onClick={()=>handleOrderAction(order.id,"rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>{restaurant.about_us}</p>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>What Our Customers Say</h2>
        <div className="reviews-cards">
          {reviews.length===0 && <p>No reviews yet.</p>}
          {reviews.map(review=>(
            <div className="review-card" key={review.id}>
              <p className="review-user">{review.customer_name}</p>
              <p className="review-rating">{"⭐".repeat(review.rating)}</p>
              <p className="review-comment">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
