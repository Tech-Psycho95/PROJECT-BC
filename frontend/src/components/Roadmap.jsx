import React from 'react';

const Roadmap = ({ items }) => {
  return (
    <div className="roadmap">
      <h2>Your Learning Roadmap</h2>
      <ul className="roadmap-list">
        {items?.map((item, index) => (
          <li key={index} className="roadmap-item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roadmap;
