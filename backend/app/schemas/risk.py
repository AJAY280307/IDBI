from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RiskMasterBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class RiskCauseSchema(BaseModel):
    id: int
    cause_description: str
    category: Optional[str] = None

    class Config:
        from_attributes = True

class RiskSolutionSchema(BaseModel):
    id: int
    solution_text: str
    is_ai_generated: bool
    is_alternative: bool

    class Config:
        from_attributes = True

class PreventionTipSchema(BaseModel):
    id: int
    tip_text: str

    class Config:
        from_attributes = True

class ActionPlanSchema(BaseModel):
    id: int
    action_name: str
    action_endpoint: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class UserRiskAnalysisResponse(BaseModel):
    id: int
    risk: RiskMasterBase
    risk_score: float
    risk_level: str
    current_financial_impact: Optional[str] = None
    future_financial_impact: Optional[str] = None
    goal_delay_prediction: Optional[str] = None
    last_updated: datetime
    
    causes: List[RiskCauseSchema] = []
    solutions: List[RiskSolutionSchema] = []
    prevention_tips: List[PreventionTipSchema] = []
    action_plans: List[ActionPlanSchema] = []

    class Config:
        from_attributes = True

class RiskHistoryResponse(BaseModel):
    id: int
    risk_id: int
    risk_name: str
    risk_score: float
    recorded_at: datetime

    class Config:
        from_attributes = True

class CreateBudgetRequest(BaseModel):
    amount: float
    category: str
    frequency: str = "monthly"

class ActionPlanRequest(BaseModel):
    action_id: int
    action_name: str
