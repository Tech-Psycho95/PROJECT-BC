import React, { useState } from 'react';
import '../styles/onboarding.css';

const Onboarding = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleJdFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setJdFile(e.target.files[0]);
      setJdText(''); // Clear text when file is provided
    }
  };

  const handleJdTextChange = (e) => {
    setJdText(e.target.value);
    if (e.target.value.trim() !== '') {
      setJdFile(null); // Clear file when text is provided
    }
  };

  // The Analyze button is only enabled if both parts of the form are filled out
  const isFormValid = resumeFile && (jdFile || jdText.trim() !== '');

  const handleAnalyzeSkills = async () => {
    if (!isFormValid) return;
    
    setIsAnalyzing(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      if (jdFile) {
        formData.append('jobDescription', jdFile);
      } else {
        formData.append('jobDescription', jdText);
      }

      const response = await fetch('http://localhost:5005/analyze-profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      console.log('Analysis Complete!', result);
      
      // Save to localStorage so the Analysis page can pick it up
      localStorage.setItem('analysisResult', JSON.stringify(result));
      window.location.href = '/analysis';
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to connect to backend for analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Let's Get Started</h1>
        <p>Upload your resume and the job description you are targeting, and our AI will build your personalized path.</p>
      </div>

      <div className="upload-grid">
        {/* Resume Card */}
        <div className={`upload-card ${resumeFile ? 'active' : ''}`}>
          <h3>Your Resume</h3>
          <p>Please upload your latest resume (PDF, DOCX)</p>
          
          <div className="file-input-wrapper">
            <button className="btn-outline">
              {resumeFile ? 'Change File' : 'Browse Files'}
            </button>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleResumeChange}
              title="Upload your resume"
            />
          </div>
          
          {resumeFile && (
            <div className="file-preview">
              <span className="file-preview-icon">📄</span>
              {resumeFile.name}
            </div>
          )}
        </div>

        {/* Job Description Card */}
        <div className={`upload-card ${(jdFile || jdText) ? 'active' : ''}`}>
          <h3>Target Job Description</h3>
          <p>Provide the job description you want to match against.</p>
          
          <div className="file-input-wrapper">
            <button className="btn-outline">
              {jdFile ? 'Change File' : 'Upload JD File'}
            </button>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleJdFileChange}
              title="Upload job description"
            />
          </div>
          
          {jdFile && (
            <div className="file-preview">
              <span className="file-preview-icon">📄</span>
              {jdFile.name}
            </div>
          )}

          {!jdFile && (
            <>
              <div className="text-divider">OR</div>
              <textarea 
                className="job-description-input" 
                placeholder="Paste the job description text here..."
                value={jdText}
                onChange={handleJdTextChange}
              />
            </>
          )}
        </div>
      </div>

      <div className="action-section">
        {errorMessage && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem', color: '#ef4444', fontWeight: '500' }}>
            {errorMessage}
          </div>
        )}
        <button 
          className="btn-primary"
          onClick={handleAnalyzeSkills}
          disabled={!isFormValid || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing Skills...
            </>
          ) : 'Analyze Skills'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
