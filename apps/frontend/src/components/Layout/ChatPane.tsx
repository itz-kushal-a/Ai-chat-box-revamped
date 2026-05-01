import React from 'react';
import './ChatPane.css';

const ChatPane: React.FC = () => {
  return (
    <section className="chat-pane">
      <div className="chat-header">
        AI ASSISTANT
      </div>
      <div className="chat-messages">
        <div className="welcome-msg">How can I help you today?</div>
      </div>
      <div className="chat-input-wrapper">
        <input type="text" placeholder="Ask anything..." className="chat-input" />
      </div>
    </section>
  );
};

export default ChatPane;
