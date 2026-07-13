import React from 'react';
import { Target, Home, Plane, GraduationCap } from 'lucide-react';

const goals = [
  { name: 'Dream Home', current: 45000, target: 100000, icon: Home, date: 'Dec 2028', color: '#008C7A' },
  { name: 'Retirement', current: 150000, target: 1000000, icon: Target, date: 'Jan 2045', color: '#0EA5A4' },
  { name: 'Europe Trip', current: 5000, target: 10000, icon: Plane, date: 'Jun 2027', color: '#F97316' },
  { name: 'College Fund', current: 25000, target: 80000, icon: GraduationCap, date: 'Aug 2035', color: '#111827' },
];

const Goals = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Financial Goals</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your progress towards your major life milestones.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {goals.map((goal, idx) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: `${goal.color}15`, color: goal.color, borderRadius: '12px' }}>
                    <goal.icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{goal.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target: {goal.date}</span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: goal.color }}>
                  {Math.round(progress)}%
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>${goal.current.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)' }}>of ${goal.target.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: goal.color, borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
