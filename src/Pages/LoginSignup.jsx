import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './CSS/LoginSignup.css'; 

const LoginSignup = () => {
  // State for managing input values
  const [form, setForm] = useState({
    email: '',
    password: '',
    agreeToTerms: false
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      alert('Please fill in all fields.');
      return;
    }
    if (!form.agreeToTerms) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    console.log('Form Submitted', form);
    // Here you might want to send the form data to a server
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="loginsignup-fields">
            <input
              type="email"
              placeholder='Email Address'
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder='Password'
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="loginsignup-agree">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={form.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
              By continuing, I agree to the terms of use & privacy policy.
            </label>
          </div>
          <button type="submit">Continue</button>
          <p className="loginsignup-login">
            Don't have an account? <Link to="/signup" className="login-link">Signup here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;

