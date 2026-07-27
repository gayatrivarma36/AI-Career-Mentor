import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

try:
    from google import genai
except Exception:  # pragma: no cover - package may be unavailable in some environments
    genai = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

app = Flask(__name__, template_folder=os.path.join(BASE_DIR, '..'))
CORS(app)

api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')
client = None
if genai is not None and api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception:
        client = None


def generate_local_response(prompt):
    lower_prompt = prompt.lower()

    if 'roadmap' in lower_prompt or 'skills analysis' in lower_prompt:
        return (
            "Roadmap Overview\n"
            "================\n"
            "\n"
            "Phase 1: Build Foundations\n"
            "- Strengthen core fundamentals in your target domain.\n"
            "- Practice concepts daily through small coding or case-study exercises.\n"
            "\n"
            "Phase 2: Create Portfolio Projects\n"
            "- Build one polished project every 2 weeks.\n"
            "- Document your process, results, and impact clearly.\n"
            "\n"
            "Phase 3: Grow and Track Progress\n"
            "- Learn one relevant tool or technology each month.\n"
            "- Review your progress regularly and refine your plan."
        )

    if 'missing skills' in lower_prompt or 'skills gap' in lower_prompt or 'target role' in lower_prompt and 'resume' not in lower_prompt:
        return (
            "Skill Gap Analysis\n"
            "=================\n"
            "\n"
            "- Strengthen the core skills most relevant to the target role.\n"
            "- Practice hands-on projects and build visible portfolio work.\n"
            "- Learn the most common tools and frameworks used in that domain."
        )

    if 'interview' in lower_prompt or 'hr questions' in lower_prompt:
        return (
            "Interview Preparation\n"
            "====================\n"
            "\n"
            "- HR: Tell me about yourself and your biggest strengths.\n"
            "- Technical: Explain your project architecture and key decisions clearly.\n"
            "- Coding: Solve a simple problem and explain your thinking step by step."
        )

    if 'resume' in lower_prompt or 'ats' in lower_prompt:
        return (
            "Resume Feedback\n"
            "===============\n"
            "\n"
            "- Add measurable achievements and business impact.\n"
            "- Match important keywords to the target role.\n"
            "- Improve formatting and structure for ATS readability."
        )

    if 'course' in lower_prompt or 'youtube' in lower_prompt:
        return (
            "Course Recommendations\n"
            "=====================\n"
            "\n"
            "- Free course: CS50, Google Digital Skills, or Microsoft Learn.\n"
            "- YouTube: freeCodeCamp, Programming with Mosh, or The Net Ninja.\n"
            "- Certification: Google, Microsoft, or AWS beginner tracks."
        )

    return (
        "Fallback career guidance:\n"
        "- Build one portfolio project.\n"
        "- Study one core skill at a time.\n"
        "- Create a simple 3-month learning plan."
    )


def generate_response(prompt):
    if client is None:
        return generate_local_response(prompt)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        text = getattr(response, 'text', None)
        if text:
            return text
    except Exception:
        pass

    return generate_local_response(prompt)


def get_json_body():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ValueError('Request body must be a JSON object.')
    return data


@app.route('/')
def home():
    return render_template('dashboard.html')


@app.route('/roadmap', methods=['POST'])
def roadmap():
    try:
        data = get_json_body()
        missing = [field for field in ['skills', 'interest', 'target'] if not data.get(field)]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

        prompt = f"""
You are an AI Career Mentor.
User Skills: {data['skills']}
Interest: {data['interest']}
Target Career: {data['target']}

Create a structured response with:
1. Skills Analysis
2. Missing Skills
3. Learning Roadmap (5 steps)
4. Projects (3 ideas)
5. Certifications (2 ideas)
6. Timeline (in months)
"""
        return jsonify({'result': generate_response(prompt)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/skill-gap', methods=['POST'])
def skill_gap():
    try:
        data = get_json_body()
        missing = [field for field in ['current_skills', 'target_role'] if not data.get(field)]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

        prompt = f"""
Current Skills: {data['current_skills']}
Target Role: {data['target_role']}

List the missing skills required for this role. Also include recommended free resources.
"""
        return jsonify({'result': generate_response(prompt)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/interview-questions', methods=['POST'])
def interview():
    try:
        data = get_json_body()
        if not data.get('role'):
            return jsonify({'error': 'Missing field: role'}), 400

        prompt = f"""
Generate 5 HR Questions, 5 Technical Questions, and 3 coding questions for the role: {data['role']}.
Include short sample answers.
"""
        return jsonify({'result': generate_response(prompt)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/resume-feedback', methods=['POST'])
def resume():
    try:
        data = get_json_body()
        missing = [field for field in ['resume_text', 'target_role'] if not data.get(field)]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

        prompt = f"""
Resume Text: {data['resume_text']}
Target Role: {data['target_role']}

Give:
1. Missing Keywords
2. Weak Sections
3. ATS Score Improvement Tips
"""
        return jsonify({'result': generate_response(prompt)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/courses', methods=['POST'])
def courses():
    try:
        data = get_json_body()
        if not data.get('skill'):
            return jsonify({'error': 'Missing field: skill'}), 400

        prompt = f"""
Suggest 2 free courses, 2 YouTube channels, 2 certifications, and 2 learning websites for learning: {data['skill']}.
"""
        return jsonify({'result': generate_response(prompt)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=int(os.getenv('PORT', 5000)))