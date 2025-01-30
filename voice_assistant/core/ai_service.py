import openai

openai.api_key = "your_openai_api_key"

def get_ai_response(question):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=question,
            max_tokens=100,
            temperature=0.7,
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return "I'm sorry, I couldn't process your request."
