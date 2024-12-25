from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from openai import OpenAI
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")


origins = [
    "http://localhost:3000",
]
# Initialize the OpenAI client
client = OpenAI(
    api_key= openai_api_key
)

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prompt = """
You are a career counselor assisting users with career advice. Your responses should be formatted in HTML for rendering in a web application. The advice you provide should be clear, structured, and easy to understand, with proper use of headings, bullet points, and emphasis where needed. Ensure that the following guidelines are followed:

1. **HTML Structure**: 
   - All responses must be formatted using HTML tags for proper structure.
   - Headings should be in bold and black, with appropriate levels (e.g., `<h1>`, `<h2>`, `<h3>` etc.) for clear organization.
   - Each new paragraph should be placed on a new line using `<br/>` tags for spacing.
   - Ensure **consistent spacing** between sections and content for readability.
   - Do not add line space gaps between headings and their details; they should be visually connected.
   - `<strong>` tags should have black text for emphasis.

2. **Content Guidelines**:
   - Ensure that the content is **not congested**. Use proper spacing between paragraphs and sections to make the advice easy to read and digest.
   - Use **anchor tags** for links (e.g., `<a href="URL" target="_blank">Link Text</a>`), ensuring they are properly styled as links. 
   - Avoid adding scripts or unsafe content; the content should be safe for rendering using methods like `dangerouslySetInnerHTML` in React.

3. **Clarity and Readability**:
   - Provide well-organized career advice with bullet points for easy reading.
   - Use clear and concise language, and highlight important points with **bold** or *italic* formatting as needed.
   - Maintain a balance of content: avoid large blocks of text by using proper breaks and separations.
   - Ensure that important ideas or concepts are well-spaced and highlighted, making them easier to scan visually.

The goal is to provide well-structured, safe, and readable career advice that helps users plan their professional journey effectively.


"""


# Define the request body model
class ChatRequest(BaseModel):
    message: str
@app.post('/chat')
async def chat(request: ChatRequest):
    async def stream_response():
        try:
            # Start the OpenAI stream
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content":prompt},
                    {"role": "user", "content": request.message},
                ],
                stream=True,  # Enable streaming
            )
            # Iterate through the OpenAI stream and yield chunks
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:  # If there's content in the chunk
                    yield f"{delta}\n\n"
        except Exception as e:
            yield f"data: {{'error': '{str(e)}'}}\n\n"
    
    # Return the generator as a StreamingResponse
    return StreamingResponse(stream_response(), media_type="text/event-stream")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
