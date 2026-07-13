from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class RiskMaster(Base):
    __tablename__ = "risk_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)

class UserRiskAnalysis(Base):
    __tablename__ = "user_risk_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_id = Column(Integer, ForeignKey("risk_master.id"))
    risk_score = Column(Float, nullable=False, default=0.0) # 0 to 100
    risk_level = Column(String, nullable=False, default="Low") # High, Medium, Low
    current_financial_impact = Column(String, nullable=True)
    future_financial_impact = Column(String, nullable=True)
    goal_delay_prediction = Column(String, nullable=True)
    estimated_savings_if_corrected = Column(String, nullable=True)
    timeline_to_resolve = Column(String, nullable=True)
    exposure_amount = Column(Float, nullable=False, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    # Relationships
    risk = relationship("RiskMaster")
    causes = relationship("RiskCause", back_populates="analysis", cascade="all, delete-orphan")
    solutions = relationship("RiskSolution", back_populates="analysis", cascade="all, delete-orphan")
    prevention_tips = relationship("PreventionTip", back_populates="analysis", cascade="all, delete-orphan")
    action_plans = relationship("ActionPlan", back_populates="analysis", cascade="all, delete-orphan")

class RiskCause(Base):
    __tablename__ = "risk_causes"

    id = Column(Integer, primary_key=True, index=True)
    user_risk_id = Column(Integer, ForeignKey("user_risk_analysis.id"))
    cause_description = Column(String, nullable=False)
    category = Column(String, nullable=True)

    analysis = relationship("UserRiskAnalysis", back_populates="causes")

class RiskSolution(Base):
    __tablename__ = "risk_solutions"

    id = Column(Integer, primary_key=True, index=True)
    user_risk_id = Column(Integer, ForeignKey("user_risk_analysis.id"))
    solution_text = Column(String, nullable=False)
    is_ai_generated = Column(Boolean, default=True)
    is_alternative = Column(Boolean, default=False)

    analysis = relationship("UserRiskAnalysis", back_populates="solutions")

class PreventionTip(Base):
    __tablename__ = "prevention_tips"

    id = Column(Integer, primary_key=True, index=True)
    user_risk_id = Column(Integer, ForeignKey("user_risk_analysis.id"))
    tip_text = Column(String, nullable=False)

    analysis = relationship("UserRiskAnalysis", back_populates="prevention_tips")

class RiskHistory(Base):
    __tablename__ = "risk_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_id = Column(Integer, ForeignKey("risk_master.id"))
    risk_score = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)

class ActionPlan(Base):
    __tablename__ = "action_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_risk_id = Column(Integer, ForeignKey("user_risk_analysis.id"))
    action_name = Column(String, nullable=False)
    action_endpoint = Column(String, nullable=True) # e.g. /api/risk/create-budget
    status = Column(String, default="pending") # pending, completed

    analysis = relationship("UserRiskAnalysis", back_populates="action_plans")

class RiskNotification(Base):
    __tablename__ = "risk_notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
