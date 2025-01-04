from app.config import settings
from langchain_openai import ChatOpenAI
from app.utils.embeddings import qdrant_client, embeddings_model
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_qdrant import QdrantVectorStore
from fastapi import HTTPException
from app.utils.embeddings import DocumentSearch

class BanglaChatbot:
    def __init__(self):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-4",
            openai_api_key=settings.openai_api_key
        )
        self.qdrant_client = qdrant_client
        self.embeddings = embeddings_model

        self.prompt_template = PromptTemplate(
            input_variables=["history", "input"],
            template="""You are a helpful assistant that can understand and respond in both Bangla and Banglish.
            Always respond in Bangla.If you're not sure about something, say so in Bangla.

            Previous conversation history:
            {history}

            Human: {input}
            Assistant:"""
        )

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
        
        # Dictionary to store user-specific conversation memories
        self.user_memories = {}
    def get_user_conversation(self, user_id: str):
        """Get or create a conversation chain for a specific user"""
        if user_id not in self.user_memories:
            memory = ConversationBufferMemory(
                input_key="input",
                output_key="response",
                return_messages=True
            )
            conversation = ConversationChain(
                llm=self.llm,
                memory=memory,
                prompt=self.prompt_template,
                verbose=True
            )
            self.user_memories[user_id] = conversation
        return self.user_memories[user_id]
    
    async def process_query(self, query: str, is_bangla: bool, user_id: str) -> tuple[str, bool]:
        """Process user query and return response with context information"""
        try:
            # Search for relevant documents
            vectorstore : QdrantVectorStore = self.bangla_vectorstore if is_bangla else self.banglish_vectorstore
            
            similar_docs = vectorstore.similarity_search(query, k=3)
            context_used = len(similar_docs) > 0
            
            # Add relevant context to the conversation
            context = "\n".join([doc.page_content for doc in similar_docs])
            
            # Prepare input with context
            enhanced_input = f"""Context from similar documents:
            {context}
            
            User query: {query}"""
            
            # Get user-specific conversation chain
            conversation = self.get_user_conversation(user_id)
            
            # Get response
            response = conversation.predict(input=enhanced_input)
            
            return response, context_used
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
chatbot = BanglaChatbot()
