import React from 'react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-logo-wrapper">
        <h1>STRIDE</h1>
      </div>
      <p className="home-tagline">YOUR career UPTO speed</p>
      <div className="home-actions">
        <a href="/login" className="home-btn home-btn-primary">Login</a>
        <a href="/login?signup=true" className="home-btn home-btn-secondary">Sign Up</a>
      </div>
    </div>
  );
};

export default Home;
