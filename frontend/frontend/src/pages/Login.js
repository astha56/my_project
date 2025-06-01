import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import
import './LoginForm.css';

function LoginForm() {
  const navigate = useNavigate(); // ✅ initialize
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        alert('Welcome back, foodie! 🍟');
        navigate('/dashboard'); // ✅ redirect here
      } else {
        setError(data.detail || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
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
          <a href="#" className="forgot-link">Forgot password?</a>
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
          Don’t have an account? <a href="Register" className="signup-link">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
