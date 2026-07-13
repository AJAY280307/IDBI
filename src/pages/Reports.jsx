import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const reports = [
  { name: 'Comprehensive Wealth Report', date: 'Q2 2026', type: 'PDF' },
  { name: 'Tax Optimization Summary', date: '2025 Tax Year', type: 'PDF' },
  { name: 'Investment Performance Matrix', date: 'Last 12 Months', type: 'PDF' },
  { name: 'Risk Assessment Document', date: 'Current', type: 'PDF' },
];

const Reports = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Reports & Documents</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate and download your official financial reports.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} /> Generate New Report
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Document Name</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Period</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Format</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 500 }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(0, 140, 122, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
                    <FileText size={20} />
                  </div>
                  {report.name}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> {report.date}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--border)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {report.type}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Download size={16} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
