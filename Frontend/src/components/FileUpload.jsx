import React, { useState } from 'react';
import { uploadPDF } from '../api/api';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadPDF(file, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      if (response.data.success) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isUploading) {
    return (
      <div className="upload-container">
        <div className="upload-progress">
          <div className="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 15M12 2L8 6M12 2L16 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V15" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Uploading PDF</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 15M12 2L8 6M12 2L16 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V15" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>Upload PDF to start chatting</h3>
        <p>Click or drag and drop the file here</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-button">
          Choose File
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
