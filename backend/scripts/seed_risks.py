import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.base import SessionLocal, engine, Base
from app.models.risk import RiskMaster, UserRiskAnalysis, RiskCause, RiskSolution, PreventionTip, RiskHistory, ActionPlan

risks = [
    {"name": "Overspending Risk", "description": "Risk of spending beyond means or budget."},
    {"name": "Emergency Fund Risk", "description": "Risk of not having enough liquid savings for emergencies."},
    {"name": "Market Exposure Risk", "description": "Risk associated with overexposure to certain asset classes or sectors."},
    {"name": "Debt Risk", "description": "Risk of having too much debt or high-interest debt."},
    {"name": "Goal Delay Risk", "description": "Risk of not achieving financial goals on time."},
    {"name": "Cash Flow Risk", "description": "Risk of negative cash flow or liquidity issues."},
    {"name": "Credit Utilization Risk", "description": "Risk of high credit card utilization affecting credit score."},
    {"name": "Investment Volatility Risk", "description": "Risk of high volatility in the investment portfolio."},
    {"name": "Inflation Risk", "description": "Risk of inflation eroding purchasing power."},
    {"name": "Retirement Risk", "description": "Risk of outliving savings or not having enough for retirement."}
]

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    for r in risks:
        existing = db.query(RiskMaster).filter(RiskMaster.name == r["name"]).first()
        if not existing:
            new_risk = RiskMaster(name=r["name"], description=r["description"])
            db.add(new_risk)
    
    db.commit()
    db.close()
    print("Seeded risks successfully.")

if __name__ == "__main__":
    seed()
