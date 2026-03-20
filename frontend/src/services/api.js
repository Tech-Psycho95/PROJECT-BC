// Handles backend API calls

const BASE_URL = 'http://localhost:5005/api';

export const uploadResume = async (file) => {
  // Placeholder for resume upload API
  console.log(`POST ${BASE_URL}/upload-resume with`, file.name);
};

export const analyzeSkills = async (data) => {
  // Placeholder for skill analysis API
  console.log(`POST ${BASE_URL}/analyze-skills with`, data);
};

export const generateRoadmap = async (userId) => {
  // Placeholder for roadmap generation
  console.log(`POST ${BASE_URL}/generate-roadmap for user`, userId);
};

export const loginUser = async (credentials) => {
  // Placeholder for user login
  console.log(`POST ${BASE_URL}/auth/login with`, credentials);
};
