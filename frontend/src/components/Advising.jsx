import React from 'react';
import Chatbot from './Chatbot';
import FreeTierVoiceChat from './FreeTierVoiceChat';
import './Advising.css';

const Advising = () => {
  return (
    <div className="advising-container">
      <div className="advising-header">
        <h1>AI Expert Advisor - Interactive Chat</h1>
        <p>Your personal expert consultant across all domains - from tech & business to health & creativity</p>
      </div>
      <div className="advising-content">
        <div className="split-pane">
          <Chatbot />
        </div>
        <div className="split-pane">
          <FreeTierVoiceChat />
        </div>
      </div>
    </div>
  );
};

export default Advising;