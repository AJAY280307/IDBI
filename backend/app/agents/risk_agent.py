import os
import json
from typing import Dict, Any, List, TypedDict
from datetime import datetime
from sqlalchemy.orm import Session
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from app.models.risk import RiskMaster, UserRiskAnalysis, RiskCause, RiskSolution, PreventionTip, ActionPlan, RiskHistory
from app.models.finance import Asset, Liability, IncomeHistory, Transaction, SavingsHistory, WealthSnapshot, Goal

class RiskState(TypedDict):
    user_id: int
    db: Any # SqlAlchemy Session
    financial_data: Dict[str, Any]
    risk_categories: List[Dict[str, Any]]
    analysis_results: List[Dict[str, Any]]

def extract_financial_data(state: RiskState) -> RiskState:
    db = state["db"]
    user_id = state["user_id"]
    
    # Fetch user data
    assets = db.query(Asset).filter(Asset.user_id == user_id).all()
    liabilities = db.query(Liability).filter(Liability.user_id == user_id).all()
    income = db.query(IncomeHistory).filter(IncomeHistory.user_id == user_id).order_by(IncomeHistory.effective_date.desc()).first()
    expenses = db.query(Transaction).filter(Transaction.user_id == user_id, Transaction.type == "expense").order_by(Transaction.date.desc()).limit(50).all()
    savings = db.query(SavingsHistory).filter(SavingsHistory.user_id == user_id).order_by(SavingsHistory.month.desc()).limit(12).all()
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    
    financial_data = {
        "assets": [{"name": a.name, "type": a.type, "value": a.value} for a in assets],
        "liabilities": [{"name": l.name, "type": l.type, "value": l.value} for l in liabilities],
        "latest_income": income.amount if income else 0,
        "recent_expenses": [{"category": e.category, "amount": e.amount, "date": str(e.date)} for e in expenses],
        "recent_savings": [{"month": str(s.month), "amount": s.amount} for s in savings],
        "goals": [{"name": g.goal_name, "target": g.target_amount, "current": g.current_amount, "target_date": str(g.target_date)} for g in goals]
    }
    
    # Fetch risk categories
    categories = db.query(RiskMaster).all()
    risk_categories = [{"id": c.id, "name": c.name, "description": c.description} for c in categories]
    
    return {"financial_data": financial_data, "risk_categories": risk_categories}

def analyze_risks(state: RiskState) -> RiskState:
    # Ensure GOOGLE_API_KEY is available (loaded in main usually)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2)
    
    system_prompt = """
    You are an AI-powered Financial Risk Intelligence system for a wealth management platform.
    Analyze the user's financial profile against the provided risk categories.
    Return your analysis strictly in JSON format.
    The expected JSON format must be an array of objects, one for each risk category.
    Each object must have:
    - risk_master_id: (int)
    - risk_score: (float 0-100)
    - risk_level: ("Low", "Medium", "High")
    - current_financial_impact: (string, specific and actionable impact)
    - future_financial_impact: (string, long term prediction)
    - goal_delay_prediction: (string, format like "Your Dream Home goal may be delayed by 4 months.")
    - causes: list of {"cause_description": string, "category": string}
    - solutions: list of {"solution_text": string, "is_ai_generated": bool, "is_alternative": bool}
    - prevention_tips: list of {"tip_text": string}
    - action_plans: list of {"action_name": string, "action_endpoint": string}
    
    Make the insights extremely actionable and professional, similar to what a wealth advisor would provide.
    Examples of actionable outputs:
    - "Paying ₹35,000 immediately reduces utilization to 42%"
    - "Saving ₹12,000 monthly can build a 6-month emergency fund within 18 months."
    Use Indian Rupees (₹) in your responses where currency is needed.
    """
    
    human_prompt = f"""
    Financial Data:
    {json.dumps(state['financial_data'], indent=2)}
    
    Risk Categories to Analyze:
    {json.dumps(state['risk_categories'], indent=2)}
    
    Please provide the analysis.
    """
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_prompt)
    ])
    
    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        results = json.loads(content.strip())
    except Exception as e:
        print("Error parsing LLM output", e)
        results = []
        
    return {"analysis_results": results}

def save_analysis(state: RiskState) -> RiskState:
    db = state["db"]
    user_id = state["user_id"]
    results = state["analysis_results"]
    
    for res in results:
        risk_id = res.get("risk_master_id")
        if not risk_id: continue
        
        analysis = db.query(UserRiskAnalysis).filter(
            UserRiskAnalysis.user_id == user_id, 
            UserRiskAnalysis.risk_id == risk_id
        ).first()
        
        if analysis:
            analysis.risk_score = res.get("risk_score", 0)
            analysis.risk_level = res.get("risk_level", "Low")
            analysis.current_financial_impact = res.get("current_financial_impact")
            analysis.future_financial_impact = res.get("future_financial_impact")
            analysis.goal_delay_prediction = res.get("goal_delay_prediction")
            analysis.last_updated = datetime.utcnow()
            
            db.query(RiskCause).filter(RiskCause.user_risk_id == analysis.id).delete()
            db.query(RiskSolution).filter(RiskSolution.user_risk_id == analysis.id).delete()
            db.query(PreventionTip).filter(PreventionTip.user_risk_id == analysis.id).delete()
            db.query(ActionPlan).filter(ActionPlan.user_risk_id == analysis.id).delete()
        else:
            analysis = UserRiskAnalysis(
                user_id=user_id,
                risk_id=risk_id,
                risk_score=res.get("risk_score", 0),
                risk_level=res.get("risk_level", "Low"),
                current_financial_impact=res.get("current_financial_impact"),
                future_financial_impact=res.get("future_financial_impact"),
                goal_delay_prediction=res.get("goal_delay_prediction")
            )
            db.add(analysis)
            db.commit()
            db.refresh(analysis)
            
        history = RiskHistory(
            user_id=user_id,
            risk_id=risk_id,
            risk_score=res.get("risk_score", 0)
        )
        db.add(history)
            
        for cause in res.get("causes", []):
            db.add(RiskCause(user_risk_id=analysis.id, cause_description=cause.get("cause_description",""), category=cause.get("category")))
            
        for sol in res.get("solutions", []):
            db.add(RiskSolution(user_risk_id=analysis.id, solution_text=sol.get("solution_text",""), is_ai_generated=sol.get("is_ai_generated", True), is_alternative=sol.get("is_alternative", False)))
            
        for tip in res.get("prevention_tips", []):
            db.add(PreventionTip(user_risk_id=analysis.id, tip_text=tip.get("tip_text","")))
            
        for plan in res.get("action_plans", []):
            db.add(ActionPlan(user_risk_id=analysis.id, action_name=plan.get("action_name",""), action_endpoint=plan.get("action_endpoint")))
            
    db.commit()
    return state

# Compile graph
workflow = StateGraph(RiskState)
workflow.add_node("extract_data", extract_financial_data)
workflow.add_node("analyze", analyze_risks)
workflow.add_node("save", save_analysis)

workflow.set_entry_point("extract_data")
workflow.add_edge("extract_data", "analyze")
workflow.add_edge("analyze", "save")
workflow.add_edge("save", END)

risk_agent = workflow.compile()

def run_risk_analysis(user_id: int, db: Session):
    state = {
        "user_id": user_id,
        "db": db,
        "financial_data": {},
        "risk_categories": [],
        "analysis_results": []
    }
    risk_agent.invoke(state)
