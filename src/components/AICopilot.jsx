import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        className="btn-primary" 
        style={floatingButtonStyle}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={24} style={{ marginRight: '0.5rem' }} />
        AI Advisor
      </button>
    );
  }

  return (
    <div className="glass-card" style={panelStyle}>
      <div style={panelHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>FinTwin AI Advisor</h3>
        </div>
        <button style={closeBtnStyle} onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div style={chatAreaStyle}>
        <div style={aiMessageStyle}>
          Hello Alex! I noticed your expenses are 15% lower this month. You have $1,200 surplus. Should we allocate this to your Retirement Goal?
        </div>
        
        <div style={suggestionsStyle}>
          <button className="btn-outline" style={pillStyle}>Yes, invest it</button>
          <button className="btn-outline" style={pillStyle}>Can I buy a car?</button>
          <button className="btn-outline" style={pillStyle}>How much should I invest?</button>
        </div>
      </div>

      <div style={inputAreaStyle}>
        <input 
          type="text" 
          placeholder="Ask me anything..." 
          style={inputStyle}
        />
        <button className="btn-primary" style={sendBtnStyle}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const floatingButtonStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  borderRadius: '30px',
  padding: '1rem 2rem',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1rem',
  boxShadow: 'var(--shadow-glow)',
  zIndex: 100,
};

const panelStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  width: '380px',
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  zIndex: 100,
  overflow: 'hidden',
  boxShadow: 'var(--shadow-glow)',
  border: '1px solid var(--primary-light)',
};

const panelHeaderStyle = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

const closeBtnStyle = {
  background: 'transparent',
  color: 'var(--text-muted)',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const chatAreaStyle = {
  flex: 1,
  padding: '1.5rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: 'rgba(248, 250, 252, 0.6)',
};

const aiMessageStyle = {
  backgroundColor: 'var(--bg)',
  padding: '1rem',
  borderRadius: '12px',
  borderBottomLeftRadius: '2px',
  boxShadow: 'var(--shadow-sm)',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  border: '1px solid var(--border)',
};

const suggestionsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const pillStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.85rem',
  backgroundColor: 'var(--bg)',
};

const inputAreaStyle = {
  padding: '1rem',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  gap: '0.5rem',
  backgroundColor: 'var(--bg)',
};

const inputStyle = {
  flex: 1,
  padding: '0.75rem 1rem',
  borderRadius: '20px',
  border: '1px solid var(--border)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
};

const sendBtnStyle = {
  padding: '0.75rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '42px',
  height: '42px',
};

export default AICopilot;
