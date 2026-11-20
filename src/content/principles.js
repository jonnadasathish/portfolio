export const principles = [
  {
    title: 'Understand before changing',
    body: 'In a legacy system the current behaviour is the specification. I trace a feature end to end (request, rules, queries and side effects) before moving any of it.',
  },
  {
    title: 'One boundary for the rules',
    body: 'Identity, authorization and validation belong in one layer that every client passes through: the browser, the assistant and external agents alike.',
  },
  {
    title: 'Measure, don’t assume',
    body: 'Regression suites for APIs, golden sets for LLM features. A change ships when the numbers say it is safe, not when it looks right.',
  },
  {
    title: 'Models propose, systems decide',
    body: 'AI can read and suggest. Writes need a human confirmation, and identity always comes from a signed token, never from the model’s output.',
  },
  {
    title: 'Generate what would drift',
    body: 'One route registry drives the API, its documentation and 300+ AI tools. Two hand-maintained lists always end up disagreeing.',
  },
  {
    title: 'Fail loudly, report honestly',
    body: 'Fail-fast timeouts, explicit errors for retired endpoints, and “outcome unknown” instead of a false “failed” when a write times out.',
  },
]

export const learning = [
  {
    title: 'Python & FastAPI',
    body: 'Layered services with Pydantic v2 and SQLAlchemy 2.0, dependency-injected JWT auth and role-based access control in personal projects.',
  },
  {
    title: 'Data structures & algorithms',
    body: 'Regular problem-solving practice in Python.',
  },
  {
    title: 'System design',
    body: 'Caching, rate limiting, idempotency and multi-tenant isolation. I study them and apply them where my work needs them.',
  },
  {
    title: 'AI agents & evaluation',
    body: 'Tool-calling agents, routing, guardrails and how to measure them before they reach users.',
  },
  {
    title: 'MCP ecosystem',
    body: 'Following the specification and the official Python SDK, mapping the patterns from my PHP server to Python.',
  },
  {
    title: 'Distributed systems',
    body: 'Consistency, queues and failure modes. Currently reading and experimenting.',
  },
]
