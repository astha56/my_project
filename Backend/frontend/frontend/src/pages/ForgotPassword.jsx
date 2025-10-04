import React from 'react';

function ForgotPassword() {
  return (
    <div className="form-container">
      <h2>🔒 Forgot Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      <form>
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
