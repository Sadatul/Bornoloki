from app.models.analytics import Analytics
from sqlmodel import Session, select
from datetime import datetime, timezone
from typing import Optional

async def track_translation(
    session: Session,
    user_id: int,
    word_count: int,
    translation_type: str
):
    """Track translation analytics"""
    try:
        # Create new analytics entry
        analytics = Analytics(
            user_id=user_id,
            words_translated=word_count,
            translation_type=translation_type
        )
        session.add(analytics)
        session.commit()
    except Exception as e:
        print(f"Error tracking analytics: {str(e)}") 