import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, timedelta
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.models.finance import Asset, Liability, IncomeHistory, Transaction, SavingsHistory, WealthSnapshot, Goal, GoalSavingsHistory
from app.models.risk import RiskMaster, UserRiskAnalysis, RiskCause, RiskSolution, PreventionTip, RiskHistory, ActionPlan
from app.core.security import get_password_hash

def seed_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if user exists
    user = db.query(User).filter(User.email == "alex@example.com").first()
    if not user:
        user = User(
            email="alex@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Alex Morgan"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Clean up old data for idempotency
    db.query(Asset).filter(Asset.user_id == user.id).delete()
    db.query(Liability).filter(Liability.user_id == user.id).delete()
    db.query(IncomeHistory).filter(IncomeHistory.user_id == user.id).delete()
    db.query(Transaction).filter(Transaction.user_id == user.id).delete()
    db.query(SavingsHistory).filter(SavingsHistory.user_id == user.id).delete()
    db.query(WealthSnapshot).filter(WealthSnapshot.user_id == user.id).delete()
    db.query(GoalSavingsHistory).filter(GoalSavingsHistory.goal.has(user_id=user.id)).delete()
    db.query(GoalSavingsHistory).filter(GoalSavingsHistory.goal.has(user_id=user.id)).delete()
    db.query(Goal).filter(Goal.user_id == user.id).delete()
    
    # Delete risk related data
    db.query(UserRiskAnalysis).filter(UserRiskAnalysis.user_id == user.id).delete()
    db.query(RiskMaster).delete()
    db.commit()

    # 1. Assets (in INR ₹)
    assets = [
        Asset(user_id=user.id, name="HDFC Savings", type="Cash", value=150000),
        Asset(user_id=user.id, name="Zerodha Stocks", type="Equity", value=850000),
        Asset(user_id=user.id, name="NPS Tier 1", type="Retirement", value=420000),
        Asset(user_id=user.id, name="Real Estate (Pune)", type="Real Estate", value=4500000)
    ]
    db.add_all(assets)

    # 2. Liabilities
    liabilities = [
        Liability(user_id=user.id, name="SBI Home Loan", type="Mortgage", value=2200000),
        Liability(user_id=user.id, name="HDFC Regalia CC", type="Credit Card", value=45000)
    ]
    db.add_all(liabilities)

    # 3. Income History (Salary in INR)
    income_history = [
        IncomeHistory(user_id=user.id, amount=120000, effective_date=date(2023, 4, 1)),
        IncomeHistory(user_id=user.id, amount=135000, effective_date=date(2024, 4, 1)),
        IncomeHistory(user_id=user.id, amount=160000, effective_date=date(2025, 4, 1)),
        IncomeHistory(user_id=user.id, amount=190000, effective_date=date(2026, 4, 1))
    ]
    db.add_all(income_history)

    # 4. Transactions (Expenses in INR)
    transactions = [
        Transaction(user_id=user.id, amount=35000, category="Housing", type="expense", date=date.today() - timedelta(days=2), description="Rent"),
        Transaction(user_id=user.id, amount=12000, category="Food", type="expense", date=date.today() - timedelta(days=5), description="Groceries & Swiggy"),
        Transaction(user_id=user.id, amount=5000, category="Transport", type="expense", date=date.today() - timedelta(days=10), description="Fuel"),
        Transaction(user_id=user.id, amount=8000, category="Utilities", type="expense", date=date.today() - timedelta(days=15), description="Electricity & Internet")
    ]
    db.add_all(transactions)

    # 5. Savings History
    savings = [
        SavingsHistory(user_id=user.id, month=date(2026, 1, 1), amount=60000),
        SavingsHistory(user_id=user.id, month=date(2026, 2, 1), amount=62000),
        SavingsHistory(user_id=user.id, month=date(2026, 3, 1), amount=58000),
        SavingsHistory(user_id=user.id, month=date(2026, 4, 1), amount=75000), # After increment
        SavingsHistory(user_id=user.id, month=date(2026, 5, 1), amount=80000),
        SavingsHistory(user_id=user.id, month=date(2026, 6, 1), amount=78000),
    ]
    db.add_all(savings)

    # 6. Wealth Snapshots
    snapshots = [
        WealthSnapshot(user_id=user.id, month=date(2026, 1, 1), net_worth=3200000),
        WealthSnapshot(user_id=user.id, month=date(2026, 2, 1), net_worth=3300000),
        WealthSnapshot(user_id=user.id, month=date(2026, 3, 1), net_worth=3350000),
        WealthSnapshot(user_id=user.id, month=date(2026, 4, 1), net_worth=3500000),
        WealthSnapshot(user_id=user.id, month=date(2026, 5, 1), net_worth=3580000),
        WealthSnapshot(user_id=user.id, month=date(2026, 6, 1), net_worth=3675000), # Current Net Worth
    ]
    db.add_all(snapshots)

    # 7. Goals
    goals_data = [
        Goal(user_id=user.id, goal_name="Dream Home", goal_icon="Home", target_amount=10000000, current_amount=72000, target_date=date(2030, 12, 31)),
        Goal(user_id=user.id, goal_name="Retirement", goal_icon="Target", target_amount=50000000, current_amount=110000, target_date=date(2045, 1, 1)),
        Goal(user_id=user.id, goal_name="Europe Trip", goal_icon="Plane", target_amount=500000, current_amount=25000, target_date=date(2027, 6, 1))
    ]
    db.add_all(goals_data)
    db.commit()

    for g in goals_data:
        db.refresh(g)

    # 8. Goal Savings History
    goal_savings = [
        GoalSavingsHistory(goal_id=goals_data[0].id, month=1, year=2026, saved_amount=30000),
        GoalSavingsHistory(goal_id=goals_data[0].id, month=2, year=2026, saved_amount=20000),
        GoalSavingsHistory(goal_id=goals_data[0].id, month=3, year=2026, saved_amount=22000),

        GoalSavingsHistory(goal_id=goals_data[1].id, month=1, year=2026, saved_amount=50000),
        GoalSavingsHistory(goal_id=goals_data[1].id, month=2, year=2026, saved_amount=60000),

        GoalSavingsHistory(goal_id=goals_data[2].id, month=1, year=2026, saved_amount=10000),
    GoalSavingsHistory(goal_id=goals_data[2].id, month=2, year=2026, saved_amount=15000),
    ]
    db.add_all(goal_savings)

    # 9. Risk Master Categories
    risk_categories = [
        RiskMaster(name="Overspending Risk", description="Risk of exceeding budget or historical spending averages."),
        RiskMaster(name="Emergency Fund Risk", description="Risk of having insufficient liquid assets for emergencies."),
        RiskMaster(name="Market Exposure Risk", description="Risk from over-concentration in specific asset classes."),
        RiskMaster(name="Debt Risk", description="Risk associated with high interest rates or debt-to-income ratio."),
        RiskMaster(name="Goal Delay Risk", description="Risk of not meeting financial goals on time due to current savings rate."),
        RiskMaster(name="Cash Flow Risk", description="Risk of monthly expenses exceeding monthly income."),
        RiskMaster(name="Credit Utilization Risk", description="Risk of high credit card utilization affecting credit score and increasing debt."),
        RiskMaster(name="Investment Volatility Risk", description="Risk from high variance in portfolio performance."),
        RiskMaster(name="Inflation Risk", description="Risk of purchasing power eroding due to inflation outstripping asset growth."),
        RiskMaster(name="Retirement Risk", description="Risk of insufficient corpus at target retirement age.")
    ]
    db.add_all(risk_categories)

    db.commit()
    db.close()
    print("Database seeded successfully with Indian Rupees (₹) data!")

if __name__ == "__main__":
    seed_db()
