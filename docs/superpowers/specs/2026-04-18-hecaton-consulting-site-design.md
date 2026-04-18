# Hecaton consulting site — design

Date: 2026-04-18
Status: Approved for implementation planning

## 1. Overview

A single-purpose marketing site for **Hecaton**, a part-time fractional platform-engineering studio run by Jaime Baldó (~20–25h/week availability). Built on the existing Bigspring Light Astro template but substantially reshaped — we keep the build tooling, collection system, and React/Tailwind/MDX plumbing, and rebuild the visual surface and content to match the brand.

Launch goal: a credible, differentiated site that an engineering-minded buyer lands on, believes, and books a call from.

## 2. Audience

Primary ICP: growing SaaS companies with infra pain, two overlapping bands:

- **Seed–Series B** (5–30 engineers): Heroku → AWS, first IaC, first compliance push, no platform team yet.
- **Series B → growth** (30–200 engineers): chaos-from-speed, cost creep, SOC 2 / NF 525, multi-account AWS, observability gaps.

Buyers evaluating the site: CTOs, VPs of Engineering, lead platform/DevOps engineers. Sophisticated technical readers — they will notice template tells and marketing fluff.

## 3. Brand system

### Name
**Hecaton** (matches the `hecaton.tech` domain). Etymology hook: the Hecatoncheires of Greek myth were hundred-handed — quietly reinforces the "fractional but capable" shape.

### Positioning
A boutique, principal-led platform-engineering studio. Hecaton-as-company is the wrapper; Jaime is visibly the practitioner.

### Tagline
> **You shipped fast. We'll make it last.**

Used on the homepage hero, OG image, and as a sign-off in the footer.

### Voice
Confident, opinionated, technical, faintly sardonic. Short sentences. Verbs over adjectives. Copy that reads like an engineer who has seen the mess, not a marketer describing it.

### Availability honesty
The site states capacity plainly — currently taking one new retainer client at a time. No inflated team fictions.

## 4. Visual system

### Palette (dark-mode first)
| Role | Hex |
|------|-----|
| Background | `#0A0A0A` |
| Ink (primary text) | `#FAFAF7` |
| Accent (CTAs, highlights) | `#CCFF66` |
| Muted text | `#A8A8A3` |
| Borders/dividers | `#1F1F1F` |

The accent-lime is the "playful/bold" payload. Everything else is disciplined, so the accent actually carries weight when used. Use it sparingly: primary CTAs, link underlines, one highlight per section, focus rings.

### Typography
- **Display / headings:** Space Grotesk, weights 500–700. Tight leading on the hero.
- **Body:** Inter, weights 400–500.
- **Technical flourishes:** JetBrains Mono — section labels (`> platform/rescue`), metric-strip decorators, monospace diagnostic lines.

Self-hosted via `astro-font` (no Google Fonts request; better perf + privacy).

### Scale & rhythm
- Hero headline: `clamp(3rem, 8vw, 6rem)` with tight leading (`0.95–1.0`).
- Section headings: `clamp(2rem, 4vw, 3.25rem)`.
- Generous vertical spacing between sections (`py-24` or larger at desktop).
- Content column: single, `max-w-[72ch]` for prose; wider for cards/grids.

### Motion
- On-scroll fade-up with small stagger for card grids.
- Hover: lime underline grows from left on links; cards lift 2px; buttons invert to accent background.
- Hero "wow": blinking `_` cursor after the tagline, or an accent-lime line drawing in under "last.".
- `prefers-reduced-motion` respected — transforms and non-essential animations disabled.

### Imagery
- No stock illustrations. No swiper carousels.
- Typography, metric blocks, and monospace diagnostic strips do the visual work.
- One portrait of Jaime on `/about`.
- OG image: bold type over near-black with the tagline.

## 5. Information architecture

```
/                           Home
/engagements                Two productised engagement shapes + FAQ strip
/about                      Jaime-forward profile + Track Record + Writing links
/contact                    Booking (Cal.com) + fallback form (Web3Forms)
/contact/thanks             Post-submit confirmation page
/privacy                    Retained; rewritten for Hecaton
/terms                      Retained; rewritten for Hecaton
404                         Retained; restyled
```

Removed from template: `/blog`, `/pricing`, `/faq` (absorbed into `/engagements`), `/elements`.

Nav (header): Engagements · About · Contact, plus a primary **Book a call** button.
Footer: wordmark, tagline, nav links, GitHub + LinkedIn icons, Privacy + Terms, `© Hecaton`.

## 6. Page-by-page content

### 6.1 `/` Home — five sections

Narrative: **hook → proof → offer → trust → ask**.

**Hero**
- Tagline (H1): *"You shipped fast. We'll make it last."*
- Subhead: *"A fractional platform-engineering studio for scaling SaaS. We step into the chaos, document it, and leave you with the platform your team should've had."*
- Primary CTA: **Book a 30-min call →** (anchor to Cal.com)
- Secondary: **See engagements** (→ `/engagements`)
- Flourish: blinking `_` cursor after the tagline

**Proof strip (career metrics, framed honestly)**
- Heading (monospace): `─── SELECTED OUTCOMES FROM A DECADE OF PLATFORM WORK ───`
- Inline metric blocks:
  - `52% AWS bill cut` — scale-up hospitality SaaS
  - `95% fewer outages` — mid-market SaaS
  - `SOC 2 + NF 525` — compliance delivered
  - `70+ AWS accounts` — centralised observability
  - `40% CI/CD savings` — pipeline refactor
- Small disclaimer line: *"Drawn from a decade of platform work across employed roles — see About for full context."*

**What we do (engagement teasers)**
Two cards (not three — matches the engagement model):
- `> platform/audit` — Platform Audit & Roadmap
- `> platform/fractional` — Fractional Platform Engineer

Each: monospace slug, title, one-paragraph premise, "Learn more →" link to `/engagements`.

**Who's behind this**
Short paragraph, portrait, two-line credentials strip ("Senior Platform Engineer · C2 English · remote, based in Spain"). Line: *"Hecaton is principal-led: you get Jaime on the keyboard, not a bench."* Link: **More about Jaime →** (`/about`).

**Final CTA**
Full-width dark block with accent-lime flourish.
- Heading: *"What's the worst part of your platform right now?"*
- Sub: *"A 30-minute call costs nothing and usually leaves you with a clearer plan either way."*
- Button: **Book a call →**

**Footer** (sitewide).

### 6.2 `/engagements`

Intro paragraph (1–2 sentences on how Hecaton engages). Capacity honesty line: *"Currently taking one new retainer client at a time."*

**Engagement 1 — Platform Audit & Roadmap**
- Slug header: `> platform/audit`
- **Premise:** A fixed-scope sprint to map your infra, identify the sharpest pain, and deliver a prioritised 6-month platform roadmap. Includes quick-win fixes in-band.
- **Best for:** Teams that know something is wrong but don't know where to start.
- **Scope:**
  - Cloud + CI/CD audit (AWS / GCP / Azure; CI systems)
  - IAM and security review
  - Cost audit with quantified opportunities
  - Observability gap analysis
  - 6-month prioritised roadmap document
  - Quick-win fixes shipped during the engagement
- **Duration:** 3–4 weeks calendar, 40–60 hours of work
- **Outcome:** You leave with a written plan, documented systems, and measurable quick wins in place.
- CTA: **Book a call →**

**Engagement 2 — Fractional Platform Engineer**
- Slug header: `> platform/fractional`
- **Premise:** Ongoing embedded platform-engineering capacity for teams that need senior infra work without hiring.
- **Best for:** Teams without a platform hire yet, or teams whose lone platform person is underwater.
- **Scope (what work looks like):**
  - IaC ecosystems (Terraform modules, self-serve repos)
  - CI/CD design, optimisation, cost reduction
  - Observability rollout (Grafana/Loki, CloudWatch, structured logging)
  - Security & compliance — SOC 2, NF 525 readiness, IAM overhauls
  - Cost optimisation (FinOps audits + ongoing reviews)
  - Documentation and runbooks
  - On-call uplift and incident review
- **Commitment:** 10–20h/week, monthly retainer, 3-month minimum.
- **Outcome:** A platform that gets quietly better every month without derailing your product team.
- CTA: **Book a call →**

**FAQ strip** (absorbs old FAQ page, 5 entries):
1. *Do you work alone?* — Yes. Hecaton is principal-led — Jaime on the keyboard. No bench, no handoffs.
2. *Can you work inside our VPC / with production access?* — Yes, with the right controls. We establish least-privilege access, document it, and revoke it cleanly at end of engagement.
3. *What's your day rate?* — It depends on engagement shape. Book a call and we'll scope it together.
4. *What's the notice period on the retainer?* — 30 days either side after the 3-month minimum.
5. *Where are you based / timezone?* — Spain (CET/CEST). Comfortable working async with teams from US East to APAC.

### 6.3 `/about`

- H1 + portrait + first-person intro paragraph (2–3 sentences).
- Credentials strip (monospace): `Senior Platform Engineer · 10+ years · C2 English · native Spanish · proficient Italian · remote, based in Spain`
- **How I got here** — condensed career narrative in prose (not a CV list). Three paragraphs covering the arc: system admin roots → DevOps at ClickDimensions → platform engineering at Eva Global and Amenitiz. Keep employer names consistent with public LinkedIn.
- **Track record** — five to six metric blocks, each with an honest "as [role] at [anonymised employer shape]" attribution. These are Jaime's career wins, explicitly not Hecaton's.
- **How I work** — short manifesto, five to seven bullet points. Opinionated: documentation-first, no hand-holding, outcome-over-output, IaC always, FinOps baked in, etc.
- **Writing** — link-outs to LinkedIn / Medium / personal writing if any. If none, the section is hidden on launch; re-enabled when content exists.
- Final CTA.

### 6.4 `/contact`

- H1: *"Let's talk about your platform."*
- Sub: *"30-minute intro call, no pitch deck. Bring the mess."*
- **Primary:** Cal.com inline embed (iframe widget). If the visitor prefers their own client, a plain link below: *"Or pick a time: cal.com/hecaton"*.
- **Fallback form** (below the fold): Web3Forms POST to `https://api.web3forms.com/submit`. Fields:
  - Name (required)
  - Email (required)
  - Company (optional)
  - What's broken? (textarea, required)
  - Hidden: `access_key`, `redirect=https://hecaton.tech/contact/thanks`, honeypot `botcheck`.
- Last-resort contact line: `jaime@hecaton.tech`.
- No phone number on the public site.

### 6.5 `/contact/thanks`

- Simple confirmation page.
- H1: *"Thanks — message received."*
- Body: *"I'll get back to you within one business day. In the meantime, if you'd rather just pick a time, here's my calendar."* + Cal.com link.
- Secondary link back to `/`.

### 6.6 `/privacy`, `/terms`

Retained from template, rewritten for Hecaton. Minimal: what data the contact form collects (name, email, company, message), where it goes (Web3Forms → email), analytics disclosure (Umami Cloud, no cookies), no third-party ad networks.

### 6.7 `404`

Retained, restyled in the new palette. Line: *"This page doesn't exist. Unlike your AWS bill."* + link home.

## 7. Technical architecture

### 7.1 Stack

**Kept from template:**
- Astro 5, Tailwind 4, React 19, MDX
- Astro content collections
- `astro-auto-import` for MDX shortcodes
- `@astrojs/sitemap` for sitemap.xml
- `astro-font` for self-hosted fonts

**Removed:**
- `astro-swiper` (no more carousels)
- `@digi4care/astro-google-tagmanager` (no GTM)
- Sitepins CMS config and `.sitepins/` directory
- `netlify.toml` (not deploying to Netlify)

**Added:**
- None. No new dependencies beyond what's already installed.

### 7.2 Content collections (`src/content.config.ts`)

- **Keep:** `homepage`, `contact`, `pages` (for privacy/terms/404)
- **Replace `pricing` →** `engagements`:
  ```ts
  engagements: [{
    slug: string,
    title: string,
    premise: string,
    best_for: string,
    scope: string[],
    duration: string,
    outcome: string,
    cta: { label: string, link: string }
  }]
  faqs: [{ question: string, answer: string }]
  capacity_note: string
  ```
- **Remove:** `blog`, `faq`, `pricing` collections entirely.
- **Add:** `about` collection — intro, credentials strip, career narrative (MDX body), track-record items (list of `{metric, context}`), how-I-work list, writing links.

### 7.3 Components

**New components to build:**
- `Hero.astro` — big type, dual CTA, cursor flourish
- `MetricStrip.astro` — monospace rules, accent-lime numbers, inline blocks
- `EngagementCard.astro` — monospace slug + structured fields
- `TrackRecordItem.astro` — metric + anonymised context
- `MonoLabel.astro` — `> slug/name` decorator
- `CursorBlink.astro` — CSS-animated `_`
- `FaqStrip.astro` — accordion-style FAQ block
- `CtaBlock.astro` — full-width accent block with single question + button
- `CalEmbed.astro` — Cal.com inline widget wrapper
- `ContactForm.astro` — Web3Forms-bound HTML form

**Modified:**
- `Base.astro` — dark theme, new fonts, updated `<head>` for Umami + OG + favicon
- `Header.astro` — new nav + primary CTA button styling
- `Footer.astro` — new structure, remove template menus

**Removed components:**
- All blog components (`src/layouts/blog/*`, blog shortcodes)
- Swiper-related imports and styles
- `Cta.astro` template (replaced by `CtaBlock.astro`)
- Pricing components

### 7.4 Configuration

`src/config/config.json`:
```json
{
  "site": {
    "title": "Hecaton",
    "base_url": "https://hecaton.tech",
    "base_path": "/",
    "trailing_slash": false,
    "favicon": "/favicon.png",
    "logo_text": "Hecaton"
  },
  "nav_button": {
    "enable": true,
    "label": "Book a call",
    "link": "/contact"
  },
  "params": {
    "copyright": "© Hecaton"
  },
  "metadata": {
    "meta_author": "Jaime Baldó",
    "meta_image": "/images/og-image.png",
    "meta_description": "Fractional platform engineering for scaling SaaS."
  }
}
```

`src/config/theme.json` updated with the palette + fonts described above.

`src/config/social.json` trimmed to GitHub + LinkedIn only. Facebook and X links removed.

`src/config/menu.json` updated to match new IA.

### 7.5 Assets to delete from `public/images/`

`banner-art.png`, `banner.png`, `blog-1.jpg` through `blog-6.jpg`, `cta.png`, `flower.jpg`, `image-placeholder.png`, `service-slide-1.png`, `service-slide-2.png`, `service-slide-3.png`, `tooling.png`, all stock `.svg` icons (`cloud.svg`, `code.svg`, `love.svg`, `oop.svg`, `speedometer.svg`, `user-clock.svg`).

**Kept/replaced:** `favicon.png` (replace), `logo.png` (replace with Hecaton wordmark), `og-image.png` (replace with tagline design), `checkmark-circle.svg`, `arrow-right.svg`.

## 8. External services

### 8.1 Cal.com (booking)

- Create a Cal.com account and set up a 30-minute "Intro call — Hecaton" event type.
- Event URL: `cal.com/hecaton/intro` (or similar).
- Embed on `/contact` using Cal.com's inline widget (`<!-- Cal inline widget -->` script).
- Link also used on hero, final CTA, and `/contact/thanks`.
- Free tier is sufficient.

### 8.2 Web3Forms (fallback form)

- Register at `web3forms.com` with `jaime@hecaton.tech` — receive an access key by email.
- Access key embedded in `ContactForm.astro` as a hidden `<input>`. **Not secret** — it's client-side; Web3Forms uses it only to route submissions to the registered inbox. Safe to commit.
- Form posts to `https://api.web3forms.com/submit`.
- Hidden fields include `redirect=https://hecaton.tech/contact/thanks` and `botcheck` honeypot.
- Free tier (250 submissions/month) is far more than this site will ever need.

### 8.3 Umami Cloud (analytics)

- Sign up at `cloud.umami.is`, add `hecaton.tech` as a site, receive a website ID.
- Insert `<script defer src="https://cloud.umami.is/script.js" data-website-id="..."></script>` in `Base.astro` `<head>`.
- Free tier (10k events/month) is plenty.
- No cookies, GDPR-friendly. Privacy page mentions it.

## 9. Deployment — GitHub Pages

### 9.1 Build target

`astro build` outputs static HTML/CSS/JS to `dist/`. No SSR, no server runtime needed.

### 9.2 Repository setup

1. Push the repo to GitHub (existing remote is fine if Hecaton-owned; otherwise create a new repo under the Hecaton GitHub account and push).
2. In repo **Settings → Pages**: set source to **GitHub Actions**.
3. In **Settings → Pages → Custom domain**: enter `hecaton.tech`. GitHub will create a `CNAME` file in the repo root; we preempt this by including `public/CNAME` with the single line `hecaton.tech`.
4. Enable **Enforce HTTPS** once the TLS certificate provisions (takes a few minutes after DNS propagates).

### 9.3 DNS

At your registrar for `hecaton.tech`:
- Apex `A` records pointing to GitHub Pages IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `AAAA` records (optional, IPv6):
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- `CNAME www.hecaton.tech → <github-username>.github.io`

Verify with `dig hecaton.tech +short` after propagation.

### 9.4 GitHub Actions workflow (`.github/workflows/deploy.yml`)

Triggers on push to `main`. Steps:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20, cache `npm`)
3. `npm ci`
4. `npm run build`
5. `actions/upload-pages-artifact@v3` with `path: ./dist`
6. `actions/deploy-pages@v4`

Job permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 9.5 Repository secrets

**None required.**

The three external services all use public, client-side identifiers:
- Web3Forms access key — embedded in HTML, public by design.
- Umami website ID — embedded in `<script>` tag, public by design.
- Cal.com event URL — public link.

GitHub Pages deploy uses the auto-provided `GITHUB_TOKEN` via `id-token: write` permissions; no PAT or custom secret needed.

If at some point we add a service that requires a true secret (e.g. an analytics API key, a server-side integration), we'd add it under **Settings → Secrets and variables → Actions** and reference it in the workflow via `${{ secrets.NAME }}`. For launch, the secrets list is empty.

### 9.6 `astro.config.mjs` adjustments

- `site: "https://hecaton.tech"`
- `base: "/"` (apex domain, no subpath)
- `trailingSlash: "never"`
- Integrations stay the same minus the GTM one.

## 10. Accessibility & performance

- WCAG AA minimum: body text contrast ≥ 4.5:1 (off-white `#FAFAF7` on `#0A0A0A` passes ~19:1).
- All interactive elements keyboard-reachable with visible focus states (accent-lime focus ring).
- Form fields labelled; required fields indicated in text, not colour alone.
- `prefers-reduced-motion` disables non-essential animation.
- Lighthouse targets: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Images served via Astro's `<Image>` component (sharp), responsive `srcset`.
- Fonts preloaded via `astro-font`.

## 11. Out of scope for launch

- Blog / writing platform
- `/work` case studies page (deferred until Hecaton has real clients to feature)
- Sitepins CMS
- Multi-language versions (English only; ES/IT mentioned on About as working languages)
- Newsletter / email capture
- Dark/light mode toggle (dark only at launch)
- Server-side forms (happy path is fully client-side)
- A/B testing or experimentation

## 12. Open questions / future work

- OG image artwork — decide at implementation time (either a clean type-over-black render, or something more opinionated).
- Hecaton wordmark / logo — can launch with a typeset wordmark in Space Grotesk Bold; commission or iterate on a mark later.
- Case studies page (`/work`) to be added once Hecaton has closed engagements with client permission to write them up.
- Portrait photo for `/about` — needed from Jaime at implementation time.
