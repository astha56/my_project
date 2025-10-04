import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useCart } from '../context/CartContext';
import '../pages/checkout.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to pick location on map
const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items: cartItems, total } = useCart(); // Get cart from context

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    delivery_address: '',
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.full_name.trim()) return setError("Full Name is required.");
    if (!formData.phone_number.trim()) return setError("Phone Number is required.");
    if (!formData.delivery_address.trim()) return setError("Delivery Address is required.");
    if (!location) return setError("Please select a delivery location on the map.");
    if (cartItems.length === 0) return setError("Your cart is empty.");

    // Calculate full total including delivery fee and tax
    const deliveryFee = 99;
    const taxRate = 0.08; // 8% tax
    const fullTotal = parseFloat((total + deliveryFee + total * taxRate).toFixed(2));

    // Build payload for backend
    const fullOrder = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      delivery_address: formData.delivery_address,
      latitude: Number(location.lat.toFixed(6)),
      longitude: Number(location.lng.toFixed(6)),
      total_cost: fullTotal, // ✅ full total including delivery + tax
      items: cartItems.map(item => ({
        menu_item: item.id, // backend expects menu_item ID
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log("Submitting order:", fullOrder);

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/new/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullOrder),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend validation error:", data);
        throw new Error(JSON.stringify(data));
      }

      console.log('Order submitted:', data);

      // Save order & prepare Khalti payment
      localStorage.setItem('orderDetails', JSON.stringify(data));
      const khaltiPayment = {
        product_identity: data.order_id || data.id,
        product_name: `Order #${data.order_id || data.id}`,
        amount: Math.round(fullTotal * 100), // amount in paisa
      };
      localStorage.setItem('khaltiPayment', JSON.stringify(khaltiPayment));

      navigate('/khalti-payment');

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Enter Delivery Information</h2>
      <form onSubmit={handleSubmit} className="checkout-form-layout">
        <div className="form-left">
          <label>
            Full Name:
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </label>
          <label>
            Phone Number:
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
            />
          </label>
          <label>
            Delivery Address:
            <textarea
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              rows={4}
              required
            />
          </label>
          <p>Total Cost (including delivery + tax): Rs. {parseFloat((total + 99 + total * 0.08).toFixed(2))}</p>
        </div>

        <div className="map-right">
          <h3>Choose Delivery Location on Map</h3>
          <MapContainer
            center={[27.7172, 85.3240]}
            zoom={13}
            style={{ height: '350px', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location} />}
          </MapContainer>
          <p className="location-info">
            Selected Location: {location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : "Click on the map"}
          </p>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="button-center">
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}
