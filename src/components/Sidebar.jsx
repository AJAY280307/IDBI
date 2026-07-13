import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, Target, AlertTriangle, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Accounts', icon: Wallet, path: '/accounts' },
    { name: 'Investments', icon: TrendingUp, path: '/investments' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Risk', icon: AlertTriangle, path: '/risk' },
    { name: 'Reports', icon: FileText, path: '/reports' },
  ];

  return (
    <div className="glass-card" style={sidebarStyle}>
      <div style={logoContainerStyle}>
        <div style={logoIconStyle}>
          <TrendingUp color="#fff" size={24} />
        </div>
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: 0 }}>FinTwin AI</h2>
      </div>

      <nav style={navStyle}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <item.icon size={20} style={{ marginRight: '1rem' }} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={bottomNavStyle}>
        <a href="#" style={linkStyle}>
          <Settings size={20} style={{ marginRight: '1rem' }} />
          Settings
        </a>
        <a href="#" style={{ ...linkStyle, color: 'var(--text-muted)' }}>
          <LogOut size={20} style={{ marginRight: '1rem' }} />
          Log Out
        </a>
      </div>
    </div>
  );
};

const sidebarStyle = {
  width: '260px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--border)',
  borderRadius: 0,
  padding: '1.5rem',
  boxShadow: 'var(--shadow-md)',
  position: 'sticky',
  top: 0,
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '3rem',
  gap: '12px'
};

const logoIconStyle = {
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  borderRadius: '12px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-glow)'
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  flex: 1,
};

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  color: 'var(--text-muted)',
  borderRadius: '8px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
};

const activeLinkStyle = {
  backgroundColor: 'rgba(0, 140, 122, 0.1)',
  color: 'var(--primary)',
  fontWeight: 600,
};

const bottomNavStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: 'auto',
  paddingTop: '2rem',
  borderTop: '1px solid var(--border)'
};

export default Sidebar;
