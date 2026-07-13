import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Shield, Target, Sparkles, 
  Search, Filter, ChevronRight, Activity, AlertCircle 
} from 'lucide-react';

// --- MOCK DATA ---
const summaryMetrics = {
  totalValue: 8540500,
  todaysReturn: 24500,
  todaysReturnPercent: 0.29,
  overallReturn: 1250000,
  overallReturnPercent: 17.15,
  xirr: 14.8,
  riskScore: 68,
  diversificationScore: 82
};

const assetAllocation = [
  { name: 'Mutual Funds', value: 3500000, color: '#008C7A' },
  { name: 'Direct Equity', value: 2100000, color: '#0EA5A4' },
  { name: 'Fixed Deposits', value: 1200000, color: '#3b82f6' },
  { name: 'Gold', value: 840500, color: '#f59e0b' },
  { name: 'Real Estate', value: 500000, color: '#64748b' },
  { name: 'Crypto', value: 400000, color: '#8b5cf6' },
];

const performanceData = [
  { month: 'Jan', portfolio: 6200000, nifty: 5800000 },
  { month: 'Feb', portfolio: 6350000, nifty: 5850000 },
  { month: 'Mar', portfolio: 6300000, nifty: 5700000 },
  { month: 'Apr', portfolio: 6800000, nifty: 6100000 },
  { month: 'May', portfolio: 7200000, nifty: 6400000 },
  { month: 'Jun', portfolio: 7800000, nifty: 6800000 },
  { month: 'Jul', portfolio: 8540500, nifty: 7100000 },
];

const holdings = [
  { id: 1, name: 'Parag Parikh Flexi Cap', type: 'Mutual Fund', sector: 'Diversified', invested: 1200000, current: 1650000, return: 37.5 },
  { id: 2, name: 'HDFC Bank Ltd.', type: 'Stock', sector: 'Financials', invested: 500000, current: 580000, return: 16.0 },
  { id: 3, name: 'Reliance Industries', type: 'Stock', sector: 'Energy', invested: 400000, current: 520000, return: 30.0 },
  { id: 4, name: 'SBI Small Cap Fund', type: 'Mutual Fund', sector: 'Small Cap', invested: 300000, current: 420000, return: 40.0 },
  { id: 5, name: 'SGB Aug 2028', type: 'Gold', sector: 'Commodities', invested: 500000, current: 650000, return: 30.0 },
  { id: 6, name: 'TCS Ltd.', type: 'Stock', sector: 'IT', invested: 350000, current: 390000, return: 11.4 },
];

const goals = [
  { id: 1, name: 'Retirement Corpus', target: 50000000, current: 8540500, year: 2045 },
  { id: 2, name: 'Child Education', target: 5000000, current: 1200000, year: 2035 },
  { id: 3, name: 'Dream Home Downpayment', target: 3000000, current: 2500000, year: 2028 },
];

// --- HELPER COMPONENTS & UTILS ---
const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const MetricCard = ({ title, value, subtext, isPositive, highlight }) => (
  <div className="glass-card" style={{ padding: '1.25rem', borderLeft: highlight ? '4px solid var(--primary)' : 'none' }}>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>{title}</p>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{value}</h3>
    {subtext && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: isPositive ? 'var(--primary)' : (isPositive === false ? 'var(--accent)' : 'var(--text-muted)'), fontWeight: 500 }}>
        {isPositive ? <TrendingUp size={14} /> : (isPositive === false ? <TrendingDown size={14} /> : null)}
        {subtext}
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---
const Investments = () => {
  const [timeFilter, setTimeFilter] = useState('1Y');
  const [sipAmount, setSipAmount] = useState(50000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  // Future Value Formula: FV = P × ({[1 + r]^n - 1} / r) × (1 + r)
  const calculateSIP = () => {
    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;
    const fv = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = sipAmount * months;
    return { fv, totalInvested, wealthGained: fv - totalInvested };
  };
  const sipResult = calculateSIP();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Wealth Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Premium insights and analytics for your investment portfolio.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Sparkles size={18} /> Ask FinTwin AI
        </button>
      </div>

      {/* Module 1: Portfolio Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <MetricCard title="Total Portfolio Value" value={formatINR(summaryMetrics.totalValue)} highlight={true} />
        <MetricCard title="Today's P&L" value={formatINR(summaryMetrics.todaysReturn)} subtext={`+${summaryMetrics.todaysReturnPercent}%`} isPositive={true} />
        <MetricCard title="Overall Returns" value={formatINR(summaryMetrics.overallReturn)} subtext={`+${summaryMetrics.overallReturnPercent}%`} isPositive={true} />
        <MetricCard title="XIRR (Annualized)" value={`${summaryMetrics.xirr}%`} subtext="Outperforming Benchmark" isPositive={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Module 2: Asset Allocation */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Asset Allocation</h3>
          </div>
          <div style={{ display: 'flex', height: '280px', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assetAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                    {assetAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip formatter={(val) => formatINR(val)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assetAllocation.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{((item.value / summaryMetrics.totalValue) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 3: Portfolio Performance vs NIFTY */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Performance vs NIFTY 50</h3>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card-bg)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {['1M', '6M', '1Y', '3Y', '5Y'].map(tf => (
                <button 
                  key={tf} 
                  onClick={() => setTimeFilter(tf)}
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    fontSize: '0.8rem', 
                    borderRadius: '6px', 
                    background: timeFilter === tf ? 'var(--bg)' : 'transparent',
                    border: 'none',
                    boxShadow: timeFilter === tf ? 'var(--shadow-sm)' : 'none',
                    fontWeight: timeFilter === tf ? 600 : 400,
                    cursor: 'pointer'
                  }}
                >{tf}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                <RechartsTooltip formatter={(val) => formatINR(val)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="portfolio" name="Your Portfolio" stroke="var(--primary)" strokeWidth={3} fill="url(#colorPort)" />
                <Area type="monotone" dataKey="nifty" name="NIFTY 50" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Module 4: Holdings Explorer */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Holdings Explorer</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search holdings..." style={{ padding: '0.4rem 1rem 0.4rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', fontSize: '0.85rem' }} />
              </div>
              <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={14}/> Filter</button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Asset Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Sector</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Invested</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Current Value</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Returns</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={h.id} style={{ borderBottom: i === holdings.length - 1 ? 'none' : '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{h.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.type}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>{h.sector}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>{formatINR(h.invested)}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>{formatINR(h.current)}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>
                    +{h.return}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modules 5 & 6: Risk Engine & Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Risk Engine */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={18} color="var(--primary)"/> Risk Analysis</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '8px', background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: `${summaryMetrics.riskScore}%`, top: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '3px solid #f59e0b', transform: 'translateX(-50%)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>Moderate</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Diversification Score</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{summaryMetrics.diversificationScore}/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Volatility (Beta)</span>
                <span style={{ fontWeight: 600 }}>0.85</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Max Drawdown (1Y)</span>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>-8.4%</span>
              </div>
            </div>
          </div>

          {/* Goal Mapping */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Target size={18} color="var(--primary)"/> Goal Mapping</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {goals.map(g => (
                <div key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 500 }}>{g.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{g.year}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                    <div style={{ height: '100%', width: `${(g.current / g.target) * 100}%`, background: 'var(--primary)', borderRadius: '3px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{formatINR(g.current)} saved</span>
                    <span>Target: {formatINR(g.target)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Module 7: Future Wealth Simulator */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(0,140,122,0.05) 0%, rgba(14,165,164,0.05) 100%)', border: '1px solid rgba(0,140,122,0.1)' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--primary)" /> Future Wealth Simulator
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Play with the numbers to see how compounding can accelerate your journey to financial freedom.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Monthly SIP Amount (₹)</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatINR(sipAmount)}</span>
                </div>
                <input 
                  type="range" min="5000" max="200000" step="5000" 
                  value={sipAmount} onChange={(e) => setSipAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }} 
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Expected Return Rate (%)</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{returnRate}%</span>
                </div>
                <input 
                  type="range" min="5" max="25" step="1" 
                  value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Investment Horizon (Years)</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="40" step="1" 
                  value={years} onChange={(e) => setYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, background: 'var(--bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Projected Future Value</p>
              <h2 style={{ fontSize: '3rem', color: 'var(--text)', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {formatINR(sipResult.fv)}
              </h2>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--card-bg)', borderRadius: '12px', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Invested</p>
                <p style={{ fontWeight: 600 }}>{formatINR(sipResult.totalInvested)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Returns Gained</p>
                <p style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(sipResult.wealthGained)}</p>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--accent)' }}>FinTwin Insight:</strong> Increasing your SIP by just ₹5,000/month could increase your final corpus by {formatINR(5000 * ((Math.pow(1 + (returnRate/12/100), years*12) - 1) / (returnRate/12/100)) * (1 + returnRate/12/100))}.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Investments;
