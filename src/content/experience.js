export const education = {
  degree: 'B.Tech in Electronics and Communication Engineering',
  college: 'Pragati Engineering College, Surampalem',
  university: 'Jawaharlal Nehru Technological University, Kakinada',
  period: '2020 – 2024',
  grade: '7.71 CGPA',
}

export const experience = {
  company: 'CarTrade Tech',
  role: 'Software Engineer (Full-Stack)',
  period: 'June 2025 – Present',
  location: 'Kakinada, India',
  summary:
    'Backend and full-stack work on the dealer platform used by dealerships to run inventory, leads and marketplace listings, from integrations and production debugging to a full architectural modernization and AI-powered features for dealers.',
  milestones: [
    {
      period: '2025',
      title: 'Platform foundations',
      body: 'Admin panels, reports and marketplace listing integrations. Built a failure report that classifies listing-sync errors, and investigated slow queries and error logs to fix problems at the source.',
    },
    {
      period: 'Early 2026',
      title: 'Marketplace publishing',
      body: 'Backend features for publishing dealer inventory to a partner marketplace: a publishing queue, change detection that skips redundant API calls, and request/response logging.',
    },
    {
      period: 'Mid 2026',
      title: 'AI listing assistant',
      body: 'Photo-based listing flow: an external image-analysis service and registration lookup pre-fill the inventory form for dealers.',
    },
    {
      period: 'Sep – Oct 2026',
      title: 'DMS modernization',
      body: 'Versioned REST API of 350+ endpoints, JWT authentication gateway, per-module authorization, Vue 3 SPA and an OpenAPI portal.',
    },
    {
      period: 'Oct – Nov 2026',
      title: 'AI assistant & MCP server',
      body: 'Independently built an agentic LLM assistant gated by a 400-case evaluation suite, and an MCP server exposing 300+ tools to AI clients.',
    },
  ],
  focus: ['Legacy modernization', 'API architecture', 'Authentication & security', 'AI engineering', 'MCP', 'Production debugging'],
}
