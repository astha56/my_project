import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Extract role from response (make sure backend returns it)
        const userRole = data.user?.role || data.role || 'customer';

        // Save tokens in localStorage
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        // Save user info in auth context
        login({
          name: credentials.username,
          role: userRole,
          token: data.access,
          refreshToken: data.refresh,
        });

        alert(`Welcome back, ${credentials.username}! 🍟`);

        // Redirect based on role
        if (userRole === 'customer') {
          navigate('/dashboard');
        } else if (userRole === 'restaurant_owner') {
          navigate('/restaurant-dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } 
      } else {
        setError(data.detail || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="auth-bg">
      <div className="form-container">
        <h2 className="form-title">🍟 Foodie Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <div className="options-row">
            <label>
              <input type="checkbox" name="rememberMe" />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit">Log In 🍩</button>

          <div className="social-login">
            <p>Or login with:</p>
            <div className="icons">
              <span className="icon facebook">f</span>
              <span className="icon gmail">@</span>
            </div>
          </div>

          <p className="signup-text">
            Don’t have an account? <Link to="/register" className="signup-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
