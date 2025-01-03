from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from app.schemas.document import DocumentCreate, DocumentRead
from app.models.document import Document
from app.middleware.auth_middleware import verify_auth, require_roles
from app.database import get_session
from sqlmodel import Session, select
from app.utils.translate import banglish_to_bangla
from langchain.docstore.document import Document as LangchainDocument
from app.utils.embeddings import DocumentSearch

router = APIRouter(
    prefix="/document",
    tags=["document"]
)

@router.post("/", response_model=DocumentRead)
@require_roles(["user", "admin"])
async def create_document(
    document: DocumentCreate,
    payload: dict = Depends(verify_auth),
    session: Session = Depends(get_session),
    doc_search : DocumentSearch = Depends()
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

        await doc_search.add_document(db_document)

        return db_document

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create document: {str(e)}"
        ) 

@router.get("/search")
async def search_documents(
    query: str,
    is_bangla: bool = Query(False, description="Collection to search in: 'original_texts' or 'converted_texts'", alias="is-bangla"),
    limit: int = Query(5, description="Number of results to return"),
    payload: dict = Depends(verify_auth),
    doc_search : DocumentSearch = Depends()
):
    try:
        user_metadata = payload.get("user_metadata", {})
        user_id = user_metadata.get("id")
        # Perform similarity search with scores
        search_results = await doc_search.search(query, is_bangla, limit,
                                                 {"user_id" : user_id}
                                                     
                                            )
        print(search_results)
        # Format and sort results by score (higher score = more similar)
        results = []
        for doc, score in search_results:
            results.append({
                "score": float(score),  # Convert numpy float to Python float
                "document": {
                    "id": doc.metadata["doc_id"],
                    "user_id": doc.metadata["user_id"],
                    "title": doc.metadata["title"],
                    "is_public": doc.metadata["is_public"]
                }
            })

        # Sort by score in descending order (highest similarity first)
        results.sort(key=lambda x: x["score"], reverse=True)

        return {
            "query": query,
            "is_bangla": is_bangla,
            "results": results
        }

    except Exception as e:
        print(f"Search error: {str(e)}")  # For debugging
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        ) 

@router.get("/{document_id}", response_model=DocumentRead)
async def get_document(
    document_id: int,
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

        # Get document from database
        document = session.get(Document, document_id)
        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        # Check if user is owner or document is public
        if document.user_id != user_id and not document.is_public:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to access this document"
            )

        return document

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch document: {str(e)}"
        ) 

@router.get("/user/{user_id}/public", response_model=list[DocumentRead])
async def get_user_public_documents(
    user_id: int,
    session: Session = Depends(get_session),
    skip: int = Query(0, description="Number of documents to skip"),
    limit: int = Query(10, description="Number of documents to return")
):
    try:
        # Query for public documents of the specified user
        statement = (
            select(Document)
            .where(Document.user_id == user_id)
            .where(Document.is_public == True)
            .offset(skip)
            .limit(limit)
            .order_by(Document.upload_date.desc())
        )
        
        documents = session.exec(statement).all()
        return documents

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch documents: {str(e)}"
        ) 

@router.get("/my/all", response_model=list[DocumentRead])
@require_roles(["user", "admin"])
async def get_my_documents(
    payload: dict = Depends(verify_auth),
    session: Session = Depends(get_session),
    skip: int = Query(0, description="Number of documents to skip"),
    limit: int = Query(10, description="Number of documents to return"),
    sort_by: str = Query("upload_date", description="Sort by field: upload_date or title"),
    order: str = Query("desc", description="Sort order: asc or desc")
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

        # Build the query
        statement = select(Document).where(Document.user_id == user_id)

        # Add sorting
        if sort_by == "title":
            order_by = Document.title.desc() if order == "desc" else Document.title.asc()
        else:  # default to upload_date
            order_by = Document.upload_date.desc() if order == "desc" else Document.upload_date.asc()

        statement = statement.order_by(order_by).offset(skip).limit(limit)
        
        # Execute query
        documents = session.exec(statement).all()
        return documents

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch documents: {str(e)}"
        ) 