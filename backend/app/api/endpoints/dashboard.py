from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.services.finance_service import FinanceService
from app.schemas.finance import NetWorthResponse, IncomeResponse, ExpensesResponse, SavingsResponse, WealthResponse
from app.models.user import User

router = APIRouter()

@router.get("/net-worth", response_model=NetWorthResponse)
def get_net_worth(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = FinanceService(db)
    return service.get_net_worth(current_user.id)

@router.get("/income", response_model=IncomeResponse)
def get_income(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = FinanceService(db)
    return service.get_income_analytics(current_user.id)

@router.get("/expenses", response_model=ExpensesResponse)
def get_expenses(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = FinanceService(db)
    return service.get_expense_analytics(current_user.id)

@router.get("/savings", response_model=SavingsResponse)
def get_savings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = FinanceService(db)
    return service.get_savings_analytics(current_user.id)

@router.get("/wealth", response_model=WealthResponse)
def get_wealth(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    service = FinanceService(db)
    return service.get_wealth_analytics(current_user.id)
