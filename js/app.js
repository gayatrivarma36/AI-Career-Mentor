document.addEventListener('DOMContentLoaded', () => {
  const state = {
    resumeScore: 82,
    roadmapCount: 1,
    skillGapCount: 1,
    courseCount: 1,
  };

  const scoreEl = document.getElementById('resume-score');
  const roadmapCountEl = document.getElementById('roadmap-count');
  const skillGapCountEl = document.getElementById('skill-gap-count');
  const courseCountEl = document.getElementById('course-count');

  const updateStats = () => {
    if (scoreEl) scoreEl.textContent = `${state.resumeScore}/100`;
    if (roadmapCountEl) roadmapCountEl.textContent = state.roadmapCount;
    if (skillGapCountEl) skillGapCountEl.textContent = state.skillGapCount;
    if (courseCountEl) courseCountEl.textContent = state.courseCount;
  };

  updateStats();

  async function callAPI(endpoint, body, outputId) {
    const output = document.getElementById(outputId);
    if (output) output.innerText = 'Generating...';

    try {
      const res = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (output) output.innerText = data.result || data.error || 'No response';
    } catch (err) {
      if (output) output.innerText = 'Connection error. Make sure the backend is running.';
    }
  }

  window.getRoadmap = () => {
    state.roadmapCount += 1;
    updateStats();
    callAPI('roadmap', {
      skills: document.getElementById('skills').value || 'Python, SQL',
      interest: document.getElementById('interest').value || 'AI',
      target: document.getElementById('target').value || 'AI Engineer',
    }, 'roadmap-output');
  };

  window.getSkillGap = () => {
    state.skillGapCount += 1;
    updateStats();
    callAPI('skill-gap', {
      current_skills: document.getElementById('current_skills').value || 'Python, HTML',
      target_role: document.getElementById('skill_target').value || 'AI Engineer',
    }, 'skillgap-output');
  };

  window.getInterview = () => {
    callAPI('interview-questions', {
      role: document.getElementById('interview_role').value || 'AI Engineer',
    }, 'interview-output');
  };

  window.getResume = () => {
    callAPI('resume-feedback', {
      resume_text: document.getElementById('resume_text').value || 'Sample resume text',
      target_role: document.getElementById('resume_target').value || 'AI Engineer',
    }, 'resume-output');
  };

  window.getCourses = () => {
    state.courseCount += 1;
    updateStats();
    callAPI('courses', {
      skill: document.getElementById('course_skill').value || 'Machine Learning',
    }, 'courses-output');
  };
});
