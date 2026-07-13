import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, BrainCircuit, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={logoIconStyle}>
            <TrendingUp color="#fff" size={24} />
          </div>
          <h2 className="gradient-text" style={{ margin: 0 }}>FinTwin AI</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline">Log In</button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Connect Accounts</button>
        </div>
      </nav>

      <main style={mainStyle}>
        <div style={heroContentStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 600, backgroundColor: 'rgba(0, 140, 122, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', width: 'fit-content' }}>
            <BrainCircuit size={20} />
            <span>Next-Gen Enterprise Fintech</span>
          </div>
          
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Your AI-Powered <br/>
            <span className="gradient-text">Financial Digital Twin</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Predict, Protect, and Prosper with Intelligent Financial Decisions.
            Connect your accounts and let our AI advisor optimize your wealth 24/7.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/dashboard')}>
              Try AI Advisor <ArrowRight size={20} />
            </button>
            <button className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Demo
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            <div style={featureStyle}>
              <Shield size={24} color="var(--primary)" />
              <span>Bank-Grade Security</span>
            </div>
            <div style={featureStyle}>
              <TrendingUp size={24} color="var(--primary)" />
              <span>Automated Growth</span>
            </div>
          </div>
        </div>

        <div style={illustrationStyle}>
          {/* Synthetic UI representation of the AI network */}
          <div className="glass" style={{ ...floatingCardStyle, top: '10%', left: '0%' }}>
            <div style={{ fontWeight: 600 }}>Chase Sapphire</div>
            <div style={{ color: 'var(--accent)' }}>-$450.00</div>
          </div>
          
          <div className="glass" style={{ ...floatingCardStyle, top: '40%', right: '0%' }}>
            <div style={{ fontWeight: 600 }}>Vanguard ETF</div>
            <div style={{ color: 'var(--primary)' }}>+$12,450.00</div>
          </div>
          
          <div className="glass" style={{ ...floatingCardStyle, bottom: '20%', left: '10%' }}>
            <div style={{ fontWeight: 600 }}>Mortgage</div>
            <div style={{ color: 'var(--text-muted)' }}>3.2% APY</div>
          </div>

          <div style={centralBrainStyle}>
            <BrainCircuit size={60} color="#fff" />
            <div style={glowingPulseStyle}></div>
          </div>
        </div>
      </main>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--bg)',
  backgroundImage: 'radial-gradient(circle at right center, rgba(0, 140, 122, 0.05) 0%, transparent 50%)',
  display: 'flex',
  flexDirection: 'column',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem 4rem',
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

const mainStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '0 4rem',
  gap: '4rem',
};

const heroContentStyle = {
  flex: 1,
  paddingRight: '2rem',
};

const featureStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--text-muted)',
  fontWeight: 500,
};

const illustrationStyle = {
  flex: 1,
  position: 'relative',
  height: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const floatingCardStyle = {
  position: 'absolute',
  padding: '1.5rem',
  minWidth: '200px',
  animation: 'float 6s ease-in-out infinite',
};

const centralBrainStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxShadow: 'var(--shadow-glow)',
  zIndex: 2,
};

const glowingPulseStyle = {
  position: 'absolute',
  top: '-20%',
  left: '-20%',
  right: '-20%',
  bottom: '-20%',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0,140,122,0.4) 0%, transparent 70%)',
  animation: 'pulse 3s infinite',
  zIndex: -1,
};

// We will inject keyframes directly via a style tag for this page
const styles = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(0.95); opacity: 0.5; }
}
`;

const LandingWithStyles = () => (
  <>
    <style>{styles}</style>
    <Landing />
  </>
);

export default LandingWithStyles;
