from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.risk import RiskMaster, UserRiskAnalysis, RiskHistory
from app.schemas.risk import UserRiskAnalysisResponse, RiskHistoryResponse, CreateBudgetRequest, ActionPlanRequest
from app.agents.risk_agent import run_risk_analysis

router = APIRouter()

@router.get("/", response_model=List[UserRiskAnalysisResponse])
def get_risk_analysis(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the comprehensive risk analysis for the user.
    If no analysis exists, it will trigger the LangGraph agent to generate it.
    We also trigger a background task to refresh the analysis based on latest data.
    """
    analysis = db.query(UserRiskAnalysis).filter(UserRiskAnalysis.user_id == current_user.id).all()
    
    if not analysis:
        # Run synchronously the first time
        run_risk_analysis(current_user.id, db)
        analysis = db.query(UserRiskAnalysis).filter(UserRiskAnalysis.user_id == current_user.id).all()
    else:
        # Run asynchronously to refresh insights without blocking response
        background_tasks.add_task(run_risk_analysis, current_user.id, db)
        
    return analysis

@router.get("/history", response_model=List[RiskHistoryResponse])
def get_risk_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = db.query(RiskHistory).join(RiskMaster).filter(
        RiskHistory.user_id == current_user.id
    ).order_by(RiskHistory.recorded_at.asc()).all()
    
    results = []
    for h in history:
        results.append(RiskHistoryResponse(
            id=h.id,
            risk_id=h.risk_id,
            risk_name=h.risk.name,
            risk_score=h.risk_score,
            recorded_at=h.recorded_at
        ))
    return results

@router.get("/{risk_id}", response_model=UserRiskAnalysisResponse)
def get_single_risk_detail(
    risk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = db.query(UserRiskAnalysis).filter(
        UserRiskAnalysis.user_id == current_user.id,
        UserRiskAnalysis.risk_id == risk_id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Risk analysis not found")
        
    return analysis

@router.post("/action-plan")
def execute_action_plan(
    request: ActionPlanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dummy integration to record intent
    return {"status": "success", "message": f"Action plan '{request.action_name}' initiated successfully.", "action_id": request.action_id}

@router.post("/create-budget")
def create_budget(
    request: CreateBudgetRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dummy integration to record intent
    return {"status": "success", "message": f"Budget of ₹{request.amount} for {request.category} created successfully."}
