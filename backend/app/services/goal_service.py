from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.models.finance import Goal, GoalSavingsHistory
from app.schemas.goal import (
    GoalCreate, GoalSavingsHistoryCreate, AIRecommendation,
    GoalForecastResponse, GoalDetailResponse, GoalResponse, GoalSavingsHistoryResponse
)
import math

class GoalService:
    def __init__(self, db: Session):
        self.db = db

    def create_goal(self, user_id: int, goal_in: GoalCreate) -> Goal:
        goal = Goal(
            user_id=user_id,
            goal_name=goal_in.goal_name,
            goal_icon=goal_in.goal_icon,
            target_amount=goal_in.target_amount,
            target_date=goal_in.target_date,
            current_amount=0.0
        )
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def add_savings(self, user_id: int, goal_id: int, savings_in: GoalSavingsHistoryCreate) -> GoalSavingsHistory:
        goal = self.db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
        if not goal:
            raise ValueError("Goal not found")

        savings = GoalSavingsHistory(
            goal_id=goal_id,
            month=savings_in.month,
            year=savings_in.year,
            saved_amount=savings_in.saved_amount
        )
        self.db.add(savings)
        
        goal.current_amount += savings_in.saved_amount
        
        self.db.commit()
        self.db.refresh(savings)
        return savings

    def get_goal(self, user_id: int, goal_id: int) -> Goal:
        goal = self.db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
        if not goal:
            raise ValueError("Goal not found")
        return goal

    def get_user_goals(self, user_id: int) -> list[Goal]:
        return self.db.query(Goal).filter(Goal.user_id == user_id).all()

    def get_goal_history(self, user_id: int, goal_id: int) -> list[GoalSavingsHistory]:
        goal = self.get_goal(user_id, goal_id)
        return self.db.query(GoalSavingsHistory).filter(GoalSavingsHistory.goal_id == goal_id).order_by(GoalSavingsHistory.year.asc(), GoalSavingsHistory.month.asc()).all()

    def get_goal_details(self, user_id: int, goal_id: int) -> GoalDetailResponse:
        goal = self.get_goal(user_id, goal_id)
        history = self.get_goal_history(user_id, goal_id)
        
        total_saved = goal.current_amount
        remaining_amount = max(0, goal.target_amount - total_saved)
        
        # Calculate Average Monthly Savings
        if history:
            avg_monthly_savings = total_saved / len(history)
        else:
            avg_monthly_savings = 0.0

        # Calculate Savings Consistency Score (0-100)
        # Based on variance of savings
        consistency_score = 0
        if len(history) > 1:
            mean = avg_monthly_savings
            variance = sum((h.saved_amount - mean) ** 2 for h in history) / len(history)
            std_dev = math.sqrt(variance)
            cv = std_dev / mean if mean > 0 else 0
            # Higher CV means lower consistency. Let's map CV 0 -> 100, CV >= 1 -> 0
            consistency_score = max(0, min(100, int((1 - min(cv, 1)) * 100)))
        elif len(history) == 1:
            consistency_score = 100

        # Goal Completion Probability
        # Simple heuristic based on current trajectory vs required trajectory
        today = date.today()
        months_left_to_target = (goal.target_date.year - today.year) * 12 + goal.target_date.month - today.month
        
        required_monthly = remaining_amount / months_left_to_target if months_left_to_target > 0 else remaining_amount
        
        if remaining_amount == 0:
            completion_probability = 100.0
        elif avg_monthly_savings == 0:
            completion_probability = 0.0
        else:
            ratio = avg_monthly_savings / required_monthly if required_monthly > 0 else 1.0
            completion_probability = min(100.0, max(0.0, ratio * 100))

        # Forecast
        forecast = self.generate_forecast(goal, avg_monthly_savings, remaining_amount)

        return GoalDetailResponse(
            goal=GoalResponse.model_validate(goal),
            history=[GoalSavingsHistoryResponse.model_validate(h) for h in history],
            total_saved=total_saved,
            remaining_amount=remaining_amount,
            average_monthly_savings=avg_monthly_savings,
            consistency_score=consistency_score,
            completion_probability=completion_probability,
            forecast=forecast
        )

    def generate_forecast(self, goal: Goal, avg_monthly_savings: float, remaining_amount: float) -> GoalForecastResponse:
        today = date.today()
        months_left_to_target = (goal.target_date.year - today.year) * 12 + goal.target_date.month - today.month
        required_monthly = remaining_amount / months_left_to_target if months_left_to_target > 0 else remaining_amount

        if remaining_amount == 0:
            return GoalForecastResponse(
                predicted_months=0,
                predicted_date=today,
                recommendation=AIRecommendation(
                    recommended_monthly_savings=0,
                    extra_amount_required=0,
                    time_reduction_months=0,
                    consistency_insight="Goal achieved!"
                )
            )

        if avg_monthly_savings > 0:
            predicted_months = int(math.ceil(remaining_amount / avg_monthly_savings))
            
            # Add predicted_months to today
            month = today.month - 1 + predicted_months
            year = today.year + month // 12
            month = month % 12 + 1
            predicted_date = date(year, month, 1)
        else:
            predicted_months = -1
            predicted_date = None
        
        # Recommendations
        recommended_monthly_savings = max(required_monthly, avg_monthly_savings)
        extra_amount_required = max(0, required_monthly - avg_monthly_savings)
        
        if avg_monthly_savings > 0 and extra_amount_required > 0:
            new_predicted_months = int(math.ceil(remaining_amount / recommended_monthly_savings))
            time_reduction = predicted_months - new_predicted_months if predicted_months > 0 else 0
        else:
            time_reduction = 0

        insight = "You are on track!" if extra_amount_required == 0 else f"Save ₹{extra_amount_required:,.2f} more per month to meet your target."
        if predicted_months == -1:
            insight = "Start saving to see your forecast!"
            
        return GoalForecastResponse(
            predicted_months=predicted_months,
            predicted_date=predicted_date,
            recommendation=AIRecommendation(
                recommended_monthly_savings=recommended_monthly_savings,
                extra_amount_required=extra_amount_required,
                time_reduction_months=time_reduction,
                consistency_insight=insight
            )
        )
