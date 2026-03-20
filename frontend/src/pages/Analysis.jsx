import React, { useState, useEffect } from 'react';
import '../styles/analysis.css';

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState({
    extractedSkills: [],
    requiredSkills: [],
    presentSkills: [],
    gapAnalysis: { toSkip: [], toLearn: [] }
  });

  useEffect(() => {
    const savedResult = localStorage.getItem('analysisResult');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        // Ensure the data structure has what the UI needs, using fallbacks if necessary
        setAnalysisData({
          extractedSkills: parsed.extractedSkills || [],
          requiredSkills: parsed.requiredSkills || [],
          presentSkills: parsed.presentSkills || [],
          gapAnalysis: parsed.gapAnalysis || { toSkip: [], toLearn: [] }
        });
      } catch (err) {
        console.error("Error parsing analysis result from localStorage:", err);
      }
    }
  }, []);

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
      const missingSkills = analysisData.gapAnalysis.toLearn.map(skill => skill.name);
      
      const response = await fetch('http://localhost:5005/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ missingSkills })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const backendRoadmap = await response.json();
      console.log('Successfully received roadmap from backend:', backendRoadmap);
      
      // Save roadmap and analysis data to localStorage for Dashboard
      localStorage.setItem('roadmapData', JSON.stringify(backendRoadmap.roadmap || []));
      // analysisResult is already in localStorage from the onboarding step
      
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error generating path:', error);
      alert('Failed to generate learning path. Please try again.');
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

          {/* Already Having Skills Card */}
          <div className="analysis-card">
            <div className="card-header">
              <span className="card-icon">✅</span>
              <h3>Already Having Skills</h3>
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

          {/* Lacking Skills Card */}
          <div className="analysis-card">
            <div className="card-header">
              <span className="card-icon">🎯</span>
              <h3>Lacking Skills</h3>
            </div>
            <div className="skill-list">
              {analysisData.gapAnalysis.toLearn.map((skill, index) => (
                <div key={index} className="skill-item" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                  <span className="skill-name">{skill.name}</span>
                  <span className="reason-text" style={{ marginTop: '0.25rem' }}>{skill.reason}</span>
                </div>
              ))}
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
