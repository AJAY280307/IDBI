from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class AssetBase(BaseModel):
    name: str
    type: str
    value: float

class AssetResponse(AssetBase):
    id: int
    class Config:
        from_attributes = True

class LiabilityBase(BaseModel):
    name: str
    type: str
    value: float

class LiabilityResponse(LiabilityBase):
    id: int
    class Config:
        from_attributes = True

class NetWorthResponse(BaseModel):
    net_worth: float
    total_assets: float
    total_liabilities: float
    assets: List[AssetResponse]
    liabilities: List[LiabilityResponse]

class IncomeIncrement(BaseModel):
    year: int
    increment_percentage: float
    old_salary: float
    new_salary: float

class IncomeResponse(BaseModel):
    current_salary: float
    highest_increment: Optional[IncomeIncrement] = None
    lowest_increment: Optional[IncomeIncrement] = None
    history: List[dict]

class ExpenseCategory(BaseModel):
    category: str
    total: float

class ExpensesResponse(BaseModel):
    total_expenses: float
    by_category: List[ExpenseCategory]
    recent_transactions: List[dict]

class SavingsResponse(BaseModel):
    average_savings: float
    highest_savings: dict
    lowest_savings: dict
    predicted_next_month: float
    history: List[dict]

class WealthResponse(BaseModel):
    current_wealth: float
    history: List[dict]
