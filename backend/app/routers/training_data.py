# app/routers/training_data.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import select
from datetime import datetime

from app.database import get_session
from app.models.training_data import TranslationContribution
from app.schemas.training_data import (
    TranslationContributionCreate,
    TranslationContributionVerify,
    TranslationContributionResponse
)

router = APIRouter(
    prefix="/training-data",
    tags=["TrainingData"]
)

@router.post("/", response_model=TranslationContributionResponse)
def submit_contribution(
    payload: TranslationContributionCreate,
    session=Depends(get_session),
    # Optional: current_user_id: int = Depends(some_auth_dependency)
):
    """
    1. User-submitted training data (Banglish->Bangla).
       is_verified=False by default until admin approves.
    """
    new_entry = TranslationContribution(
        banglish_text=payload.banglish_text,
        proposed_bangla_text=payload.proposed_bangla_text,
        # submitted_by=current_user_id if you track user
    )
    session.add(new_entry)
    session.commit()
    session.refresh(new_entry)
    return new_entry

@router.get("/unverified", response_model=List[TranslationContributionResponse])
def list_unverified_contributions(session=Depends(get_session)):
    """
    2. Admin fetches all unverified contributions.
    """
    statement = select(TranslationContribution).where(TranslationContribution.is_verified == False)
    results = session.exec(statement).all()
    return results

@router.patch("/verify/{contribution_id}", response_model=TranslationContributionResponse)
def verify_contribution(
    contribution_id: int,
    payload: TranslationContributionVerify,
    session=Depends(get_session),
):
    """
    3. Admin verifies or rejects a submission by toggling is_verified.
       If is_verified=True, set verified_at and verified_by.
    """
    # 3a. Find the matching contribution
    statement = select(TranslationContribution).where(TranslationContribution.id == contribution_id)
    contrib = session.exec(statement).first()

    if not contrib:
        raise HTTPException(status_code=404, detail="Contribution not found")

    # 3b. Update fields
    contrib.is_verified = payload.is_verified
    contrib.verified_by = payload.admin_id  # from the request or from admin's JWT
    if payload.is_verified:
        contrib.verified_at = datetime.utcnow()

    session.add(contrib)
    session.commit()
    session.refresh(contrib)
    return contrib

@router.get("/export-verified", response_model=List[TranslationContributionResponse])
def export_verified_data(session=Depends(get_session)):
    """
    4. Export all verified data for further training or fine-tuning.
    """
    statement = select(TranslationContribution).where(TranslationContribution.is_verified == True)
    verified_data = session.exec(statement).all()
    
    return verified_data
