import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinancialCard = ({ title, amount, change, isPositive, icon: Icon }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
        <div style={{ 
          padding: '0.5rem', 
          backgroundColor: 'rgba(0, 140, 122, 0.1)', 
          borderRadius: '8px',
          color: 'var(--primary)'
        }}>
          <Icon size={20} />
        </div>
      </div>
      
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{amount}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: isPositive ? 'var(--primary)' : 'var(--accent)',
            fontWeight: 600,
            backgroundColor: isPositive ? 'rgba(0, 140, 122, 0.1)' : 'rgba(249, 115, 22, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialCard;
