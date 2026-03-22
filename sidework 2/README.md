# sidework

> It's last call. Now what?

Job board for hospitality workers transitioning to careers outside the industry. Built with React + Vite, deployable to Cloudflare Pages in under 5 minutes.

---

## Project Structure

```
sidework/
├── public/
│   └── _redirects          # Cloudflare SPA routing (do not delete)
├── src/
│   ├── styles/
│   │   └── global.css      # Design tokens + reset + shared animations
│   ├── components/
│   │   └── ui.jsx          # Shared components (Logo, Button, Card, GuestCheck, etc.)
│   ├── pages/
│   │   ├── Home.jsx        # Homepage / front of house
│   │   ├── Auth.jsx        # Sign up / sign in flow
│   │   ├── Evaluator.jsx   # Free AI skills evaluation (10 questions)
│   │   ├── Profile.jsx     # Candidate profile builder
│   │   ├── Browse.jsx      # Job browse + search + filters
│   │   ├── Dashboard.jsx   # Candidate dashboard (matches, activity, profile)
│   │   ├── Messages.jsx    # Candidate ↔ employer messaging
│   │   ├── Employer.jsx    # Employer profile + job posting flow
│   │   └── Pricing.jsx     # Pricing page (candidate + employer)
│   ├── constants.js        # Colors, routes, API config, shared callClaude() helper
│   ├── App.jsx             # Router — all routes defined here
│   └── main.jsx            # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Deploy to Cloudflare Pages

### First time

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create a project
3. Connect your GitHub repo
4. Set build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click Deploy

That's it. Cloudflare auto-deploys on every push to main.

### Environment Variables

The Anthropic API key is currently handled by Claude.ai's artifact environment.
For production you have two options:

**Option A — Cloudflare Worker proxy (recommended)**
Create a Worker that holds the API key server-side and proxies requests.
Update `API.url` in `constants.js` to point to your Worker URL.
This keeps the key out of the browser bundle entirely.

**Option B — Cloudflare Pages environment variable (quick)**
Add `VITE_ANTHROPIC_KEY` in your Pages project settings.
Update `constants.js` to use `import.meta.env.VITE_ANTHROPIC_KEY`.
Note: this exposes the key in the JS bundle — fine for a private test, not for production.

---

## Key Design Decisions

**Colors** — All colors live in `src/styles/global.css` (CSS vars) and `src/constants.js` (JS). Change once, updates everywhere.

**Routing** — All routes defined in `App.jsx`. All route paths defined in `constants.js → ROUTES`. Adding a page = add a lazy import + one `<Route>` line.

**Claude API** — The `callClaude()` helper in `constants.js` handles fetch, error checking, and JSON extraction. Every page that calls the API uses this — no duplicated fetch logic.

**The Guest Check** — The receipt visual is a shared component in `ui.jsx → GuestCheck`. Pass it skills data and it renders consistently across evaluator results, profile builder, and homepage teaser.

**Fonts** — Loaded in `index.html` via Google Fonts. Syne (display/headings), DM Sans (body), DM Mono (labels/mono elements).

---

## Pages Overview

| Page | Route | What it does |
|---|---|---|
| Home | `/` | Marketing homepage with hero, translation showcase, how it works, testimonials |
| Auth | `/auth` | Sign up / sign in with Google OAuth stub and email/password |
| Evaluator | `/evaluate` | Free 10-question AI skills assessment → personalized Skills Check |
| Profile | `/profile` | Multi-step candidate profile builder, pre-filled from evaluator |
| Browse | `/jobs` | Job search with filters, sort, and hospitality-translated listings |
| Dashboard | `/dashboard` | Matched jobs, employer activity feed, profile completeness |
| Messages | `/messages` | Two-panel inbox + thread with AI quick reply suggestions |
| Employer | `/employer` | Company profile + job posting + candidate match dashboard |
| Pricing | `/pricing` | Tiered pricing for candidates and employers with FAQ |

---

## Brand

- **Name:** sidework (always lowercase)
- **Tagline:** It's last call. Now what?
- **Primary CTA (candidate):** Take the Free Skills Check → / Open My Tab →
- **Primary CTA (employer):** Post Your First Job →
- **Apply button:** Put In My Ticket →
- **Contact:** hello@sidework.io / partnerships@sidework.io

---

## Tech Stack

- React 18
- React Router v6
- Vite 5
- Cloudflare Pages (hosting)
- Anthropic Claude API (AI skills evaluation, job translation, messaging suggestions)
- Google Fonts (Syne, DM Sans, DM Mono)
- No CSS framework — all styles are inline or in global.css
