from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.goal_service import GoalService
from app.schemas.goal import (
    GoalCreate, GoalResponse, GoalSavingsHistoryCreate,
    GoalSavingsHistoryResponse, GoalDetailResponse, GoalForecastResponse
)
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=GoalResponse)
def create_goal(
    goal_in: GoalCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    return service.create_goal(current_user.id, goal_in)

@router.get("/", response_model=list[GoalResponse])
def get_goals(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    return service.get_user_goals(current_user.id)

@router.post("/{goal_id}/savings", response_model=GoalSavingsHistoryResponse)
def add_goal_savings(
    goal_id: int,
    savings_in: GoalSavingsHistoryCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    try:
        return service.add_savings(current_user.id, goal_id, savings_in)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{goal_id}", response_model=GoalDetailResponse)
def get_goal(
    goal_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    try:
        return service.get_goal_details(current_user.id, goal_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{goal_id}/history", response_model=list[GoalSavingsHistoryResponse])
def get_goal_history(
    goal_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    try:
        return service.get_goal_history(current_user.id, goal_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{goal_id}/forecast", response_model=GoalForecastResponse)
def get_goal_forecast(
    goal_id: int,
    monthly_savings: float = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = GoalService(db)
    try:
        details = service.get_goal_details(current_user.id, goal_id)
        
        # If what-if simulator provides a custom monthly_savings
        if monthly_savings is not None:
            goal_model = service.get_goal(current_user.id, goal_id)
            return service.generate_forecast(goal_model, monthly_savings, details.remaining_amount)
            
        return details.forecast
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
