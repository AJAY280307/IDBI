import React, { useState, useEffect } from 'react';
import { Target, Home, Plane, GraduationCap, ChevronRight, Activity, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGoals, getGoalDetails, getGoalForecast } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ICONS = {
  Target: Target,
  Home: Home,
  Plane: Plane,
  GraduationCap: GraduationCap,
};

const COLORS = ['#008C7A', '#0EA5A4', '#F97316', '#3B82F6', '#8B5CF6'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [goalDetails, setGoalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // What-If Simulator state
  const [simulatorMonthly, setSimulatorMonthly] = useState('');
  const [simulatedForecast, setSimulatedForecast] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalDetails(selectedGoalId);
    }
  }, [selectedGoalId]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
      if (data.length > 0 && !selectedGoalId) {
        setSelectedGoalId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalDetails = async (id) => {
    try {
      const data = await getGoalDetails(id);
      setGoalDetails(data);
      setSimulatorMonthly(data.average_monthly_savings.toString());
      setSimulatedForecast(data.forecast);
    } catch (error) {
      console.error("Failed to fetch goal details:", error);
    }
  };

  const handleSimulate = async () => {
    if (!selectedGoalId || !simulatorMonthly) return;
    try {
      setIsSimulating(true);
      const val = parseFloat(simulatorMonthly);
      if (isNaN(val) || val <= 0) return;
      
      const forecast = await getGoalForecast(selectedGoalId, val);
      setSimulatedForecast(forecast);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading && goals.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>Loading Goals...</div>;
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Financial Goals</h1>
        <p style={{ color: 'var(--text-muted)' }}>Intelligent planning powered by FinTwin AI.</p>
      </div>

      {/* Goals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {goals.map((goal, idx) => {
          const progress = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
          const IconComponent = ICONS[goal.goal_icon] || Target;
          const color = COLORS[idx % COLORS.length];
          const isSelected = selectedGoalId === goal.id;

          return (
            <motion.div 
              key={goal.id} 
              className="glass-card" 
              whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}
              onClick={() => setSelectedGoalId(goal.id)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem', 
                cursor: 'pointer',
                border: isSelected ? `2px solid ${color}` : '2px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isSelected && (
                <motion.div 
                  layoutId="selected-indicator"
                  style={{ position: 'absolute', inset: 0, backgroundColor: `${color}08`, zIndex: 0 }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: `${color}15`, color: color, borderRadius: '14px' }}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{goal.goal_name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Target: {new Date(goal.target_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: color }}>
                  {Math.round(progress)}%
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(goal.current_amount)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>of {formatCurrency(goal.target_amount)}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', backgroundColor: color, borderRadius: '4px' }} 
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Goal Details Area */}
      <AnimatePresence mode="wait">
        {goalDetails && (
          <motion.div 
            key={goalDetails.goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}
          >
            {/* Left Column: Chart & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={20} color="var(--primary)" /> Monthly Savings History
                </h3>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={goalDetails.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(month, idx) => {
                          const date = new Date(); date.setMonth(month - 1); 
                          return date.toLocaleString('default', { month: 'short' });
                        }} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        tickFormatter={(val) => `₹${val/1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--border)', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [formatCurrency(value), 'Saved']}
                        labelFormatter={(label, entries) => {
                           if(entries.length > 0) {
                              const item = entries[0].payload;
                              const date = new Date(); date.setMonth(item.month - 1);
                              return `${date.toLocaleString('default', { month: 'long' })} ${item.year}`;
                           }
                           return label;
                        }}
                      />
                      <ReferenceLine y={goalDetails.average_monthly_savings} stroke="var(--primary)" strokeDasharray="3 3" label={{ position: 'top', value: 'Avg', fill: 'var(--primary)', fontSize: 12 }} />
                      <Bar 
                        dataKey="saved_amount" 
                        fill="url(#colorSaved)" 
                        radius={[6, 6, 0, 0]} 
                        animationDuration={1500}
                      />
                      <defs>
                        <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Saved</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatCurrency(goalDetails.total_saved)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Remaining</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatCurrency(goalDetails.remaining_amount)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Avg. Monthly</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatCurrency(goalDetails.average_monthly_savings)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Consistency</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 600, color: goalDetails.consistency_score > 70 ? '#10B981' : '#F59E0B' }}>
                        {goalDetails.consistency_score}/100
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Recommendations & What-if Simulator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* FinTwin AI Insights */}
              <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(14,165,164,0.05) 0%, rgba(14,165,164,0.15) 100%)', border: '1px solid rgba(14,165,164,0.2)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Sparkles size={18} /> FinTwin AI Insights
                </h3>
                
                {goalDetails.forecast.recommendation.extra_amount_required > 0 ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                      You are slightly behind schedule. To reach your goal by the target date, we recommend increasing your monthly savings to <strong style={{ color: 'var(--text)' }}>{formatCurrency(goalDetails.forecast.recommendation.recommended_monthly_savings)}</strong>.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <TrendingUp size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                      Excellent work! You are on track to achieve this goal on time with your current savings rate.
                    </p>
                  </div>
                )}
                
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg)', borderRadius: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Prediction: </span>
                  <strong style={{ color: 'var(--text)' }}>
                    {goalDetails.forecast.predicted_date 
                      ? new Date(goalDetails.forecast.predicted_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                      : 'N/A'
                    }
                  </strong>
                  {goalDetails.forecast.predicted_date && new Date(goalDetails.forecast.predicted_date) > new Date(goalDetails.goal.target_date) && (
                    <span style={{ color: '#EF4444', marginLeft: '0.5rem' }}>(Delayed)</span>
                  )}
                </div>
              </div>

              {/* What-if Simulator */}
              <div className="glass-card">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>What-If Simulator</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>See how changing your monthly savings affects your goal completion date.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Monthly Savings Amount (₹)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        value={simulatorMonthly}
                        onChange={(e) => setSimulatorMonthly(e.target.value)}
                        style={{ 
                          flex: 1, 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border)', 
                          backgroundColor: 'var(--bg)',
                          color: 'var(--text)',
                          outline: 'none'
                        }}
                      />
                      <button 
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        style={{
                          padding: '0 1.25rem',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          opacity: isSimulating ? 0.7 : 1
                        }}
                      >
                        Simulate
                      </button>
                    </div>
                  </div>

                  {simulatedForecast && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      style={{ 
                        marginTop: '1rem', 
                        padding: '1.25rem', 
                        backgroundColor: 'var(--bg)', 
                        borderRadius: '12px',
                        border: '1px dashed var(--border)'
                      }}
                    >
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Simulated Completion Date</p>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.4rem', margin: 0 }}>
                          {simulatedForecast.predicted_date 
                            ? new Date(simulatedForecast.predicted_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                            : 'N/A'
                          }
                        </h4>
                        {simulatedForecast.recommendation.time_reduction_months > 0 && (
                          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 500, marginBottom: '4px' }}>
                            ({Math.floor(simulatedForecast.recommendation.time_reduction_months / 12)}y {simulatedForecast.recommendation.time_reduction_months % 12}m earlier)
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
