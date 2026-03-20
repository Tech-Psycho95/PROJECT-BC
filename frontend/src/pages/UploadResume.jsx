import React, { useState } from 'react';

const UploadResume = () => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (file) {
      console.log('Uploading resume:', file.name);
      // Calls API to upload and parse resume here
    }
  };

  return (
    <div className="upload-resume-page">
      <h2>Upload Resume</h2>
      <input 
        type="file" 
        accept=".pdf,.doc,.docx" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={handleUpload}>Upload and Analyze</button>
    </div>
  );
};

export default UploadResume;
