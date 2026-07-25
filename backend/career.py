import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_roadmap(skills, interest, career):

    prompt = f"""
You are an AI Career Mentor.

Current Skills:
{skills}

Interest:
{interest}

Target Career:
{career}

Create a career roadmap.

Include:

1. Current Skills Analysis
2. Missing Skills
3. Learning Roadmap
4. Projects
5. Certifications
6. Timeline

Format the response neatly.
"""

    response = model.generate_content(prompt)

    return response.text


if __name__ == "__main__":
    result = generate_roadmap(
        "Python, HTML, CSS",
        "Artificial Intelligence",
        "AI Engineer"
    )
    print(result)