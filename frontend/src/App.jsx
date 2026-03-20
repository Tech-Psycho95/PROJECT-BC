import React from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import About from './pages/About';

const App = () => {
  const path = window.location.pathname;

  let currentView;
  if (path === '/onboarding') {
    currentView = <Onboarding />;
  } else if (path === '/analysis') {
    currentView = <Analysis />;
  } else if (path === '/dashboard') {
    currentView = <Dashboard />;
  } else if (path === '/about') {
    currentView = <About />;
  } else {
    currentView = <Login />;
  }

  return (
    <Layout>
      {currentView}
    </Layout>
  );
};

export default App;
