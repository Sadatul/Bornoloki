from langchain_openai import ChatOpenAI
from app.config import settings

# Initialize the ChatOpenAI model
chat_model = ChatOpenAI(
    model="gpt-4o",
    openai_api_key=settings.openai_api_key,
    temperature=0.3
)

async def banglish_to_bangla(banglish_text: str, temperature: float = 0.3) -> str:
    """
    Convert Banglish text to Bangla using OpenAI's GPT model via Langchain
    
    Args:
        banglish_text (str): The Banglish text to convert
        temperature (float, optional): The temperature for GPT response. Defaults to 0.3
        
    Returns:
        str: The converted Bangla text
    """
    if not banglish_text.strip():
        return ""

    # Update the model's temperature if different from default
    chat_model.temperature = temperature

    system_prompt = (
        "You accurately convert Banglish (Bengali words written with the Latin alphabet) "
        "to proper Bengali script. Output only the converted text in Bengali. No extra commentary."
    )

    try:
        # Create messages for the chat
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Banglish input: {banglish_text}\nPlease provide the exact Bengali script equivalent:\n"}
        ]

        # Get response from the model
        response = await chat_model.ainvoke(messages)
        return response.content.strip()

    except Exception as e:
        # Log the error if you have logging set up
        print(f"Error in banglish_to_bangla conversion: {str(e)}")
        return banglish_text  # Return original text if conversion fails 