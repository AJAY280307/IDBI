import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass" style={headerStyle}>
      <div style={searchContainerStyle}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem' }} />
        <input 
          type="text" 
          placeholder="Ask AI Copilot to find anything..." 
          style={searchInputStyle}
        />
      </div>

      <div style={actionsContainerStyle}>
        <button style={iconButtonStyle}>
          <Bell size={20} color="var(--text)" />
          <span style={badgeStyle}>3</span>
        </button>
        <div style={profileStyle}>
          <div style={avatarStyle}>
            <User size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Alex Morgan</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Premium User</div>
          </div>
        </div>
      </div>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  borderBottom: '1px solid var(--border)',
  borderRadius: 0,
  boxShadow: 'var(--shadow-sm)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '400px',
};

const searchInputStyle = {
  width: '100%',
  padding: '0.75rem 1rem 0.75rem 3rem',
  borderRadius: '20px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--card-bg)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const actionsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const iconButtonStyle = {
  position: 'relative',
  background: 'transparent',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',
};

const badgeStyle = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  fontSize: '0.6rem',
  fontWeight: 'bold',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const profileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default Header;
