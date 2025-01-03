from fastapi import APIRouter, Depends, HTTPException
from app.schemas.document import DocumentCreate, DocumentRead
from app.models.document import Document
from app.middleware.auth_middleware import verify_auth, require_roles
from app.database import get_session
from sqlmodel import Session
from app.utils.translate import banglish_to_bangla

router = APIRouter(
    prefix="/document",
    tags=["document"]
)

@router.post("/", response_model=DocumentRead)
@require_roles(["user", "admin"])  # Only authenticated users can create documents
async def create_document(
    document: DocumentCreate,
    payload: dict = Depends(verify_auth),
    session: Session = Depends(get_session)
):
    try:
        # Get user_id from token metadata
        user_metadata = payload.get("user_metadata", {})
        user_id = user_metadata.get("id")
        
        if not user_id:
            raise HTTPException(
                status_code=400,
                detail="User ID not found in token metadata"
            )

        # Convert banglish to bangla
        converted_text = await banglish_to_bangla(document.original_text)

        # Create new document
        db_document = Document(
            user_id=user_id,
            title=document.title,
            original_text=document.original_text,
            converted_text=converted_text,
            formatting=document.formatting,
            is_public=document.is_public
        )

        session.add(db_document)
        session.commit()
        session.refresh(db_document)

        return db_document

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create document: {str(e)}"
        ) 