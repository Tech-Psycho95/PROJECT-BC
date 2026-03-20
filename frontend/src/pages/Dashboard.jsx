import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

const Dashboard = () => {
  // Explicitly empty dynamic data to enforce strict reliance on backend results
  const [progress] = useState({
    completed: 0,
    total: 0,
    percentage: 0
  });
  const [skills] = useState([]);
  const [gaps] = useState([]);
  const [roadmap] = useState([]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="module-badge badge-completed">Done</span>;
      case 'active': return <span className="module-badge badge-active">Active</span>;
      default: return <span className="module-badge badge-locked">Locked</span>;
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Your personalized path to mastering the target role.</p>
        </div>
        
        {/* Progress Tracker (Fake indicator) */}
        <motion.section 
          className="progress-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="progress-info">
            <h3>Course Progress</h3>
            <span className="progress-pct">{progress.percentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </motion.section>

        {/* Two Column Grid for Skills & Gaps */}
        <div className="dashboard-grid">
          {/* Skill Overview */}
          <motion.section 
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>📊 Skill Overview</h3>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <div key={index} className="skill-bar-container">
                  <div className="skill-bar-header">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Gap Analysis */}
          <motion.section 
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>🎯 Gap Analysis</h3>
            <div className="gap-list">
              {gaps.map((gap, index) => (
                <div key={index} className="gap-item">
                  <div className="gap-item-content">
                    <h4>{gap.name}</h4>
                    <p>{gap.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Roadmap Timeline */}
        <section className="roadmap-section">
          <h2>Learning Roadmap</h2>
          <div className="timeline">
            {roadmap.map((module, index) => (
              <motion.div 
                key={module.id} 
                className={`module-card ${module.status}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="module-dot"></div>
                <div className="module-header">
                  <div className="module-title-group">
                    <span className="timeframe-tag">{module.timeframe}</span>
                    <h3>{module.title}</h3>
                  </div>
                  {getStatusBadge(module.status)}
                </div>
                <p className="module-desc">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
