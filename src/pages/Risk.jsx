import React from 'react';
import { AlertOctagon, TrendingDown, CreditCard, ShieldAlert } from 'lucide-react';

const Risk = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Risk Analysis</h1>
        <p style={{ color: 'var(--text-muted)' }}>AI-driven insights to protect your financial future.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <AlertOctagon color="var(--accent)" size={28} />
            <h3 style={{ margin: 0 }}>Overspending Risk</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Dining out expenses are 30% higher than your 6-month average. Continuing this trend will delay your Europe Trip goal by 2 months.
          </p>
          <button className="btn-outline" style={{ width: '100%' }}>View Details</button>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #facc15' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <ShieldAlert color="#facc15" size={28} />
            <h3 style={{ margin: 0 }}>Emergency Fund</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your emergency fund currently covers 2.5 months of expenses. AI recommends increasing this to 6 months based on current market volatility.
          </p>
          <button className="btn-outline" style={{ width: '100%' }}>Adjust Plan</button>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <TrendingDown color="var(--primary)" size={28} />
            <h3 style={{ margin: 0 }}>Market Exposure</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your tech stock allocation is slightly overweight at 45%. Consider rebalancing to maintain your moderate risk profile.
          </p>
          <button className="btn-outline" style={{ width: '100%' }}>Rebalance</button>
        </div>
        
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <CreditCard color="var(--primary-light)" size={28} />
            <h3 style={{ margin: 0 }}>Debt Optimization</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            You could save $1,200 in interest over 3 years by refinancing your auto loan at current rates.
          </p>
          <button className="btn-outline" style={{ width: '100%' }}>Explore Rates</button>
        </div>
      </div>
    </div>
  );
};

export default Risk;
