import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import PDFViewer from './components/PDFViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [documentData, setDocumentData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleUploadSuccess = (data) => {
    setDocumentData(data);
  };

  const handleCitationClick = (page) => {
    setCurrentPage(page);
  };

  const handleNewUpload = () => {
    setDocumentData(null);
    setCurrentPage(1);
  };

  if (!documentData) {
    return <FileUpload onUploadSuccess={handleUploadSuccess} />;
  }

  return (
    <div className="app">
         <div className="app-header">
        <div className="document-info">
          <h2>   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px', verticalAlign: 'middle'}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>{documentData.document.filename}</h2>
          <span className="page-count">{documentData.document.pageCount} pages</span>
        </div>
        <button className="close-btn" onClick={handleNewUpload} title="Close document">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="app-content">
        <div className="pdf-section">
          <PDFViewer 
            documentId={documentData.document.id} 
            currentPage={currentPage}
          />
        </div>
        
        <div className="chat-section">
          <ChatInterface 
            chatId={documentData.chatId}
            onCitationClick={handleCitationClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

