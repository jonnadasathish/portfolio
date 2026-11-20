// Scale figures are rounded on purpose (confidentiality). Assistant figures are my own evaluation results.
export const impact = [
  {
    value: '350+',
    label: 'REST endpoints',
    detail: 'Server logic from 500+ legacy pages moved behind one versioned API across 15 business modules.',
  },
  {
    value: '300+',
    label: 'AI tools over MCP',
    detail: 'Generated from the API’s route registry, so AI agents inherit the app’s permissions instead of bypassing them.',
  },
  {
    value: '94.6%',
    label: 'Task success',
    detail: 'Up from 80.4% after adding a domain-based intent router (56-case benchmark), with 37% fewer input tokens on routed reads.',
  },
  {
    value: '0',
    label: 'Wrong writes',
    detail: 'Across 100+ adversarial test cases on two LLM providers, because every change needs the user’s confirmation.',
  },
  {
    value: '150+',
    label: 'Defects resolved',
    detail: 'Including multi-tenant data-isolation and input-validation hardening during the migration.',
  },
]

export const impactNote =
  'Assistant figures come from my evaluation runs during development. Scale figures are rounded.'
