import React, { useState, useEffect } from 'react';
import { getPDFUrl } from '../api/api';
import './PDFViewer.css';

const PDFViewer = ({ documentId, currentPage }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (documentId) {
      setPdfUrl(getPDFUrl(documentId));
    }
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="pdf-viewer-placeholder">
        <p>Upload a PDF to view it here</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h3>Document Preview</h3>
      </div>
      <div className="pdf-content">
        <iframe
          src={`${pdfUrl}#page=${currentPage || 1}`}
          width="100%"
          height="100%"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PDFViewer;