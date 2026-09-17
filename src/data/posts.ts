export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: number;
  imageId: string;
}

export const POSTS: Post[] = [
  {
    id: 1,
    slug: "design-systems-at-scale",
    title: "Building Design Systems That Scale",
    excerpt:
      "How a consistent token architecture keeps large teams aligned across products, platforms, and time zones.",
    content: `A design system is not a component library. A component library is part of a design system — the most visible part — but the system is the full constellation of decisions: tokens, principles, governance, documentation, and the social contracts that keep teams aligned.

## Start with tokens, not components

Tokens are the atomic layer. Before you build a single button, name your spacing units, define your type scale, and settle on a color primitive vocabulary. Colors like \`blue-500\` are primitives; colors like \`action-primary\` are semantic aliases that point to primitives. Only semantic aliases belong in components.

This distinction matters at scale because primitives change rarely, but semantic meaning can be reassigned across brand refreshes without touching component code. A well-aliased system lets you ship a rebrand in a day instead of a month.

## Governance is the hard part

The technical side of a design system is tractable. The organizational side is not. Who decides when a component graduates from a product team to the shared system? Who reviews contributions? Who deprecates old patterns?

At Stripe, Airbnb, and Shopify — teams that have written publicly about this — the answer is usually a small dedicated team with a clear RFC process, a contribution backlog, and explicit service-level commitments. Without this structure, systems calcify: teams fork components locally rather than negotiate the shared one, and the system diverges from practice.

## Measure adoption, not just coverage

The vanity metric for design systems is component coverage — "we have a component for everything." The useful metric is adoption: what fraction of production UI is actually built with system components?

Run a periodic audit. Diff production screenshots against reference renders. Track divergence over time. Low adoption signals either a discoverability problem (teams don't know the component exists) or a quality problem (the component doesn't meet their needs). Both are fixable, but only if you measure.`,
    category: "Design",
    tags: ["design systems", "tokens", "scalability"],
    author: "Lena Marchetti",
    date: "2026-08-18",
    readTime: 6,
    imageId: "photo-1558655146-9f40138edfeb",
  },
  {
    id: 2,
    slug: "react-server-components-deep-dive",
    title: "React Server Components: A Practical Deep Dive",
    excerpt:
      "Moving past the mental model and into real-world patterns — data fetching, composition, and the boundaries that matter.",
    content: `React Server Components (RSC) rewrite the mental model of where rendering happens. The short version: Server Components run on the server only, have no client-side JavaScript, and can be async. Client Components run in both environments and carry interactivity.

## The boundary question

The most important RSC concept isn't Server Components — it's the boundary. When you add \`"use client"\` to a file, you define a boundary: everything from that component downward runs on the client. But you can still pass Server Component subtrees *into* Client Components as children. The component receiving children doesn't re-render when the server-rendered children update.

This pattern unlocks powerful compositions: a stateful shell (client) wrapping a data-dense tree (server), with no prop-drilling of server data through the shell.

## Data fetching without useEffect

The most immediate benefit of RSC is eliminating waterfall fetches. In a Client Component world, you fetch on mount, which fires after hydration, which fires after the JS bundle loads. Three sequential round trips before the user sees data.

Server Components fetch during render, on the server, where network latency to your database is single-digit milliseconds. You compose them like regular components and they waterfall only if you nest awaits unnecessarily — which \`Promise.all\` trivially fixes.

## What not to use them for

RSC doesn't replace everything. Any component that uses \`useState\`, \`useEffect\`, browser APIs, or event handlers must be a Client Component. The key is keeping those components small and pushing data-fetching and static structure up into Server Components.`,
    category: "Engineering",
    tags: ["react", "server components", "performance"],
    author: "Jonas Bergström",
    date: "2026-08-05",
    readTime: 8,
    imageId: "photo-1555066931-4365d14bab8c",
  },
  {
    id: 3,
    slug: "typography-for-reading",
    title: "Typography That Actually Helps People Read",
    excerpt:
      "Measure, leading, and optical sizing — the three dials that make the difference between text you skim and text you read.",
    content: `Most digital typography is optimized for scanning, not reading. Headlines compete for attention, pull-quotes interrupt flow, and line lengths stretch to the edges of widescreen monitors. If your goal is actual reading — the kind where ideas transfer from page to mind — you need different settings.

## Measure: the line length question

Typographers use "measure" to describe line length. The traditional guideline is 45–75 characters per line, including spaces. Below 45, the eye reverses too often; above 75, it loses the return track.

For body text at 16–18px with a typical sans-serif, this maps to roughly 60–70ch in CSS. That's narrower than most content columns. The instinct to fill the viewport is almost always wrong for reading — resist it with a max-width on the content container, not the page.

## Leading and its relationship to measure

Leading (line-height) should scale with measure. Wider columns need more leading so the eye can track across and find the next line cleanly. Tight columns can use tighter leading. A 65ch column at 18px reads well at 1.6–1.7 line-height; a 45ch column can drop to 1.5.

## Optical sizing

Variable fonts with an \`opsz\` axis adjust letterform details at different sizes — thinner strokes, wider apertures, adjusted spacing at small sizes; sharper contrast and tighter fitting at large sizes. If you're using Inter, Fraunces, or Playfair Display, both support optical sizing. Enable it: \`font-optical-sizing: auto\` in CSS.`,
    category: "Design",
    tags: ["typography", "readability", "css"],
    author: "Lena Marchetti",
    date: "2026-07-22",
    readTime: 5,
    imageId: "photo-1456513080510-7bf3a84b82f8",
  },
  {
    id: 4,
    slug: "postgres-full-text-search",
    title: "Full-Text Search in Postgres Without Elasticsearch",
    excerpt:
      "tsvector, GIN indexes, and ts_rank give you surprisingly capable search for most applications — no extra infrastructure.",
    content: `The default path to full-text search in 2026 is to stand up Elasticsearch or Typesense. That's often the right call — but it adds infrastructure, operational complexity, and sync pipelines. For many applications, Postgres's built-in full-text search is entirely sufficient.

## How it works

Postgres converts text to \`tsvector\` — a normalized, stemmed representation of the document. Queries become \`tsquery\` — a boolean expression of lexemes. The \`@@\` operator matches a tsvector against a tsquery.

\`\`\`sql
SELECT title FROM posts
WHERE to_tsvector('english', title || ' ' || body) @@ to_tsquery('english', 'design & systems');
\`\`\`

For performance, precompute and store the tsvector in a generated column, then index it with GIN:

\`\`\`sql
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;

CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);
\`\`\`

## Ranking results

\`ts_rank\` scores matches by frequency and proximity. \`ts_rank_cd\` uses cover density, which weighs proximity more heavily. For most cases, \`ts_rank\` is fine:

\`\`\`sql
SELECT title, ts_rank(search_vector, query) AS rank
FROM posts, to_tsquery('english', 'design') query
WHERE search_vector @@ query
ORDER BY rank DESC;
\`\`\`

## When to reach for dedicated search

Postgres FTS doesn't do fuzzy matching out of the box (though \`pg_trgm\` adds trigram similarity), doesn't handle typos, and ranking is less sophisticated than Elasticsearch's BM25. If you need autocomplete, faceted search, or synonym expansion, dedicated search infrastructure earns its cost.`,
    category: "Engineering",
    tags: ["postgres", "search", "databases"],
    author: "Maya Okonkwo",
    date: "2026-07-10",
    readTime: 7,
    imageId: "photo-1544383835-bda2bc66a55d",
  },
  {
    id: 5,
    slug: "product-thinking-for-engineers",
    title: "Product Thinking for Engineers",
    excerpt:
      "The questions you ask before writing code determine more about the outcome than the code itself.",
    content: `The most impactful engineers I've worked with share a trait that has nothing to do with technical skill: they interrogate requirements before implementing them. Not to delay, but to surface the assumptions baked into a spec.

## The requirement behind the requirement

A product manager writes: "add a loading spinner to the search results." An engineer who thinks only in implementation terms adds a spinner. An engineer with product thinking asks: why are we solving this with a spinner? What's the underlying problem — perceived slowness? Actual slowness? Uncertainty about whether the search ran?

If the search takes 800ms, a spinner doesn't solve the problem — a faster search does. If users don't know results are loading, optimistic UI might serve them better than a spinner. The spec describes a solution; the engineer's job is to find the problem it's trying to solve, then evaluate whether that solution is the best one.

## Writing the counter-spec

Before building, try writing a one-paragraph counter-spec: what happens if we don't build this? What's the cost of the problem this solves? Who is actually affected and how often?

This exercise surfaces two things: features that don't have a real problem behind them (more common than people admit), and features where the problem is real but the proposed solution is a poor fit.

## Ship to learn, not to finish

The frame of "finishing" a feature is almost always wrong. You ship a version, watch how people use it (or don't), and iterate. Engineers who treat their first implementation as a finished product build brittleness in — they optimize the wrong thing, add flexibility nobody uses, and harden assumptions that turn out to be wrong.`,
    category: "Product",
    tags: ["product thinking", "engineering", "process"],
    author: "Jonas Bergström",
    date: "2026-06-28",
    readTime: 5,
    imageId: "photo-1552664730-d307ca884978",
  },
  {
    id: 6,
    slug: "color-in-interface-design",
    title: "Color in Interface Design: Beyond the Palette",
    excerpt:
      "Why picking good colors is easy and using them well is hard — and what the systematic approach looks like.",
    content: `Every designer knows how to pick a palette. Open a color wheel, choose complementary or analogous hues, add neutrals, done. The palette is not the problem. The problem is what you do with it.

## Function before decoration

Color in interfaces is primarily functional. It communicates state (success, warning, error, disabled), establishes hierarchy (primary actions vs. secondary vs. destructive), and guides attention (where to look first, what's interactive). Decorative color — fills, gradients, illustrations — serves the function once the functional layer is complete.

Most color mistakes happen when decorative color conflicts with functional color. If your brand accent is red and your error state is also red, users can't distinguish brand-intent from system-error. Solve function first, then decorate around it.

## The semantic alias pattern

Functional color systems use semantic aliases rather than raw values. Instead of \`red-500\` in error states, you alias \`color-error: red-500\`. When the brand red changes, you update one alias, not every error state. When dark mode inverts the palette, semantic aliases switch targets while components stay unchanged.

This is the pattern design systems like Material, Radix, and shadcn/ui use — not because it's clever, but because it's the only way to maintain color sanity at scale.

## Contrast as a constraint, not an afterthought

WCAG AA requires 4.5:1 contrast for body text. That's a floor, not a target. High-contrast text is more readable for everyone, not just users with visual impairments. Design for 7:1 on body copy and you'll never fail an accessibility audit.`,
    category: "Design",
    tags: ["color", "accessibility", "design systems"],
    author: "Lena Marchetti",
    date: "2026-06-12",
    readTime: 6,
    imageId: "photo-1513364776144-60967b0f800f",
  },
  {
    id: 7,
    slug: "edge-functions-vs-api-routes",
    title: "Edge Functions vs. API Routes: Choosing the Right Layer",
    excerpt:
      "Geography, cold starts, and runtime constraints — the tradeoffs that should guide your serverless architecture.",
    content: `The proliferation of edge compute — Vercel Edge Functions, Cloudflare Workers, Deno Deploy, AWS Lambda@Edge — has created a decision layer that didn't exist five years ago. Most teams reach for edge compute because it's fast, then discover the constraints after deployment.

## What edge runtime actually means

"Edge" means your code runs on servers geographically close to your users. Round-trip time from New York to an origin in Virginia is ~20ms; from New York to a Cloudflare edge node also in New York might be 2ms. For latency-sensitive operations — auth token validation, geolocation, A/B flags — that 18ms matters.

The constraint is that edge runtimes don't run Node.js. They run a stripped environment based on the Web Platform API — \`fetch\`, \`Request\`, \`Response\`, \`crypto\`, \`TextEncoder\`. No \`fs\`, no \`process\`, limited \`node:\` compatibility depending on the platform.

## When to use edge functions

- Request/response transformation (rewrites, redirects, header injection)
- Auth validation (JWT verification before the request hits origin)
- Geolocation-dependent routing
- Simple personalization (country-specific content, feature flags)
- A/B testing at the infrastructure layer

## When to use server-side API routes instead

- Database queries (most edge platforms have no native DB drivers)
- File I/O of any kind
- Operations that depend on Node.js built-ins
- Long-running operations (edge functions have strict CPU limits — typically 50ms)

The practical answer for most Next.js projects: validate auth at the edge, fetch data at origin, and only move more to the edge when profiling shows a meaningful latency benefit.`,
    category: "Engineering",
    tags: ["edge", "serverless", "performance", "architecture"],
    author: "Maya Okonkwo",
    date: "2026-05-30",
    readTime: 7,
    imageId: "photo-1451187580459-43490279c0fa",
  },
  {
    id: 8,
    slug: "writing-for-product",
    title: "Writing for Product: Why Clarity Is a Design Decision",
    excerpt:
      "UX writing isn't about wordsmithing — it's about resolving ambiguity before users have to.",
    content: `The worst interfaces don't have too many buttons — they have too many questions. "Are you sure?" "Submit request?" "Confirm action?" Questions without context, jargon without definitions, labels that describe the control rather than its consequence.

Good UX writing eliminates the question before the user forms it.

## Specificity over brevity

The cult of brevity in UX writing often produces specificity deficits. "Error" is brief. "We couldn't send your message — check your connection and try again" is specific. Specific copy is more useful, more trustworthy, and — counterintuitively — often faster to process because it answers the user's question before they ask it.

Aim for the shortest copy that is fully specific. Don't sacrifice specificity for brevity.

## Labels describe consequences, not controls

"Submit" is a label that describes the control — it says what the button does technically. "Send message" describes the consequence — it says what happens in the world as a result of clicking. Consequence labels are almost always better because they match the user's mental model. They're thinking about their goal (sending the message), not the system's operation (submitting a form).

This applies everywhere: "Delete" → "Delete account permanently"; "Save" → "Save draft"; "Cancel" → "Discard changes".

## Write for the bad path first

Most UX writing focuses on the happy path. The bad path — errors, empty states, failed payments, permission denials — is where users are most stressed and most in need of clear communication. Write those states first. If your error states are specific and helpful, the rest of the copy will be too.`,
    category: "Product",
    tags: ["ux writing", "product", "communication"],
    author: "Jonas Bergström",
    date: "2026-05-15",
    readTime: 4,
    imageId: "photo-1455390582262-044cdead277a",
  },
];

export const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

export const ALL_TAGS = Array.from(new Set(POSTS.flatMap((p) => p.tags))).sort();

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "A → Z" },
];

export function getPostBySlug(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
