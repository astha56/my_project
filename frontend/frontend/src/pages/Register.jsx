import React, { useState } from 'react';
import './RegistrationForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    role: 'customer', // default role
    terms: false,
  });

  const [message, setMessage] = useState('');

  // Define all available roles here
  const roles = [
    { value: 'customer', label: 'Customer' },
    { value: 'restaurant_owner', label: 'Restaurant Owner' },
    { value: 'admin', label: 'Admin' },
    
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert('Please accept the terms and conditions.');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => setMessage('Registered successfully!'))
      .catch((error) => setMessage('Error: ' + error.message));
  };

  return (
    <div className="auth-bg">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">🍕 Foodie Sign Up</h2>

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Re-type Password</label>
          <input
            type="password"
            name="retypePassword"
            placeholder="Confirm password again"
            value={formData.retypePassword}
            onChange={handleChange}
            required
          />

          {/* ✅ Dynamic Role Selection */}
          <label>Register as:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <label className="terms-row">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            I accept the Terms and Conditions
          </label>

          <button type="submit">Sign Up</button>

          {message && <p>{message}</p>}

          <div className="social-login">
            <p>Or sign up with:</p>
            <div className="icons">
              <span className="icon facebook">f</span>
              <span className="icon gmail">@</span>
            </div>
          </div>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
