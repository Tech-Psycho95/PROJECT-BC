import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import '../styles/navbar.css';

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState('');

  // Hydrate the path on the client to easily check the active route natively without react-router
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    // Safety listener if window history pushState is used by other parts of the app
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLogout = () => {
    console.log('Logging out the user...');
    // Directly navigate back to login root on logout
    window.location.href = '/login';
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
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
