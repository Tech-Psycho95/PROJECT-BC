import React from 'react';

const Logo = () => {
  const styles = {
    link: {
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    text: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '900',
      fontSize: '1.85rem',
      letterSpacing: '-0.04em',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textTransform: 'uppercase',
      margin: 0,
      transition: 'opacity 0.2s ease',
    }
  };

  const logoHref = typeof window !== 'undefined' && localStorage.getItem('token') ? '/dashboard' : '/';

  return (
    <a href={logoHref} style={styles.link} className="brand-logo" onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
      <h1 style={styles.text}>STRIDE</h1>
    </a>
  );
};

export default Logo;
