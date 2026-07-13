from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # e.g., 'Real Estate', 'Stocks', 'Cash'
    value = Column(Float, nullable=False, default=0.0)
    
class Liability(Base):
    __tablename__ = "liabilities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # e.g., 'Mortgage', 'Credit Card'
    value = Column(Float, nullable=False, default=0.0)

class IncomeHistory(Base):
    __tablename__ = "income_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False) # Monthly salary
    effective_date = Column(Date, nullable=False)
    
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False) # e.g., 'Housing', 'Food', 'Transport'
    type = Column(String, nullable=False) # 'expense' or 'income'
    date = Column(Date, nullable=False)
    description = Column(String)

class SavingsHistory(Base):
    __tablename__ = "savings_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(Date, nullable=False) # e.g., 2026-06-01
    amount = Column(Float, nullable=False)
    
class WealthSnapshot(Base):
    __tablename__ = "wealth_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(Date, nullable=False)
    net_worth = Column(Float, nullable=False)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_name = Column(String, nullable=False)
    goal_icon = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False, default=0.0)
    target_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to history
    savings_history = relationship("GoalSavingsHistory", back_populates="goal", cascade="all, delete-orphan")

class GoalSavingsHistory(Base):
    __tablename__ = "goal_savings_history"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    saved_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to goal
    goal = relationship("Goal", back_populates="savings_history")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, nullable=False) # 'user' or 'ai'
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
