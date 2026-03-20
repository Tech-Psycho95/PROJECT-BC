import React, { useState } from 'react';
import '../styles/analysis.css';

const Analysis = () => {
  // Mock data representing backend analysis response
  const [analysisData] = useState({
    extractedSkills: [
      { name: 'JavaScript', level: 'advanced' },
      { name: 'React', level: 'intermediate' },
      { name: 'Node.js', level: 'beginner' },
      { name: 'HTML/CSS', level: 'advanced' },
    ],
    requiredSkills: [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'TypeScript' },
      { name: 'GraphQL' },
    ],
    gapAnalysis: {
      toSkip: [
        { name: 'JavaScript', reason: 'Mastered' },
        { name: 'React', reason: 'Proficient' },
        { name: 'HTML/CSS', reason: 'Not heavily required' }
      ],
      toLearn: [
        { name: 'TypeScript', reason: 'Missing requirement' },
        { name: 'GraphQL', reason: 'Missing requirement' },
        { name: 'Node.js', reason: 'Needs advanced knowledge' }
      ]
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const getLevelClass = (level) => {
    switch (level) {
      case 'beginner': return 'level-beginner';
      case 'intermediate': return 'level-intermediate';
      case 'advanced': return 'level-advanced';
      default: return '';
    }
  };

  const handleGeneratePath = async () => {
    setIsGenerating(true);
    
    try {
      // Execute the POST request to backend
      const response = await fetch('http://localhost:5000/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          missingSkills: analysisData.gapAnalysis.toLearn.map(skill => skill.name)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const backendRoadmap = await response.json();
      console.log('Successfully received roadmap from backend:', backendRoadmap);
      
      // Successfully generated, navigate to the Dashboard viewing UI
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error generating path:', error);
      alert('Failed to connect to backend roadmap generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1>Profile Analysis</h1>
        <p>We've compared your actual skills against the target role.</p>
      </div>

      <div className="analysis-content">
        <div className="cards-row">
          {/* Extracted Skills Card */}
          <div className="analysis-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h3>Extracted Skills</h3>
            </div>
            <div className="skill-list">
              {analysisData.extractedSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`skill-level ${getLevelClass(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills Card */}
          <div className="analysis-card">
            <div className="card-header">
              <span className="card-icon">📋</span>
              <h3>Required Skills</h3>
            </div>
            <div className="skill-list">
              {analysisData.requiredSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <span className="status-badge status-require">Required</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gap Analysis Card */}
        <div className="analysis-card gap-card">
          <div className="card-header">
            <span className="card-icon">🔍</span>
            <h3>Gap Analysis</h3>
          </div>
          
          <div className="gap-grid">
            <div className="gap-section">
              <h4>🎯 Skills to Learn (Priority)</h4>
              <div className="skill-list">
                {analysisData.gapAnalysis.toLearn.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div>
                      <div className="skill-name">{skill.name}</div>
                      <div className="reason-text">{skill.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gap-section">
              <h4>✅ Skills to Skip</h4>
              <div className="skill-list">
                {analysisData.gapAnalysis.toSkip.map((skill, index) => (
                  <div key={index} className="skill-item skip-item">
                    <div>
                      <div className="skill-name">{skill.name}</div>
                      <div className="reason-text">{skill.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        className="btn-generate" 
        onClick={handleGeneratePath}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Learning Path'}
      </button>
    </div>
  );
};

export default Analysis;
