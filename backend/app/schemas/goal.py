from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class GoalSavingsHistoryBase(BaseModel):
    month: int
    year: int
    saved_amount: float

class GoalSavingsHistoryCreate(GoalSavingsHistoryBase):
    pass

class GoalSavingsHistoryResponse(GoalSavingsHistoryBase):
    id: int
    goal_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    goal_name: str
    goal_icon: str
    target_amount: float
    target_date: date

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    user_id: int
    current_amount: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class AIRecommendation(BaseModel):
    recommended_monthly_savings: float
    extra_amount_required: float
    time_reduction_months: int
    consistency_insight: str

class GoalForecastResponse(BaseModel):
    predicted_months: int
    predicted_date: Optional[date]
    recommendation: AIRecommendation

class GoalDetailResponse(BaseModel):
    goal: GoalResponse
    history: List[GoalSavingsHistoryResponse]
    total_saved: float
    remaining_amount: float
    average_monthly_savings: float
    consistency_score: float
    completion_probability: float
    forecast: GoalForecastResponse
