// Project and case-study content. Plain data (no Vue imports) so vite.config.js can read the slugs.
// `diagram` is a key resolved by src/components/diagrams/index.js.
//
// Confidentiality: these are CarTrade Tech projects. The systems and code belong to the company. Content describes
// my own contributions and general engineering patterns only. No source code, internal URLs, schemas, configuration
// values, security findings, partner business rules or unreleased product status. Scale figures are rounded.

export const ownershipNote =
  'Built at CarTrade Tech. The systems and code belong to the company; this page describes my contributions and the engineering approach, with internal details omitted.'

export const projects = [
  {
    slug: 'dms-modernization',
    title: 'Enterprise DMS Modernization',
    eyebrow: 'Legacy modernization · API architecture',
    summary:
      'Re-architected a large legacy dealer management system (500+ server-rendered PHP pages mixing HTML, SQL and business rules) into a Vue 3 application backed by a versioned, token-secured REST API of 350+ endpoints, without changing business behaviour.',
    context: 'Company project at CarTrade Tech',
    role: 'Core engineer on the modernization: designed and built the API gateway and route registry, authentication and authorization, most of the Vue 3 SPA, and the API documentation portal.',
    problem:
      'Every page queried the database, checked permissions, ran business rules and rendered HTML in a single file. Nothing could be reused by a new frontend, a mobile client or an AI agent, and every change risked side effects in unrelated pages.',
    approach:
      'Relocate, don’t rewrite: move each page’s server logic behind one API gateway with a single route registry, keep the business rules intact, and put token authentication and per-module authorization in front. Build the new UI as a Vue 3 SPA and let users switch between old and new screens while modules migrate.',
    stack: ['PHP 8', 'Vue 3', 'Vue Router', 'Axios', 'MySQL', 'Redis', 'JWT', 'OpenAPI'],
    contributions: [
      'Architected a versioned module/operation API contract and the single route registry behind it: 350+ operations across 15 business modules.',
      'Engineered the authentication gateway: short-lived access tokens, single-use rotating refresh tokens tracked in Redis, HttpOnly cookies and server-side revocation on logout.',
      'Bridged token authentication to the legacy session model so relocated business logic runs unchanged.',
      'Ported permission and row-level visibility rules into checks that run before every handler.',
      'Built most of the Vue 3 SPA (50+ routes across inventory, leads, dashboards and settings) with a token-refreshing API client.',
      'Generated an OpenAPI/Swagger portal from the route registry, kept in sync with every endpoint.',
    ],
    challenges: [
      {
        title: 'Business logic hidden in views',
        body: 'Rules lived inside templates and markup as well as controllers. Each page was traced end to end and its behaviour written down before any code moved.',
      },
      {
        title: 'Two UIs, one user base',
        body: 'A version toggle with deep-link mapping let users move between legacy and new screens during the migration, while specific user groups stayed on the existing experience by rule.',
      },
      {
        title: 'Multi-tenant isolation',
        body: 'Turning page logic into a reusable API means every write path must be scoped to the caller. I added ownership checks derived from the verified identity and a regression scenario for each path I hardened.',
      },
    ],
    impact: [
      { value: '350+', label: 'endpoints behind one route registry' },
      { value: '50+', label: 'SPA routes' },
      { value: '200+', label: 'routes and workflows under regression tests' },
    ],
    diagram: 'dms',
    caseStudy: {
      overview:
        'The dealer platform had grown for years as server-rendered PHP. It worked, but its logic was locked inside pages. The goal was a decoupled architecture, an API any client can use and a modern frontend, with zero loss of existing business behaviour.',
      situation: [
        'Hundreds of page scripts, each combining markup, SQL, session state, permission checks and business rules.',
        'Authorization was spread across views instead of enforced at one boundary.',
        'Authentication and its special cases lived in one long controller with redirects as the only output.',
      ],
      solution: [
        'A single gateway receives versioned module/operation requests, validates the path, resolves the operation from a route registry, authenticates the caller, applies module rights and dispatches to the handler.',
        'Handlers are the legacy controller logic, relocated without behavioural changes. A resolver turns a verified token into the context that logic expects, so every rule keeps working as before.',
        'The Vue 3 SPA consumes only the API. A version toggle maps legacy URLs to their new equivalents so the rollout can proceed module by module.',
      ],
      decisions: [
        {
          decision: 'Relocate legacy logic instead of rewriting it',
          why: 'A rewrite risks silently changing business rules. Relocation keeps behaviour identical and makes page-by-page verification possible.',
        },
        {
          decision: 'One route registry instead of an “action” field in the body',
          why: 'A single list to document, test and generate from. The API documentation and the AI tool catalog are both derived from it.',
        },
        {
          decision: 'Access token in memory, refresh token in an HttpOnly cookie',
          why: 'Scripts cannot read the long-lived credential, and the short-lived one disappears with the tab.',
        },
        {
          decision: 'Single-use refresh tokens tracked server-side',
          why: 'A leaked refresh token works at most once, and logout can revoke a session immediately.',
        },
        {
          decision: 'No new build pipeline inside the legacy app',
          why: 'The app already served Vue 3; native ES modules with an import map avoided adding build infrastructure to an existing deployment.',
        },
      ],
      implementation: [
        'A uniform JSON response envelope, with machine-readable reasons for authentication failures.',
        'Retired endpoints fail explicitly, so stale clients surface quickly instead of reaching old code paths.',
        'The SPA client retries once after a silent token refresh and collapses concurrent refreshes into a single request.',
        'Characterization tests call every read route and replay multi-step write workflows against a seeded test account.',
      ],
      tradeoffs: [
        'Relocated code keeps its original procedural style. The win is the boundary, not the internals; a service layer is the natural next step.',
        'Running two UIs in parallel adds routing work, but it made the migration reversible at every step.',
      ],
      results: [
        'One documented API surface shared by the web app, the AI assistant and external AI agents.',
        'Permission rules enforced at one boundary instead of inside hundreds of views.',
        '150+ defects resolved during the migration, including multi-tenant data-isolation hardening.',
      ],
      learned: [
        'In legacy systems the specification is the current behaviour. Document it before moving it.',
        'A clean boundary is worth more than clean internals at the start of a migration.',
        'Test multi-tenant code with at least two tenants, always.',
      ],
    },
  },

  {
    slug: 'ai-dealer-assistant',
    title: 'AI-Powered Dealer Assistant',
    eyebrow: 'Agentic AI · LLM tool calling · AI safety',
    summary:
      'An in-app assistant that lets dealers query and update inventory and leads in English, Hindi or Hinglish. It works through the same authorized API as the app, and every change is previewed and confirmed by the user.',
    context: 'Company project at CarTrade Tech',
    role: 'Sole engineer, end to end: architecture, backend, LLM provider integrations, security, the chat UI and the evaluation suite.',
    problem:
      'Users click through many screens to answer simple questions or make small changes. An assistant had to follow the same business rules as the app, never touch another account’s data, and never change anything the user did not ask for.',
    approach:
      'A tool-calling LLM loop whose tools come from the MCP server, so every read and write goes through the same authorized API as the UI. A router narrows the tools to one business domain per turn; write tools only return a preview card that the user must confirm.',
    stack: ['PHP 8', 'Gemini API', 'OpenAI API', 'Function calling', 'JSON-RPC (MCP)', 'Redis', 'MongoDB', 'Vue 3'],
    contributions: [
      'Independently architected and implemented the agentic workflow: a bounded tool-calling loop over the Gemini and OpenAI REST APIs with model fallback, backoff and automatic cross-provider failover.',
      'Designed domain-based intent routing (rules, then a small-model classifier, then a clarifying question) that gives the model only the tools of one business domain per turn.',
      'Engineered secure AI-driven operations: server-held single-use confirmation tokens bound to the user’s session, a grounding check against invented values, undo actions and honest handling of uncertain outcomes.',
      'Integrated the assistant with the MCP server over JSON-RPC, discovering tools live so new capabilities need no code change, and added cost controls with daily token budgets reserved atomically in Redis.',
      'Developed multilingual support for English, Hindi and Hinglish, and the Vue chat UI with confirm, download and undo cards.',
      'Built a 400-case evaluation suite (routing, tool choice, answer accuracy, wrong writes, latency) used as the release gate.',
    ],
    challenges: [
      {
        title: 'Too many tools, too many tokens',
        body: 'Offering every tool on every turn inflated prompts and confused tool choice. Routing to a domain first cut input tokens by 37% and raised task success from 80.4% to 94.6% on the benchmark.',
      },
      {
        title: 'The model must never write on its own',
        body: 'The model can only request a preview. The confirmation token is held server-side and released only by the user’s click. The model never sees it.',
      },
      {
        title: 'Prompt injection through data',
        body: 'Tool results are masked for personal data, size-capped and framed as data rather than instructions. Identity always comes from the signed token, never from model arguments.',
      },
    ],
    impact: [
      { value: '94.6%', label: 'task success after routing (from 80.4%)' },
      { value: '−37%', label: 'input tokens on routed reads' },
      { value: '0', label: 'wrong writes in 100+ adversarial cases' },
      { value: '95%', label: 'success on the 400-case release gate' },
    ],
    diagram: 'chat',
    caseStudy: {
      overview:
        'The assistant turns natural-language requests into calls against the business platform. The engineering work was less about the chat window and more about making an LLM dependable: picking the right tool, staying within budget and never changing data by mistake.',
      situation: [
        'The new versioned API and the MCP server already exposed the platform’s operations as typed tools; the assistant needed to use them without bypassing permissions.',
        'Users write in English, Hindi and Hinglish, often in short, ambiguous follow-ups.',
        'Any write had to be safe against model mistakes, prompt injection and accidental bulk changes.',
      ],
      solution: [
        'Each message passes request checks (authentication, rate limiting and a daily token budget) before the router picks a domain using rules, a small classification model only when the rules are unsure, or a clarifying question.',
        'A bounded agent loop runs within a hard deadline. Each tool call goes to the MCP server over JSON-RPC with a short-lived signed token carrying the user’s identity.',
        'Replies render as text, confirmation cards for changes, download cards that fetch files directly from the API, and undo cards for reversible actions.',
      ],
      decisions: [
        {
          decision: 'Two LLM providers behind one interface',
          why: 'Direct control over timeouts, retries and failover inside a request with a hard deadline, with both providers normalized to one tool-call format.',
        },
        {
          decision: 'One agent plus a router, not multiple agents',
          why: 'Separate sub-agent hops add latency and cost. A router delivers most of the benefit with a single model loop.',
        },
        {
          decision: 'Tools discovered live from the MCP server',
          why: 'Enabling a tool in the catalog makes it available to the assistant with no code change.',
        },
        {
          decision: '“Outcome unknown” instead of “failed”',
          why: 'If a confirmed change times out after it was sent, the assistant says it may have been applied. It never reports a false failure.',
        },
        {
          decision: 'Reserve token budget before each model call',
          why: 'Atomic reservations, settled after the call, stop concurrent requests from overshooting a daily budget.',
        },
      ],
      implementation: [
        'Per-user rate limiting, a bounded number of agent steps, and a final step forced to answer without tools.',
        'Conversation history and sessions in MongoDB with automatic expiry; short-lived session memory and confirmation cards in Redis.',
        'Write grounding: a change card is only created when its key values come from the user’s own recent messages.',
        'One change per message and a daily cap on confirmed writes per user.',
        'Evaluation modes for mocked, real-provider, write-check and router comparisons, including an adversarial set.',
      ],
      tradeoffs: [
        'The router sits behind a switch that falls back to a simpler flat tool profile, trading some accuracy for a safe fallback.',
        'Provider choice is driven by the evaluation set: the stronger provider on the same golden cases stays primary.',
      ],
      results: [
        'Task success rose from 80.4% to 94.6% on the routed benchmark, with p95 latency roughly halved.',
        'Zero wrong writes across the adversarial set on both providers.',
        'A release gate that can be rerun before every change to prompts, tools or models.',
      ],
      learned: [
        'Evaluation sets are product requirements; the golden set decided every prompt change.',
        'Safety belongs in the system, not the prompt: confirmation and identity are enforced in code.',
        'Narrowing the choices helps a model more than longer instructions do.',
      ],
    },
  },

  {
    slug: 'mcp-server',
    title: 'Model Context Protocol Server',
    eyebrow: 'MCP · JSON-RPC 2.0 · AI integration',
    summary:
      'A standards-based gateway that exposes the platform’s API as 300+ typed tools to an in-app assistant and to external AI agents such as Claude Code and Cursor.',
    context: 'Company project at CarTrade Tech',
    role: 'Sole engineer, end to end: protocol implementation, tool generation, authentication and authorization, rate limiting, deployment and testing.',
    problem:
      'Without a standard interface, each AI integration needs its own glue code, its own copy of business rules and its own permission checks. External agents also need a way to discover what the platform can do and call it safely.',
    approach:
      'Implement MCP (JSON-RPC 2.0 over HTTP) as a thin, stateless adapter over the existing API. Generate tools from the route registry, keep permissions in the API, and add what AI traffic needs: a switchable catalog, two-phase writes, rate limits and audit logs.',
    stack: ['PHP 8.4', 'OpenSwoole', 'JSON-RPC 2.0', 'MCP', 'MongoDB', 'Redis', 'JWT', 'Docker'],
    contributions: [
      'Independently designed and implemented the MCP server without an SDK: JSON-RPC 2.0 over HTTP, initialize with version negotiation, tools/list for discovery with JSON Schemas and safety annotations, and tools/call for execution with structured results.',
      'Engineered dynamic tool generation: the API route registry becomes 300+ typed tools with input schemas and risk classes, with a check that fails on drift.',
      'Built a database-backed tool catalog and an audited admin panel that switches tools on or off at runtime.',
      'Built two-phase writes: a preview, then a single-use confirmation token bound to the tool, arguments and caller, with idempotent replay.',
      'Engineered atomic Redis admission control: per-account quotas, self-expiring concurrency slots and a separate write budget.',
      'Built authentication and authorization for the assistant and external AI clients (JWT and RFC 7662 token introspection), least-privilege tokens for upstream API calls, and audit logs with personal data masked.',
    ],
    challenges: [
      {
        title: 'Keeping 300+ tools in sync',
        body: 'Hand-written tools drift. Tools are generated from the same route registry as the API, with a hand-edited classification layer and a check that fails when they diverge.',
      },
      {
        title: 'Concurrency slots that never leak',
        body: 'Slots are leases that expire on their own, so a crashed worker cannot hold capacity forever.',
      },
      {
        title: 'Least privilege',
        body: 'The server signs its own short-lived token for each API call instead of holding the application’s primary signing key, and strips identity fields from tool arguments.',
      },
    ],
    impact: [
      { value: '300+', label: 'tools generated from the API' },
      { value: 'Runtime', label: 'tool switches, no redeploy' },
      { value: '0', label: 'cross-account exposures found in QA' },
    ],
    diagram: 'mcp',
    caseStudy: {
      overview:
        'MCP gives AI clients a standard way to discover and call tools. This server makes the platform MCP-compatible while keeping every business rule and permission inside the existing API.',
      situation: [
        'My first version was an in-app integration with hand-written tools. It worked, but it duplicated business rules and could not keep up with hundreds of operations.',
        'The new versioned API already described every operation in one route registry, a natural source for tool definitions.',
        'Two very different callers needed support: the in-app assistant and external AI clients such as Claude Code, Cursor and MCP Inspector, acting for a signed-in user.',
      ],
      solution: [
        'A long-running OpenSwoole HTTP server handles MCP requests. Each request passes origin, size and protocol-version checks and JSON-RPC parsing before token verification.',
        'tools/call looks the tool up in the live catalog, passes the rate-limit gate, then calls the business API with a freshly signed short-lived token. Results return as text and structured content, with status metadata for clients.',
        'Write tools first return a preview and a confirmation token; only a second call carrying that token applies the change, exactly once.',
      ],
      decisions: [
        {
          decision: 'API-only, no direct database access',
          why: 'Business rules and permissions stay in one place, and the MCP server cannot bypass them.',
        },
        {
          decision: 'Hand-written protocol layer instead of an SDK',
          why: 'A small, protocol-exact server: parsing, version negotiation and error codes are explicit and testable.',
        },
        {
          decision: 'Stateless HTTP transport',
          why: 'No server-side sessions, so it scales horizontally; rate limits and confirmation state live in a shared store.',
        },
        {
          decision: 'Long-running workers',
          why: 'Warm workers cache the tool catalog, with per-request state kept isolated.',
        },
        {
          decision: 'Writes are opt-in per tool',
          why: 'Read tools can be enabled broadly; each write tool is enabled deliberately and always goes through preview and confirmation.',
        },
      ],
      implementation: [
        'Disabled and unknown tools return the same error, so callers cannot probe the catalog.',
        'Every catalog change requires a reason, is written to an append-only audit log and takes effect immediately.',
        'Per-request audit records with secrets scrubbed, personal data masked and automatic expiry.',
        'Container hardening: pinned images, non-root user, read-only filesystem and dropped Linux capabilities.',
        'Operational scripts for SLO reporting, usage roll-ups and per-account data erasure.',
      ],
      tradeoffs: [
        'Generating tools from routes gives coverage quickly, but each tool still needs human-written descriptions to be useful to a model.',
        'Keeping the server API-only adds a network hop, in exchange for a single place where permissions are enforced.',
      ],
      results: [
        'Any MCP client can discover and call the platform through one secure interface.',
        'Tools stay in sync with the API automatically and can be enabled or disabled without a deploy.',
        'No cross-account data exposure found across the tool catalog in the QA campaign.',
      ],
      learned: [
        'Generate integrations from the source of truth; never maintain two lists.',
        'AI clients need different guardrails than browsers: confirmation, quotas and audit trails.',
        'Replacing my own first version with a generated, API-only design was the right call.',
      ],
    },
  },

  {
    slug: 'backend-engineering',
    title: 'Backend Engineering & Integrations',
    eyebrow: 'Integrations · Reliability · Data',
    summary:
      'Backend work across the platform: marketplace publishing, an AI-assisted listing flow, Redis-backed correctness patterns and a sustained defect-remediation effort.',
    context: 'Company work at CarTrade Tech',
    role: 'Developer on platform features, partner integrations, production debugging and defect remediation.',
    problem:
      'A large, long-lived platform accumulates slow queries, integration failures and data-isolation risks. Marketplace integrations had to be reliable, observable and economical with third-party API calls.',
    approach:
      'Treat integrations as queues with audit trails, publish only real changes, scope every write to the signed-in account, and use Redis for atomic correctness, not just caching.',
    stack: ['PHP', 'MySQL', 'Redis', 'MongoDB', 'REST integrations', 'Vue 3'],
    contributions: [
      'Built backend features for publishing dealer inventory to a partner marketplace: queued create, update and removal actions with change detection that skips calls when nothing relevant changed.',
      'Built an AI listing assistant: vehicle photos go through an external image-analysis service and a registration lookup to pre-fill the listing form.',
      'Built monitoring for listing integrations: success and failure counts, and a report that classifies failures by cause.',
      'Resolved 150+ tracked defects, including multi-tenant data-isolation and input-validation hardening.',
      'Investigated slow queries and error logs, and optimized slow queries in admin and reporting panels.',
    ],
    challenges: [
      {
        title: 'Avoiding redundant third-party calls',
        body: 'Comparing the fields that matter to the marketplace before queuing an update means listings are re-sent only when something relevant actually changed.',
      },
      {
        title: 'Cross-tenant safety',
        body: 'Every write path is scoped to the account in the verified token, never to request parameters, and each hardened path has a regression scenario.',
      },
      {
        title: 'Redis for correctness, not just speed',
        body: 'Atomic scripts for rate limits, single-use tokens consumed with get-and-delete, and atomic budget reservations keep concurrent requests from racing.',
      },
    ],
    impact: [
      { value: '150+', label: 'defects resolved' },
      { value: 'Diff-first', label: 'publishing: only real changes are sent' },
      { value: 'Classified', label: 'integration failures, traceable per request' },
    ],
    diagram: 'backend',
    caseStudy: {
      overview:
        'Not every valuable piece of engineering is a new system. This case study collects the backend work that keeps a production platform correct, observable and economical with external APIs.',
      situation: [
        'Inventory is published to external marketplaces, each with its own API, mapping rules and failure modes.',
        'Failures were hard to diagnose without a record of what was sent and what came back.',
        'Older write paths needed stronger tenant scoping and server-side validation.',
      ],
      solution: [
        'Marketplace publishing runs through a queue: each change becomes an auditable action picked up by a worker, with requests and responses recorded for later debugging.',
        'Before an update is queued, relevant fields are compared with the last published state; unchanged listings are skipped.',
        'Isolation and validation fixes were made at the boundary: ownership derived from the token, server-side values and parameterized inputs.',
      ],
      decisions: [
        {
          decision: 'Diff before you publish',
          why: 'Third-party calls are slow and rate-limited. Sending only real changes reduces load and noise in the logs.',
        },
        {
          decision: 'Queue actions instead of calling inline',
          why: 'Every change is auditable and retryable, and a slow partner API never blocks the user.',
        },
        {
          decision: 'Keep large integration payloads out of the relational database',
          why: 'Request and response bodies live in a document store, one lookup away when debugging.',
        },
        {
          decision: 'Scope by identity, not by input',
          why: 'An account ID in a request body is a suggestion; the one in the verified token is a fact.',
        },
      ],
      implementation: [
        'Validation that rejects duplicate or conflicting publishing requests before they reach the queue.',
        'Authenticated partner calls with timeouts and full request/response logging.',
        'A failure report that groups listing-sync errors by cause so they can be fixed at the source.',
        'Regression scenarios for each hardened write path, run as part of the API test suite.',
      ],
      tradeoffs: [
        'Query improvements were verified case by case from slow-query logs rather than a benchmark suite, so no percentage is claimed here.',
      ],
      results: [
        'Listings are re-published only when relevant fields change.',
        'Integration failures are classified and traceable to the exact request.',
        '150+ defects closed, with regression coverage for tenant isolation.',
      ],
      learned: [
        'An integration is only as good as its logs.',
        'Correctness under concurrency is a design property; atomic operations beat careful timing.',
        'Read the slow-query and error logs regularly; they describe the system better than its documentation.',
      ],
    },
  },
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}
