const API_BASE = 'http://localhost:8000/api/v1';

let token = null;

export const login = async () => {
  if (token) return token;
  
  const formData = new URLSearchParams();
  formData.append('username', 'alex@example.com');
  formData.append('password', 'password123');
  
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    token = data.access_token;
    return token;
  } catch (err) {
    console.error("Auth error:", err);
    throw err;
  }
};

const fetchWithAuth = async (endpoint) => {
  await login();
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      token = null; // Token might be expired
      return fetchWithAuth(endpoint); // Retry once
    }
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
};

const postWithAuth = async (endpoint, data) => {
  await login();
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      token = null;
      return postWithAuth(endpoint, data);
    }
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
};

export const getNetWorth = () => fetchWithAuth('/dashboard/net-worth');
export const getIncome = () => fetchWithAuth('/dashboard/income');
export const getExpenses = () => fetchWithAuth('/dashboard/expenses');
export const getSavings = () => fetchWithAuth('/dashboard/savings');
export const getWealth = () => fetchWithAuth('/dashboard/wealth');

// Goals APIs
export const getGoals = () => fetchWithAuth('/goals/');
export const getGoalDetails = (goalId) => fetchWithAuth(`/goals/${goalId}`);
export const getGoalForecast = (goalId, monthlySavings = null) => {
    let url = `/goals/${goalId}/forecast`;
    if (monthlySavings !== null) {
        url += `?monthly_savings=${monthlySavings}`;
    }
    return fetchWithAuth(url);
};

// Risk APIs
export const getRiskAnalysis = () => fetchWithAuth('/risk/');
export const getRiskHistory = () => fetchWithAuth('/risk/history');
export const getRiskDetails = (riskId) => fetchWithAuth(`/risk/${riskId}`);
export const executeRiskActionPlan = (actionData) => postWithAuth('/risk/action-plan', actionData);
export const createRiskBudget = (budgetData) => postWithAuth('/risk/create-budget', budgetData);
