from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.finance import Asset, Liability, IncomeHistory, Transaction, SavingsHistory, WealthSnapshot
from datetime import date
from typing import List

class FinanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_assets(self, user_id: int) -> List[Asset]:
        return self.db.query(Asset).filter(Asset.user_id == user_id).all()

    def get_liabilities(self, user_id: int) -> List[Liability]:
        return self.db.query(Liability).filter(Liability.user_id == user_id).all()

    def get_income_history(self, user_id: int) -> List[IncomeHistory]:
        return self.db.query(IncomeHistory).filter(IncomeHistory.user_id == user_id).order_by(IncomeHistory.effective_date).all()

    def get_expenses(self, user_id: int) -> List[Transaction]:
        return self.db.query(Transaction).filter(
            Transaction.user_id == user_id, 
            Transaction.type == 'expense'
        ).order_by(Transaction.date.desc()).all()

    def get_savings_history(self, user_id: int) -> List[SavingsHistory]:
        return self.db.query(SavingsHistory).filter(SavingsHistory.user_id == user_id).order_by(SavingsHistory.month).all()

    def get_wealth_snapshots(self, user_id: int) -> List[WealthSnapshot]:
        return self.db.query(WealthSnapshot).filter(WealthSnapshot.user_id == user_id).order_by(WealthSnapshot.month).all()
