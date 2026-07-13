import React, { useState } from 'react';
import { CreditCard, Landmark, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';

const bankAccounts = [
  {
    id: 'b1',
    name: 'HDFC Bank',
    type: 'Savings Account',
    accountNumber: '**** **** 1234',
    balance: 1450000,
    color: 'linear-gradient(135deg, #004A8F 0%, #008C7A 100%)',
    logo: 'H'
  },
  {
    id: 'b2',
    name: 'State Bank of India',
    type: 'Salary Account',
    accountNumber: '**** **** 9876',
    balance: 850000,
    color: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)',
    logo: 'S'
  },
  {
    id: 'b3',
    name: 'ICICI Bank',
    type: 'Current Account',
    accountNumber: '**** **** 4567',
    balance: 325000,
    color: 'linear-gradient(135deg, #F97316 0%, #fb923c 100%)',
    logo: 'I'
  }
];

const allTransactions = [
  { id: 't1', bankId: 'b1', date: '2026-07-12', description: 'Amazon Shopping', amount: -4500, category: 'Shopping' },
  { id: 't2', bankId: 'b2', date: '2026-07-10', description: 'TechCorp Salary', amount: 190000, category: 'Income' },
  { id: 't3', bankId: 'b1', date: '2026-07-09', description: 'Swiggy Food', amount: -850, category: 'Food' },
  { id: 't4', bankId: 'b3', date: '2026-07-08', description: 'Client Payment', amount: 45000, category: 'Income' },
  { id: 't5', bankId: 'b2', date: '2026-07-05', description: 'Home Rent', amount: -35000, category: 'Housing' },
  { id: 't6', bankId: 'b1', date: '2026-07-02', description: 'Uber Rides', amount: -1200, category: 'Transport' },
  { id: 't7', bankId: 'b3', date: '2026-06-28', description: 'Office Supplies', amount: -8500, category: 'Business' },
  { id: 't8', bankId: 'b1', date: '2026-06-25', description: 'Netflix Subscription', amount: -649, category: 'Entertainment' },
];

const Accounts = () => {
  const [selectedBank, setSelectedBank] = useState(null);

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const displayedTransactions = selectedBank 
    ? allTransactions.filter(t => t.bankId === selectedBank) 
    : allTransactions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Bank Accounts</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your liquidity and track transactions across all banks.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Cash Balance</p>
          <h2 style={{ color: 'var(--primary)', fontSize: '2rem' }}>{formatINR(totalBalance)}</h2>
        </div>
      </div>

      {/* Apple Wallet Style Cards */}
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
        <div 
          onClick={() => setSelectedBank(null)}
          style={{ 
            minWidth: '280px', 
            height: '180px',
            borderRadius: '16px',
            padding: '1.5rem',
            background: selectedBank === null ? 'var(--primary)' : 'var(--card-bg)',
            color: selectedBank === null ? 'white' : 'var(--text)',
            border: selectedBank === null ? 'none' : '1px solid var(--border)',
            boxShadow: selectedBank === null ? '0 10px 25px rgba(0, 140, 122, 0.4)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>All Accounts</span>
            <Landmark size={24} opacity={0.8} />
          </div>
          <div>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Consolidated Balance</p>
            <h3 style={{ fontSize: '1.5rem' }}>{formatINR(totalBalance)}</h3>
          </div>
        </div>

        {bankAccounts.map(bank => (
          <div 
            key={bank.id}
            onClick={() => setSelectedBank(bank.id)}
            style={{ 
              minWidth: '300px', 
              height: '180px',
              borderRadius: '16px',
              padding: '1.5rem',
              background: bank.color,
              color: 'white',
              boxShadow: selectedBank === bank.id ? '0 12px 30px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
              transform: selectedBank === bank.id ? 'translateY(-5px)' : 'none',
              opacity: selectedBank && selectedBank !== bank.id ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>{bank.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{bank.type}</span>
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {bank.logo}
              </div>
            </div>
            <div>
              <p style={{ opacity: 0.9, fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>{bank.accountNumber}</p>
              <h3 style={{ fontSize: '1.5rem' }}>{formatINR(bank.balance)}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Recent Transactions {selectedBank && `(${bankAccounts.find(b => b.id === selectedBank).name})`}</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search..." style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent' }} />
            </div>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {displayedTransactions.map((tx, i) => (
            <div key={tx.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: i === displayedTransactions.length - 1 ? 'none' : '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: tx.amount > 0 ? 'rgba(0, 140, 122, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                  color: tx.amount > 0 ? 'var(--primary)' : 'var(--accent)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  {tx.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{tx.description}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                    <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                    {selectedBank === null && (
                      <>
                        <span>•</span>
                        <span>{bankAccounts.find(b => b.id === tx.bankId)?.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ 
                fontWeight: 600, 
                color: tx.amount > 0 ? 'var(--primary)' : 'var(--text)' 
              }}>
                {tx.amount > 0 ? '+' : ''}{formatINR(tx.amount)}
              </div>
            </div>
          ))}
          {displayedTransactions.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No transactions found for this account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
