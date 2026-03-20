import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-header">
          <h1>AI Onboarding</h1>
          <p>Your personalized, intelligent path to bridging the gap between where you are and where you want to be.</p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <h2>🎯 What the Product Does</h2>
            <p>
              This platform serves as an adaptive learning companion. By thoroughly analyzing your current skills and comparing them directly against your target role's job description, we automatically generate a highly personalized, step-by-step roadmap to accelerate your career transition.
            </p>
          </section>

          <section className="about-section">
            <h2>💡 The Problem It Solves</h2>
            <p>
              Job descriptions are often overwhelming and generic, making it difficult to understand exactly what you need to study. Traditional roadmaps treat every learner the same. We solve this by filtering out the noise: skipping what you already know and highlighting exactly what you need to master.
            </p>
          </section>

          <section className="about-section">
            <h2>🧠 How AI is Used</h2>
            <p>
              We leverage advanced Large Language Models (LLMs) to perform deep semantic parsing on unstructured text from resumes and job descriptions. The AI strictly categorizes proficiencies, calculates dynamic gap mappings, and generates curriculum topics, guaranteeing that your structured learning path is both highly relevant and continually adapted to industry standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
