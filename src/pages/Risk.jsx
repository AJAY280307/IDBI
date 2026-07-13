import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertOctagon, TrendingDown, CreditCard, ShieldAlert, 
  Clock, LineChart as LineChartIcon, PieChart, Activity,
  Briefcase, ArrowDownRight, ArrowUpRight, X, ChevronRight, Zap, Target
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { getRiskAnalysis, executeRiskActionPlan } from '../services/api';

const RISK_ICONS = {
  "Overspending Risk": <AlertOctagon size={24} />,
  "Emergency Fund Risk": <ShieldAlert size={24} />,
  "Market Exposure Risk": <PieChart size={24} />,
  "Debt Risk": <TrendingDown size={24} />,
  "Goal Delay Risk": <Clock size={24} />,
  "Cash Flow Risk": <Activity size={24} />,
  "Credit Utilization Risk": <CreditCard size={24} />,
  "Investment Volatility Risk": <LineChartIcon size={24} />,
  "Inflation Risk": <ArrowDownRight size={24} />,
  "Retirement Risk": <Briefcase size={24} />
};

const LEVEL_COLORS = {
  "Low": "#22c55e",
  "Medium": "#facc15",
  "High": "#ef4444"
};

const RiskCard = ({ analysis, onClick }) => {
  const icon = RISK_ICONS[analysis.risk.name] || <AlertOctagon size={24} />;
  const color = LEVEL_COLORS[analysis.risk_level] || LEVEL_COLORS["Medium"];

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card" 
      onClick={onClick}
      style={{ 
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '180px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color }}>{icon}</div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{analysis.risk.name}</h3>
          </div>
          <div style={{ 
            backgroundColor: `${color}20`, 
            color: color, 
            padding: '4px 10px', 
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            Score: {Math.round(analysis.risk_score)}/100
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {analysis.current_financial_impact || analysis.risk.description}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <span style={{ color, fontSize: '0.9rem', fontWeight: 500 }}>{analysis.risk_level} Risk</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: '0.9rem' }}>
          Analyze <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

const RiskModal = ({ analysis, onClose }) => {
  if (!analysis) return null;
  const color = LEVEL_COLORS[analysis.risk_level];

  // Dummy chart data for illustration (would come from /history ideally)
  const chartData = [
    { month: 'Jan', score: analysis.risk_score - 15 },
    { month: 'Feb', score: analysis.risk_score - 10 },
    { month: 'Mar', score: analysis.risk_score - 12 },
    { month: 'Apr', score: analysis.risk_score - 5 },
    { month: 'May', score: analysis.risk_score + 2 },
    { month: 'Jun', score: analysis.risk_score },
  ];

  const handleAction = async (plan) => {
    try {
      await executeRiskActionPlan({ action_id: plan.id, action_name: plan.action_name });
      alert(`Action '${plan.action_name}' initiated!`);
    } catch (e) {
      console.error(e);
      alert("Failed to initiate action.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="glass-card"
        style={{
          width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
          position: 'relative', padding: '2rem'
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ color, p: '10px', background: `${color}20`, borderRadius: '12px' }}>
            {RISK_ICONS[analysis.risk.name] || <AlertOctagon size={32} />}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{analysis.risk.name} Analysis</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              <span style={{ color }}>Level: {analysis.risk_level}</span>
              <span>Score: {Math.round(analysis.risk_score)}/100</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}><Target size={18} color="var(--accent)" /> Impact & Prediction</h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}><strong>Current Impact:</strong> {analysis.current_financial_impact}</p>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}><strong>Future Impact:</strong> {analysis.future_financial_impact}</p>
              {analysis.goal_delay_prediction && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginTop: '1rem' }}>
                  <strong>Goal Alert:</strong> {analysis.goal_delay_prediction}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>Root Causes</h3>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>
                {analysis.causes.map((c, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{c.cause_description} <span style={{fontSize:'0.8rem', color:'var(--accent)', marginLeft:'5px'}}>[{c.category}]</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>AI Recommended Solutions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analysis.solutions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', background: 'rgba(34, 197, 94, 0.05)', borderLeft: '3px solid #22c55e', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div><Zap size={18} color="#22c55e" /></div>
                    <div style={{ fontSize: '0.95rem' }}>{s.solution_text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', height: '250px' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Risk Trend (6 Months)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>Prevention Strategies</h3>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>
                {analysis.prevention_tips.map((t, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{t.tip_text}</li>
                ))}
              </ul>
            </div>

            {analysis.action_plans && analysis.action_plans.length > 0 && (
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>One-Click Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analysis.action_plans.map((plan, i) => (
                    <button key={i} className="btn-primary" onClick={() => handleAction(plan)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={16} /> {plan.action_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};

const Risk = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState(null);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const data = await getRiskAnalysis();
        setAnalyses(data);
      } catch (e) {
        console.error("Failed to load risks:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)' }}>AI Agent is evaluating your financial risks...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem', background: 'linear-gradient(90deg, #fff, var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Risk Intelligence Center
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Proactive AI-driven insights to protect your wealth and achieve goals on time.</p>
      </div>

      {analyses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <ShieldAlert size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Risk Data Available</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your financial data is currently being evaluated.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {analyses.map(analysis => (
            <RiskCard key={analysis.id} analysis={analysis} onClick={() => setSelectedRisk(analysis)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedRisk && (
          <RiskModal analysis={selectedRisk} onClose={() => setSelectedRisk(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Risk;
