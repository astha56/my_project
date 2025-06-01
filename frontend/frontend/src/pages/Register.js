import React, { useState } from 'react';
import './RegistrationForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    terms: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check terms
    if (!formData.terms) {
      alert('Please accept the terms and conditions.');
      return;
    }

    // Check password match
    if (formData.password !== formData.retypePassword) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare data for backend
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    // Call backend API
     fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then((data) => setMessage('Registered successfully!'))
      .catch((error) => setMessage('Error: ' + error.message));
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">🍕 Foodie Sign Up</h2>

        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter a username"
          value={formData.fullName}
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

        {message && <p>{message}</p>} {/* Show success or error */}

        <div className="social-login">
          <p>Or sign up with:</p>
          <div className="icons">
            <span className="icon facebook">f</span>
            <span className="icon gmail">@</span>
          </div>
        </div>

        <p className="login-link">
          Already have an account? <a href="login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;

