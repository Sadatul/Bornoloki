import openai
from app.config import settings
from app.schemas.translation import BanglishToBanglaResponse

# Initialize OpenAI with the key from settings
openai.api_key = settings.openai_api_key

async def banglish_to_bangla(banglish_text: str, temperature: float = 0.3) -> str:
    """
    Convert Banglish text to Bangla using OpenAI's GPT model
    
    Args:
        banglish_text (str): The Banglish text to convert
        temperature (float, optional): The temperature for GPT response. Defaults to 0.3
        
    Returns:
        str: The converted Bangla text
    """
    if not banglish_text.strip():
        return ""

    system_prompt = (
        "You accurately convert Banglish (Bengali words written with the Latin alphabet) "
        "to proper Bengali script. Output only the converted text in Bengali. No extra commentary."
    )

    user_prompt = f"Banglish input: {banglish_text}\nPlease provide the exact Bengali script equivalent:\n"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # or another appropriate model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=200,
        )
        return response.choices[0].message["content"].strip()

    except Exception as e:
        # Log the error if you have logging set up
        print(f"Error in banglish_to_bangla conversion: {str(e)}")
        return banglish_text  # Return original text if conversion fails 