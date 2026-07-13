import React, { useState, useEffect } from 'react';
import FinancialCard from '../components/FinancialCard';
import { DollarSign, PieChart, Activity, Briefcase, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getNetWorth, getIncome, getExpenses, getSavings, getWealth } from '../services/api';

const COLORS = ['#008C7A', '#0EA5A4', '#F97316', '#111827', '#64748b'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    netWorth: null,
    income: null,
    expenses: null,
    savings: null,
    wealth: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nw, inc, exp, sav, wlt] = await Promise.all([
          getNetWorth(),
          getIncome(),
          getExpenses(),
          getSavings(),
          getWealth()
        ]);
        
        setDashboardData({
          netWorth: nw,
          income: inc,
          expenses: exp,
          savings: sav,
          wealth: wlt
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Financial Digital Twin...</h2>
      </div>
    );
  }

  const { netWorth, income, expenses, savings, wealth } = dashboardData;

  // Format chart data
  const wealthGraphData = wealth.history.map(snapshot => ({
    name: new Date(snapshot.month).toLocaleString('default', { month: 'short' }),
    value: snapshot.net_worth
  }));

  const expenseGraphData = expenses.by_category.map((cat, index) => ({
    name: cat.category,
    value: cat.total,
    color: COLORS[index % COLORS.length]
  }));

  // Helper for INR currency
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Alex. Here's your financial summary.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <FinancialCard 
          title="Net Worth" 
          amount={formatINR(netWorth.net_worth)} 
          change={12.5} // Static mock for now
          isPositive={true} 
          icon={Briefcase} 
        />
        <FinancialCard 
          title="Monthly Income" 
          amount={formatINR(income.current_salary)} 
          change={income.highest_increment?.increment_percentage || 0} 
          isPositive={(income.highest_increment?.increment_percentage || 0) >= 0} 
          icon={DollarSign} 
        />
        <FinancialCard 
          title="Total Expenses" 
          amount={formatINR(expenses.total_expenses)} 
          change={-2.1} 
          isPositive={false} 
          icon={Activity} 
        />
        <FinancialCard 
          title="Predicted Savings" 
          amount={formatINR(savings.predicted_next_month)} 
          change={5.0} 
          isPositive={true} 
          icon={PieChart} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Wealth Growth Graph */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3>Wealth Growth</h3>
            <button className="btn-outline" style={{ padding: '0.25rem 1rem', fontSize: '0.8rem' }}>This Year</button>
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wealthGraphData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)' }}
                  formatter={(value) => [formatINR(value), "Net Worth"]}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <h3>Financial Health</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute' }}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="16" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="16" strokeDasharray="565" strokeDashoffset="113" strokeLinecap="round" transform="rotate(-90 100 100)" />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: 'var(--primary)' }}>85</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Excellent</div>
              </div>
            </div>
            
            <div style={{ width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Savings Score</span>
                <span style={{ fontWeight: 600 }}>92/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Debt Score</span>
                <span style={{ fontWeight: 600 }}>88/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Expense Analytics */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3>Expense Analytics</h3>
            <button style={{ background: 'transparent', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 500 }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseGraphData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: 'var(--text-muted)', fontSize: 14}} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => formatINR(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {expenseGraphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
