import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../api/api';
import './ChatInterface.css';

const ChatInterface = ({ chatId, onCitationClick }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      loadChatHistory();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await getChatHistory(chatId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await sendMessage(chatId, userMessage);
      if (response.data.success) {
        // Replace the last two messages with the response from server
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages.splice(-1, 1, ...response.data.messages);
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation) => {
    if (onCitationClick) {
      onCitationClick(citation.page);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Ask about the document</h3>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>👋 Hi! I'm here to help you understand your document. Ask me anything about its contents!</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              <p>{message.content}</p>
              {message.citations && message.citations.length > 0 && (
                <div className="citations">
                  {message.citations.map((citation, citIndex) => (
                    <button
                      key={citIndex}
                      className="citation-button"
                      onClick={() => handleCitationClick(citation)}
                    >
                      📄 Page {citation.page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about the document..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !inputMessage.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;