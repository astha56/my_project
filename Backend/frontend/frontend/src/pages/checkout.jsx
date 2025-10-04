import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import '../pages/checkout.css';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [location, setLocation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOrder = { ...formData, location };
    localStorage.setItem('orderDetails', JSON.stringify(fullOrder));
    navigate('/payment');
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </label>

          <label>
            Delivery Address:
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={4}
              required
            />
          </label>
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
            Selected Location:{" "}
            {location
              ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
              : "Click on the map"}
          </p>
        </div>

        <div className="button-center">
          <button type="submit" disabled={!location}>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
