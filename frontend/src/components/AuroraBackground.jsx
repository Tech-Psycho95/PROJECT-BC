import React from 'react';
import Aurora from './Aurora';

const AuroraBackground = ({ children }) => {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* Aurora WebGL background layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#6C5CE7"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
      </div>
      {/* Content layer above Aurora */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
