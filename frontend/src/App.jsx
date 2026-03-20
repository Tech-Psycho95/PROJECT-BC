import React from 'react';
import AuroraBackground from './components/AuroraBackground';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import About from './pages/About';

const App = () => {
  const path = window.location.pathname;

  // Pages that should NOT show the navbar (full-screen experiences)
  const hideNavbarPages = ['/', '/login'];
  const showNavbar = !hideNavbarPages.includes(path);

  // Route protection: redirect to /login if no token for protected routes
  const isAuthenticated = !!localStorage.getItem('token');

  let currentView;
  if (path === '/') {
    currentView = <Home />;
  } else if (path === '/login') {
    currentView = <Login />;
  } else if (path === '/onboarding') {
    currentView = <Onboarding />;
  } else if (path === '/analysis') {
    currentView = <Analysis />;
  } else if (path === '/dashboard') {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    currentView = <Dashboard />;
  } else if (path === '/about') {
    currentView = <About />;
  } else {
    currentView = <Home />;
  }

  // Wrap everything in AuroraBackground for consistent styling
  // For pages without navbar, render without Layout wrapper
  if (!showNavbar) {
    return (
      <AuroraBackground>
        {currentView}
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <Layout>
        {currentView}
      </Layout>
    </AuroraBackground>
  );
};

export default App;
