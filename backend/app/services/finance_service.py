from sqlalchemy.orm import Session
from app.repositories.finance_repo import FinanceRepository
from app.schemas.finance import NetWorthResponse, IncomeResponse, ExpensesResponse, SavingsResponse, WealthResponse, IncomeIncrement, ExpenseCategory
from typing import Dict, Any

class FinanceService:
    def __init__(self, db: Session):
        self.repo = FinanceRepository(db)
    
    def get_net_worth(self, user_id: int) -> NetWorthResponse:
        assets = self.repo.get_assets(user_id)
        liabilities = self.repo.get_liabilities(user_id)
        
        total_assets = sum(a.value for a in assets)
        total_liabilities = sum(l.value for l in liabilities)
        net_worth = total_assets - total_liabilities
        
        return NetWorthResponse(
            net_worth=net_worth,
            total_assets=total_assets,
            total_liabilities=total_liabilities,
            assets=[{"id": a.id, "name": a.name, "type": a.type, "value": a.value} for a in assets],
            liabilities=[{"id": l.id, "name": l.name, "type": l.type, "value": l.value} for l in liabilities]
        )

    def get_income_analytics(self, user_id: int) -> IncomeResponse:
        history = self.repo.get_income_history(user_id)
        if not history:
            return IncomeResponse(current_salary=0, history=[])
            
        increments = []
        for i in range(1, len(history)):
            prev = history[i-1]
            curr = history[i]
            inc_percent = ((curr.amount - prev.amount) / prev.amount) * 100
            increments.append(IncomeIncrement(
                year=curr.effective_date.year,
                increment_percentage=round(inc_percent, 2),
                old_salary=prev.amount,
                new_salary=curr.amount
            ))
            
        highest = max(increments, key=lambda x: x.increment_percentage) if increments else None
        lowest = min(increments, key=lambda x: x.increment_percentage) if increments else None
        
        return IncomeResponse(
            current_salary=history[-1].amount,
            highest_increment=highest,
            lowest_increment=lowest,
            history=[{"date": str(h.effective_date), "amount": h.amount} for h in history]
        )

    def get_expense_analytics(self, user_id: int) -> ExpensesResponse:
        expenses = self.repo.get_expenses(user_id)
        total = sum(e.amount for e in expenses)
        
        by_cat = {}
        for e in expenses:
            by_cat[e.category] = by_cat.get(e.category, 0) + e.amount
            
        categories = [ExpenseCategory(category=k, total=v) for k, v in by_cat.items()]
        
        return ExpensesResponse(
            total_expenses=total,
            by_category=categories,
            recent_transactions=[{"id": e.id, "amount": e.amount, "category": e.category, "date": str(e.date), "description": e.description} for e in expenses[:10]]
        )

    def get_savings_analytics(self, user_id: int) -> SavingsResponse:
        history = self.repo.get_savings_history(user_id)
        if not history:
            return SavingsResponse(average_savings=0, highest_savings={}, lowest_savings={}, predicted_next_month=0, history=[])
            
        amounts = [h.amount for h in history]
        avg = sum(amounts) / len(amounts)
        highest = max(history, key=lambda x: x.amount)
        lowest = min(history, key=lambda x: x.amount)
        
        # Simple 3-month moving average prediction
        recent_3 = amounts[-3:] if len(amounts) >= 3 else amounts
        predicted = sum(recent_3) / len(recent_3) if recent_3 else 0
        
        return SavingsResponse(
            average_savings=round(avg, 2),
            highest_savings={"month": str(highest.month), "amount": highest.amount},
            lowest_savings={"month": str(lowest.month), "amount": lowest.amount},
            predicted_next_month=round(predicted, 2),
            history=[{"month": str(h.month), "amount": h.amount} for h in history]
        )

    def get_wealth_analytics(self, user_id: int) -> WealthResponse:
        snapshots = self.repo.get_wealth_snapshots(user_id)
        if not snapshots:
            # Fallback to current net worth
            nw = self.get_net_worth(user_id).net_worth
            return WealthResponse(current_wealth=nw, history=[])
            
        current = snapshots[-1].net_worth
        return WealthResponse(
            current_wealth=current,
            history=[{"month": str(s.month), "net_worth": s.net_worth} for s in snapshots]
        )
