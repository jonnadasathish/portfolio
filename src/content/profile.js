// Personal details and site-wide copy. Edit here; components read from this file.
export const profile = {
  name: 'Jonnada Satish',
  initials: 'JS',
  role: 'Software Engineer (Full-Stack)',
  company: 'CarTrade Tech',
  location: 'Kakinada, India',
  email: 'jonnadasathish4444@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jonnadasathish/',
  github: 'https://github.com/jonnadasathish',

  // Put a square photo in /public (e.g. 'satish.jpg', at least 600×600) and set its path here.
  // While empty, the About section shows the initials instead.
  photo: '/photo.jpeg',

  // Put the exported PDF in /public and set this to its path, e.g. '/Jonnada_Satish_Resume.pdf'.
  // While empty, the resume button opens a pre-filled email request instead of a download.
  resumeUrl: '/jsatish_resume.pdf',

  seo: {
    title: 'Jonnada Satish | Full-Stack Software Engineer (Backend & AI Engineering)',
    description:
      'Full-stack software engineer with backend and AI engineering experience: legacy modernization, REST APIs, agentic LLM assistants and Model Context Protocol (MCP) servers.',
  },
}

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'impact', label: 'Impact' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'approach', label: 'Approach' },
]

export function resumeLink() {
  if (profile.resumeUrl) return { href: profile.resumeUrl, download: true, label: 'Download Resume' }
  const subject = encodeURIComponent('Resume request')
  return { href: `mailto:${profile.email}?subject=${subject}`, download: false, label: 'Request Resume' }
}
