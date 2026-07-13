import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const portfolioData = [
  { name: 'US Stocks', value: 45000, color: '#008C7A' },
  { name: 'Intl Stocks', value: 25000, color: '#0EA5A4' },
  { name: 'Bonds', value: 15000, color: '#111827' },
  { name: 'Crypto', value: 5000, color: '#F97316' },
];

const Investments = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Investments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your investment portfolios.</p>
      </div>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>Asset Allocation</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your portfolio is well diversified according to your risk profile.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {portfolioData.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </div>
                <div style={{ fontWeight: 600 }}>
                  ${item.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Investments;
