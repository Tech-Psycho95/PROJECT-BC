import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import '../styles/navbar.css';

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    setIsLoggedIn(!!localStorage.getItem('token'));

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('analysisResult');
      localStorage.removeItem('roadmapData');
      window.location.href = '/';
    }
  };

  return (
    <nav className="navbar">
      <Logo />
      
      <div className="navbar-links">
        <a 
          href="/dashboard" 
          className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </a>
        <a 
          href="/about" 
          className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
        >
          About
        </a>
        {isLoggedIn && (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
