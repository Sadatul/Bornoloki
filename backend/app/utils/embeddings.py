from langchain_openai import OpenAIEmbeddings
from qdrant_client import QdrantClient
from qdrant_client.http import models
from langchain_qdrant import QdrantVectorStore
from app.config import settings
from langchain.schema import Document as LangchainDocument
from app.models.document import Document

# Initialize OpenAI embeddings
embeddings_model = OpenAIEmbeddings(
    openai_api_key=settings.openai_api_key,
    model="text-embedding-3-small"
)

qdrant_client = QdrantClient(
        url="localhost",  # Using local Qdrant instance
        port=6333
    )

# Create collections if they don't exist
def init_collections():
    """Initialize Qdrant collections for document embeddings"""

    try:

        # Collection for original (Banglish) texts
        qdrant_client.create_collection(
            collection_name="bangla_docs",
            vectors_config=models.VectorParams(
                size=1536,  # OpenAI embeddings dimension
                distance=models.Distance.COSINE
            )
        )
        
        # Collection for converted (Bangla) texts
        qdrant_client.create_collection(
            collection_name="banglish_docs",
            vectors_config=models.VectorParams(
                size=1536,  # OpenAI embeddings dimension
                distance=models.Distance.COSINE
            )
        )
    except Exception as e:
        # Collections might already exist
        print(f"Collection initialization note: {str(e)}")

class DocumentSearch:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",  # Cheaper and good enough for most use cases
            openai_api_key=settings.openai_api_key
        )
        
        # Initialize Qdrant clients for both languages
        self.bangla_vectorstore = QdrantVectorStore(
            client=qdrant_client,
            collection_name="bangla_docs",
            embedding=self.embeddings
        )
        
        self.banglish_vectorstore = QdrantVectorStore(
            client=qdrant_client,
            collection_name="banglish_docs",
            embedding=self.embeddings
        )
    
    async def add_document(self, document: Document):
        """Add a document to both vector stores"""
        # Create Langchain documents
        bangla_doc = LangchainDocument(
            page_content=document.converted_text,
            metadata={
                "doc_id": document.id,
                "title": document.title,
                "user_id": document.user_id,
                "is_public": document.is_public
            }
        )
        
        banglish_doc = LangchainDocument(
            page_content=document.original_text,
            metadata={
                "doc_id": document.id,
                "title": document.title,
                "user_id": document.user_id,
                "is_public": document.is_public
            }
        )
        
        # Add to respective vector stores
        await self.bangla_vectorstore.aadd_documents([bangla_doc])
        await self.banglish_vectorstore.aadd_documents([banglish_doc])
    
    async def search(
        self, 
        query: str, 
        is_bangla: bool, 
        limit: int = 10,
        filter_dict: dict | None = None
    ) -> list[Document]:
        """Search for similar documents"""
        # Choose the appropriate vector store
        vectorstore = self.bangla_vectorstore if is_bangla else self.banglish_vectorstore
        
        # If no filter provided, only show public documents
        # if filter_dict is None:
        #     filter_dict = {"is_public": True}
        print(filter_dict)
        must_conditions = []
        must_conditions.append(models.FieldCondition(
            key="is_public",
            match=models.MatchValue(
                value=False
            )
        ))

        print(models.Filter(must=must_conditions).dict())
        
        # Perform similarity search
        docs = await vectorstore.asimilarity_search_with_score(
            query=query,
            k=limit,
            # filter={
            #     "must" : [
            #         {"key": "is_public", "match": {"value": False}}
            #     ]
            # }
        )
        
        # Return document IDs and scores
        return docs

