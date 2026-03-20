import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [employabilityScore, setEmployabilityScore] = useState(0);
  const [candidateName, setCandidateName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let missingSkills = [];
    const savedAnalysis = localStorage.getItem('analysisResult');
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        setSkills((parsed.extractedSkills || []).map(s => ({
          name: s.name,
          level: s.level || 'intermediate'
        })));
        setGaps((parsed.gapAnalysis?.toLearn || []).map(g => ({
          name: g.name,
          reason: g.reason
        })));
        setEmployabilityScore(parsed.employabilityScore || 0);
        setCandidateName(parsed.name || '');
        missingSkills = (parsed.gapAnalysis?.toLearn || []).map(g => g.name);
      } catch (err) {
        console.error("Error loading analysis:", err);
      }
    }

    const savedRoadmap = localStorage.getItem('roadmapData');
    if (savedRoadmap) {
      try {
        const parsedRoadmap = JSON.parse(savedRoadmap);
        if (parsedRoadmap.length > 0) {
          loadRoadmap(parsedRoadmap);
          return;
        }
      } catch (err) {
        console.error("Error loading roadmap:", err);
      }
    }
    if (missingSkills.length > 0) generateRoadmap(missingSkills);
  }, []);

  const loadRoadmap = (data) => {
    setRoadmap(data);
  };

  const generateRoadmap = async (missingSkills) => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5005/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missingSkills })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const generated = data.roadmap || [];
      localStorage.setItem('roadmapData', JSON.stringify(generated));
      loadRoadmap(generated);
    } catch (err) {
      console.error("Error generating roadmap:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const nodeColors = [
    { bg: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { bg: '#f5576c', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { bg: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { bg: '#43e97b', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { bg: '#fa709a', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { bg: '#a18cd1', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
    { bg: '#ff9a9e', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
    { bg: '#66a6ff', gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)' },
  ];

  const getLevelConfig = (level) => {
    switch(level) {
      case 'advanced': return { label: 'Advanced', color: '#10b981', bg: '#d1fae5' };
      case 'intermediate': return { label: 'Intermediate', color: '#3b82f6', bg: '#dbeafe' };
      default: return { label: 'Beginner', color: '#f59e0b', bg: '#fef3c7' };
    }
  };

  const circumference = 2 * Math.PI * 54;
  const scoreOffset = circumference - (employabilityScore / 100) * circumference;
  const scoreColor = employabilityScore >= 70 ? '#10b981' : employabilityScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="dash-page">
      {/* Hero Section */}
      <div className="dash-hero">
        <motion.div 
          className="dash-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>{candidateName ? `${candidateName}'s Learning Path` : 'Your Learning Path'}</h1>
          <p>Personalized roadmap to master your target role</p>
        </motion.div>
      </div>

      <main className="dash-content">
        {/* Stats Row */}
        <div className="stats-row">
          {/* Circular Score */}
          <motion.div 
            className="score-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="circular-score">
              <svg viewBox="0 0 120 120" className="score-ring">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <motion.circle 
                  cx="60" cy="60" r="54" fill="none" 
                  stroke={scoreColor}
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: scoreOffset }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="score-value">
                <span className="score-number">{employabilityScore}</span>
                <span className="score-label">Score</span>
              </div>
            </div>
            <h3>Employability</h3>
          </motion.div>

          {/* Skills Count */}
          <motion.div 
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>✅</div>
            <div className="stat-info">
              <span className="stat-number">{skills.length}</span>
              <span className="stat-label">Skills Found</span>
            </div>
          </motion.div>

          {/* Gaps Count */}
          <motion.div 
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>📚</div>
            <div className="stat-info">
              <span className="stat-number">{gaps.length}</span>
              <span className="stat-label">Skills to Learn</span>
            </div>
          </motion.div>

          {/* Modules Count */}
          <motion.div 
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>🗺️</div>
            <div className="stat-info">
              <span className="stat-number">{roadmap.length}</span>
              <span className="stat-label">Modules</span>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div className="section-grid">
          <motion.div 
            className="glass-card section-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="section-header">
              <h2>💪 Your Skills</h2>
              <span className="section-count">{skills.length} skills</span>
            </div>
            {skills.length === 0 ? (
              <p className="empty-text">No skills detected yet.</p>
            ) : (
              <div className="skill-chips">
                {skills.map((skill, i) => {
                  const config = getLevelConfig(skill.level);
                  return (
                    <motion.div 
                      key={i} 
                      className="skill-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + (i * 0.05) }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <span className="chip-name">{skill.name}</span>
                      <span className="chip-level" style={{ color: config.color, backgroundColor: config.bg }}>
                        {config.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div 
            className="glass-card section-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="section-header">
              <h2>🎯 Skills to Learn</h2>
              <span className="section-count">{gaps.length} gaps</span>
            </div>
            {gaps.length === 0 ? (
              <p className="empty-text">No skill gaps! 🎉</p>
            ) : (
              <div className="gap-cards">
                {gaps.map((gap, i) => (
                  <motion.div 
                    key={i} 
                    className="gap-card-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + (i * 0.06) }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="gap-indicator"></div>
                    <div>
                      <h4>{gap.name}</h4>
                      <p>{gap.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Visual Roadmap */}
        <motion.div 
          className="roadmap-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="section-header" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
            <h2 style={{ color: 'white', textTransform: 'uppercase', textAlign: 'center', width: '100%' }}>Learning Path</h2>
          </div>

          {isGenerating ? (
            <div className="roadmap-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">AI is building your personalized path...</p>
            </div>
          ) : roadmap.length === 0 ? (
            <div className="roadmap-empty">
              <div className="roadmap-empty-icon">🚀</div>
              <p>No roadmap yet. Run an analysis first!</p>
            </div>
          ) : (
            <div className="visual-roadmap">
              {/* Start */}
              <motion.div className="milestone-node start"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="milestone-circle">🚀</div>
                <span>START</span>
              </motion.div>

              <div className="roadmap-track">
                {roadmap.map((mod, i) => {
                  const color = nodeColors[i % nodeColors.length];
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div 
                      key={mod.id || i}
                      className={`track-node ${isLeft ? 'left' : 'right'}`}
                      initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                    >
                      <div className="track-connector">
                        <motion.div 
                          className="track-step"
                          style={{ background: color.gradient }}
                          whileHover={{ scale: 1.2 }}
                        >
                          {i + 1}
                        </motion.div>
                      </div>
                      <motion.div 
                        className="track-card"
                        whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
                        style={{ borderLeftColor: color.bg }}
                      >
                        <div className="track-card-top">
                          <span className="track-time">{mod.timeframe}</span>
                        </div>
                        <h4>{mod.title}</h4>
                        <p>{mod.description}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* End */}
              <motion.div className="milestone-node end"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + roadmap.length * 0.1 + 0.2 }}
              >
                <div className="milestone-circle">🏆</div>
                <span>GOAL</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
