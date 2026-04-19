# Hecaton Consulting Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Bigspring Light Astro template into a production Hecaton Consulting marketing site deployed to GitHub Pages at `hecaton.tech`.

**Architecture:** Static Astro 5 site with Tailwind 4 theme tokens, dark-mode-first palette, Astro 5 native Fonts API (Space Grotesk / Inter / JetBrains Mono), content collections for homepage/engagements/about/contact/pages, Cal.com inline embed and Web3Forms fallback on `/contact`, Umami Cloud analytics, deployed via GitHub Actions (v4 artifact + deploy-pages actions).

**Tech Stack:** Astro 5.14, Tailwind 4, MDX, TypeScript, Zod, GitHub Pages, Cal.com embed, Web3Forms, Umami Cloud.

**Reference spec:** `docs/superpowers/specs/2026-04-18-hecaton-consulting-site-design.md`.

**Authoritative decisions driving this plan:**
- Remove `@astrojs/react`, `astro-auto-import`, `astro-font`, `astro-swiper`, `@digi4care/astro-google-tagmanager`, `@justinribeiro/lite-youtube`, `remark-collapse`, `remark-toc`, React deps, Sitepins config, Netlify config.
- Keep `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind 4, sharp, `date-fns` (if still imported) — drop if not.
- `trailingSlash: "always"` + `build.format: "directory"` — every internal link ends with `/`.
- Two productised engagements (Audit, Fractional); no `/blog`, `/pricing`, `/faq`, `/work`, `/elements` pages.
- Dark mode only. Palette: bg `#0A0A0A`, ink `#FAFAF7`, accent `#CCFF66`, muted `#A8A8A3`, border `#1F1F1F`.
- Form: native POST to `https://api.web3forms.com/submit` with `enctype="application/x-www-form-urlencoded"` and hidden `redirect` field → 302 to `/contact/thanks/`.
- Umami Cloud tracker: `<script defer src="https://cloud.umami.is/script.js" data-website-id="..."></script>`.
- Cal.com inline embed: loads `https://app.cal.com/embed/embed.js`, event URL `https://cal.com/hecaton/intro`, container `min-h-[700px]`.
- Deploy workflow pinned at `actions/upload-pages-artifact@v4` and `actions/deploy-pages@v4`.
- No repo secrets required at launch.

**Commit discipline:** Commit after every working task. Keep commits small and reviewable.

---

## File Structure

New files created by this plan:

```
.github/workflows/deploy.yml                 GitHub Pages deploy workflow
public/CNAME                                  custom-domain binding (hecaton.tech)
src/content/engagements/-index.md             engagements page content
src/content/about/-index.md                   about page content
src/content/pages/privacy.md                  privacy policy (rewritten)
src/content/pages/terms.md                    terms (rewritten)
src/layouts/components/MonoLabel.astro        monospace `> slug/name` decorator
src/layouts/components/CursorBlink.astro      CSS-animated blinking `_`
src/layouts/components/MetricStrip.astro      proof strip, monospace rules, lime numbers
src/layouts/components/EngagementCard.astro   engagement shape card
src/layouts/components/TrackRecordItem.astro  metric + role + employer-shape row
src/layouts/components/FaqStrip.astro         FAQ block (details/summary based)
src/layouts/components/CtaBlock.astro         full-width accent CTA block
src/layouts/components/CalEmbed.astro         Cal.com inline-embed wrapper
src/layouts/components/ContactForm.astro      Web3Forms-bound HTML form
src/layouts/components/Hero.astro             homepage hero
src/pages/contact/thanks.astro                post-submit confirmation page
docs/services-setup.md                        runbook for Cal.com / Web3Forms / Umami / Pages setup
```

Rewritten files:

```
astro.config.mjs                              drop React/auto-import, add Fonts API + trailing slash dir format
package.json                                  prune dependencies
src/config/config.json                        Hecaton identity, trailing_slash true
src/config/menu.json                          new nav + footer links
src/config/social.json                        github + linkedin only
src/config/theme.json                         dark palette + new fonts
src/content.config.ts                         drop blog/faq/pricing, add engagements + about, tighten homepage schema
src/content/homepage/-index.md                new homepage data
src/content/contact/-index.md                 new contact content
src/layouts/Base.astro                        dark theme, Umami tracker, drop GTM/astro-font/ClientRouter
src/layouts/partials/Header.astro             new nav, primary CTA button
src/layouts/partials/Footer.astro             simplified structure
src/layouts/components/Logo.astro             Hecaton wordmark
src/layouts/components/Social.astro           inline SVG icons (no DynamicIcon/React)
src/pages/index.astro                         homepage rewrite
src/pages/contact.astro                       Cal.com embed + ContactForm fallback
src/pages/404.astro                           restyled in dark palette
src/pages/[regular].astro                     keep (privacy/terms loader)
src/styles/main.css                           pare imports
src/styles/base.css                           dark-first base rules
src/styles/components.css                     remove blog/faq/pricing/tab/notice/accordion cruft
src/styles/buttons.css                        lime-accent buttons
src/styles/navigation.css                     dark nav styles
src/tailwind-plugin/tw-theme.mjs              no change needed — already handles darkmode group
```

Deleted files:

```
.sitepins/                                    Sitepins CMS config
netlify.toml                                  not deploying to Netlify
src/content/blog/                             entire blog collection content
src/content/faq/                              entire faq collection content
src/content/pricing/                          entire pricing collection content
src/layouts/Post.astro, SimilarPosts.astro, Pagination.astro, PostSingle.astro, Cta.astro, Base.astro (components/Base)
src/layouts/shortcodes/                       all shortcode TSX files
src/layouts/helpers/DynamicIcon.tsx           replaced by inline SVG
src/layouts/partials/PostSingle.astro         blog-only
src/pages/blog/, src/pages/faq.astro, src/pages/pricing.astro, src/pages/elements.astro  removed routes
public/images/banner-art.png, banner.png, blog-1..6.jpg, cta.png, flower.jpg, image-placeholder.png, service-slide-1..3.png, tooling.png, cloud.svg, code.svg, love.svg, oop.svg, speedometer.svg, user-clock.svg
```

---

## Phase 0 — Cleanup

Goal: strip the template down to a minimal skeleton before adding the new design. Every task ends with `npm run build` passing or — during deeper prunes — `npm run dev` still loading the home page without 500s.

### Task 0.1: Audit current branch and create working branch

**Files:**
- No changes yet — this task exists to lock in a clean starting point.

- [ ] **Step 1: Verify clean working tree**

Run:
```bash
git status
```
Expected: `nothing to commit, working tree clean`. If there is uncommitted work, stop and surface to the user before touching anything.

- [ ] **Step 2: Pull latest main**

Run:
```bash
git checkout main && git pull --ff-only
```
Expected: `Already up to date.` or fast-forward.

- [ ] **Step 3: Create feature branch**

Run:
```bash
git checkout -b feat/noissue/hecaton-site
```
Expected: `Switched to a new branch 'feat/noissue/hecaton-site'`.

- [ ] **Step 4: Install current deps so baseline build works**

Run:
```bash
npm install
```
Expected: installs without errors; lockfile may update for audit-level fixes — that's fine, it will all be replaced in Task 0.3.

- [ ] **Step 5: Baseline build**

Run:
```bash
npm run build
```
Expected: build completes (template's existing site builds). If it fails before any changes, stop — that's an environment problem to resolve with the user, not a plan problem.

---

### Task 0.2: Delete Sitepins / Netlify / unused config

**Files:**
- Delete: `.sitepins/` (entire directory)
- Delete: `netlify.toml`

- [ ] **Step 1: Remove Sitepins directory**

Run:
```bash
rm -rf .sitepins
```

- [ ] **Step 2: Remove netlify.toml**

Run:
```bash
rm -f netlify.toml
```

- [ ] **Step 3: Verify repo still builds**

Run:
```bash
npm run build
```
Expected: build passes (neither config affects the build).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove sitepins and netlify config"
```

---

### Task 0.3: Prune dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Rewrite package.json dependency lists**

Replace the full `package.json` with:

```json
{
  "name": "hecaton-website",
  "version": "0.1.0",
  "description": "Hecaton Consulting marketing site",
  "author": "Jaime Baldó",
  "license": "UNLICENSED",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "format": "prettier -w .",
    "check": "astro check",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "4.3.7",
    "@astrojs/sitemap": "^3.6.0",
    "@tailwindcss/vite": "^4.1.14",
    "astro": "5.14.4",
    "marked": "^16.4.0",
    "sharp": "0.34.4",
    "vite": "^7.1.9"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/typography": "^0.5.19",
    "prettier": "^3.6.2",
    "prettier-plugin-astro": "^0.14.1",
    "prettier-plugin-tailwindcss": "^0.6.14",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3"
  }
}
```

Changes vs. current: removed `@astrojs/react`, `@digi4care/astro-google-tagmanager`, `@justinribeiro/lite-youtube`, `astro-auto-import`, `astro-font`, `astro-swiper`, `date-fns`, `github-slugger`, `react`, `react-dom`, `react-icons`, `remark-collapse`, `remark-toc`, `@types/react`, `@types/react-dom`. Kept `marked` (used by `textConverter.ts`). `name` and metadata updated for Hecaton.

- [ ] **Step 2: Regenerate lockfile**

Run:
```bash
rm -rf node_modules package-lock.json && npm install
```
Expected: install completes. There will still be references in source files to removed packages — those are fixed in Tasks 0.4–0.6. A build will fail here; that is expected.

- [ ] **Step 3: Commit package.json + lockfile (build still broken)**

```bash
git add package.json package-lock.json
git commit -m "chore: prune unused npm dependencies"
```

---

### Task 0.4: Strip React/auto-import/GTM from astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Rewrite astro.config.mjs to minimal working config**

Replace the file with:

```js
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sharp from "sharp";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },
});
```

Changes vs. current: removed `react()`, `AutoImport()`, `remarkPlugins: [remarkToc, [remarkCollapse, ...]]`. (Fonts API will be added in Task 1.3 after fonts are confirmed.)

- [ ] **Step 2: Build will still fail on MDX shortcodes — that's fine, Task 0.5 deletes them**

No command to run here; proceed to 0.5.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "chore: simplify astro config, drop react and auto-imports"
```

---

### Task 0.5: Delete blog, shortcodes, helpers, template pages

**Files:**
- Delete: `src/content/blog/` (entire directory)
- Delete: `src/content/faq/` (entire directory)
- Delete: `src/content/pricing/` (entire directory)
- Delete: `src/layouts/shortcodes/` (entire directory)
- Delete: `src/layouts/helpers/DynamicIcon.tsx`
- Delete: `src/layouts/components/Pagination.astro`
- Delete: `src/layouts/components/Post.astro`
- Delete: `src/layouts/components/SimilarPosts.astro`
- Delete: `src/layouts/components/Cta.astro`
- Delete: `src/layouts/components/Base.astro` (duplicate — there is a stray `Base.astro` in `layouts/components/`; confirm with `ls` first)
- Delete: `src/layouts/partials/PostSingle.astro`
- Delete: `src/pages/blog/` (entire directory if present)
- Delete: `src/pages/faq.astro`
- Delete: `src/pages/pricing.astro`
- Delete: `src/pages/elements.astro` (if present)

- [ ] **Step 1: Confirm layout duplicates before deleting**

Run:
```bash
ls src/layouts/components/Base.astro src/layouts/components/Cta.astro src/layouts/components/Pagination.astro src/layouts/components/Post.astro src/layouts/components/SimilarPosts.astro 2>&1
```
Note which exist. Only delete the ones that do.

- [ ] **Step 2: Remove blog/faq/pricing content**

Run:
```bash
rm -rf src/content/blog src/content/faq src/content/pricing
```

- [ ] **Step 3: Remove shortcodes and helpers**

Run:
```bash
rm -rf src/layouts/shortcodes src/layouts/helpers
```

- [ ] **Step 4: Remove blog/list components and Cta template**

Run:
```bash
rm -f src/layouts/components/Pagination.astro src/layouts/components/Post.astro src/layouts/components/SimilarPosts.astro src/layouts/components/Cta.astro src/layouts/components/Base.astro src/layouts/partials/PostSingle.astro
```
(`src/layouts/components/Base.astro` — the `rm -f` is a no-op if it doesn't exist.)

- [ ] **Step 5: Remove blog/faq/pricing/elements pages**

Run:
```bash
rm -rf src/pages/blog
rm -f src/pages/faq.astro src/pages/pricing.astro src/pages/elements.astro
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete blog, shortcodes, helpers, and template-only pages"
```

---

### Task 0.6: Delete stock images and icons

**Files:**
- Delete (from `public/images/`): `banner-art.png`, `banner.png`, `blog-1.jpg` through `blog-6.jpg`, `cta.png`, `flower.jpg`, `image-placeholder.png`, `service-slide-1.png`, `service-slide-2.png`, `service-slide-3.png`, `tooling.png`, `cloud.svg`, `code.svg`, `love.svg`, `oop.svg`, `speedometer.svg`, `user-clock.svg`

- [ ] **Step 1: Delete stock assets**

Run:
```bash
cd public/images && rm -f banner-art.png banner.png blog-1.jpg blog-2.jpg blog-3.jpg blog-4.jpg blog-5.jpg blog-6.jpg cta.png flower.jpg image-placeholder.png service-slide-1.png service-slide-2.png service-slide-3.png tooling.png cloud.svg code.svg love.svg oop.svg speedometer.svg user-clock.svg && cd -
```

- [ ] **Step 2: Verify what's left**

Run:
```bash
ls public/images
```
Expected listing: `arrow-right.svg`, `checkmark-circle.svg`, `favicon.png`, `logo.png`, `og-image.png`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove stock template images and icons"
```

---

## Phase 1 — Foundation

Goal: dark palette, new fonts, new identity config, rebuilt `Base.astro`, clean CSS. After Phase 1 the site builds and renders a dark shell, but content is still placeholder template copy — that gets replaced in Phase 2.

### Task 1.1: Rewrite `src/config/config.json`

**Files:**
- Modify: `src/config/config.json`

- [ ] **Step 1: Replace config.json**

Replace the file with:

```json
{
  "site": {
    "title": "Hecaton",
    "base_url": "https://hecaton.tech",
    "base_path": "/",
    "trailing_slash": true,
    "favicon": "/images/favicon.png",
    "logo": "/images/logo.png",
    "logo_width": "200",
    "logo_height": "38",
    "logo_text": "Hecaton"
  },
  "settings": {
    "pagination": 4,
    "summary_length": 200
  },
  "nav_button": {
    "enable": true,
    "label": "Book a call",
    "link": "/contact/"
  },
  "params": {
    "contact_form_action": "https://api.web3forms.com/submit",
    "footer_content": "A fractional platform-engineering studio. You shipped fast. We'll make it last.",
    "copyright": "© Hecaton"
  },
  "metadata": {
    "meta_author": "Jaime Baldó",
    "meta_image": "/images/og-image.png",
    "meta_description": "Fractional platform engineering for scaling SaaS. Audit, rescue, and ongoing platform work."
  },
  "google_tag_manager": {
    "enable": false,
    "gtm_id": ""
  },
  "umami": {
    "enable": false,
    "website_id": "",
    "script_src": "https://cloud.umami.is/script.js"
  },
  "web3forms": {
    "access_key": "",
    "redirect_url": "https://hecaton.tech/contact/thanks/"
  },
  "cal_com": {
    "event_url": "https://cal.com/hecaton/intro",
    "embed_script": "https://app.cal.com/embed/embed.js"
  }
}
```

Note: `umami.enable` and `web3forms.access_key` stay empty in the repo — they are filled in during the services-setup runbook (Phase 6). `google_tag_manager` block retained as disabled for backwards compatibility with any remaining template code, but will be removed from `Base.astro` in Task 1.6.

- [ ] **Step 2: Commit**

```bash
git add src/config/config.json
git commit -m "feat: rewrite site config for hecaton identity"
```

---

### Task 1.2: Rewrite `src/config/theme.json` with dark palette and fonts

**Files:**
- Modify: `src/config/theme.json`

- [ ] **Step 1: Replace theme.json**

Replace the file with:

```json
{
  "colors": {
    "default": {
      "theme_color": {
        "primary": "#CCFF66",
        "body": "#0A0A0A",
        "border": "#1F1F1F",
        "light": "#141414"
      },
      "text_color": {
        "text": "#A8A8A3",
        "text-dark": "#FAFAF7"
      }
    }
  },
  "fonts": {
    "font_family": {
      "primary": "Space+Grotesk:wght@500;600;700",
      "primary_type": "sans-serif",
      "secondary": "Inter:wght@400;500",
      "secondary_type": "sans-serif",
      "mono": "JetBrains+Mono:wght@400;500",
      "mono_type": "monospace"
    },
    "font_size": {
      "base": "16",
      "scale": "1.25"
    }
  }
}
```

Notes:
- Maps the spec's palette to existing CSS-var names the template already consumes: `primary` → accent lime, `body` → page background, `border` → divider grey, `light` → subtle lift background, `text` → muted body, `text-dark` → ink (primary text).
- Three font families: primary (display Space Grotesk), secondary (body Inter), mono (JetBrains Mono for labels). `tw-theme.mjs` already iterates `font_family` keys and creates `font-primary`, `font-secondary`, `font-mono` utilities automatically.
- Scale bumped to 1.25 for a bigger display step between H1 and H6 (the hero wants clamp-based sizing anyway — handled in Task 1.7 CSS).

- [ ] **Step 2: Confirm tw-theme.mjs generates expected vars by building**

Run:
```bash
npm run build
```
Expected: build may still fail because of removed imports in `Base.astro` and stale `menu.json` etc. (we fix `Base.astro` in Task 1.6). If it fails only inside `Base.astro` / template files we know we're touching later, that's acceptable. If it fails inside `tw-theme.mjs` itself, stop and investigate — the color/font shape might need adjustment.

- [ ] **Step 3: Commit**

```bash
git add src/config/theme.json
git commit -m "feat: new dark palette and hecaton fonts"
```

---

### Task 1.3: Add Astro 5 Fonts API to `astro.config.mjs`

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add experimental.fonts config and trailing-slash directory output**

Replace `astro.config.mjs` with:

```js
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import sharp from "sharp";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: "always",
  build: { format: "directory" },
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap(), mdx()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Space Grotesk",
        cssVariable: "--font-primary-file",
        weights: ["500", "600", "700"],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-secondary-file",
        weights: ["400", "500"],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        provider: fontProviders.google(),
        name: "JetBrains Mono",
        cssVariable: "--font-mono-file",
        weights: ["400", "500"],
        styles: ["normal"],
        subsets: ["latin"],
      },
    ],
  },
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },
});
```

Key changes:
- `trailingSlash: "always"` + `build.format: "directory"` (hard-coded, not read from config — this is non-negotiable for GitHub Pages per the spec).
- `experimental.fonts` registers three font families via Google provider. Astro downloads font files at build time to `_astro/fonts/` and emits CSS with `@font-face src: local files`. The `cssVariable` strings are the CSS variables Astro will populate with the loaded-font font-family values (different names from our theme variables — we'll wire them together in CSS in Task 1.7).

- [ ] **Step 2: Run build to confirm Astro downloads fonts**

Run:
```bash
npm run build
```
Expected: build may fail inside page rendering, but before failing we should see log lines like `Downloading font: Space Grotesk` and no errors related to the `experimental.fonts` array. If the fonts config specifically errors out ("fontProviders is not exported", "unknown provider"), the Astro version doesn't support the API yet — verify `astro` is `5.14.4` or later.

- [ ] **Step 3: Add Fonts component to Base.astro**

This is done as part of Task 1.6. No edit here.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: enable astro fonts api for space grotesk, inter, jetbrains mono"
```

---

### Task 1.4: Rewrite `src/config/menu.json`

**Files:**
- Modify: `src/config/menu.json`

- [ ] **Step 1: Replace menu.json**

Replace with:

```json
{
  "main": [
    {
      "name": "Engagements",
      "url": "/engagements/"
    },
    {
      "name": "About",
      "url": "/about/"
    },
    {
      "name": "Contact",
      "url": "/contact/"
    }
  ],
  "footer": [
    {
      "name": "Services",
      "menu": [
        { "text": "Platform audit", "url": "/engagements/" },
        { "text": "Fractional platform", "url": "/engagements/" }
      ]
    },
    {
      "name": "Company",
      "menu": [
        { "text": "About", "url": "/about/" },
        { "text": "Contact", "url": "/contact/" }
      ]
    },
    {
      "name": "Legal",
      "menu": [
        { "text": "Privacy", "url": "/privacy/" },
        { "text": "Terms", "url": "/terms/" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/config/menu.json
git commit -m "feat: new nav and footer menu for hecaton ia"
```

---

### Task 1.5: Rewrite `src/config/social.json`

**Files:**
- Modify: `src/config/social.json`

- [ ] **Step 1: Replace social.json**

Replace with:

```json
{
  "main": [
    {
      "name": "GitHub",
      "icon": "github",
      "link": "https://github.com/jbaldodiego"
    },
    {
      "name": "LinkedIn",
      "icon": "linkedin",
      "link": "https://www.linkedin.com/in/jbaldodiego/"
    }
  ]
}
```

Notes:
- `icon` names are now plain slugs (`github`, `linkedin`) — the Social component in Task 3.2 switches them to inline SVG path lookups.
- GitHub and LinkedIn URLs are Jaime's personal profiles (from the CV). The org `Hecaton-Consulting` is the repo owner, but the LinkedIn / GitHub identity for "the person behind Hecaton" is `jbaldodiego` — this reinforces the principal-led framing.

- [ ] **Step 2: Commit**

```bash
git add src/config/social.json
git commit -m "feat: trim social icons to github + linkedin"
```

---

### Task 1.6: Rewrite `src/layouts/Base.astro`

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Replace Base.astro**

Replace the file with:

```astro
---
import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import Footer from "@/partials/Footer.astro";
import Header from "@/partials/Header.astro";
import "@/styles/main.css";
import { Font } from "astro:assets";

export interface Props {
  title?: string;
  meta_title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
}

const { title, meta_title, description, image, noindex, canonical } =
  Astro.props;

const pageTitle = plainify(
  meta_title ? meta_title : title ? title : config.site.title,
);
const pageDescription = plainify(
  description ? description : config.metadata.meta_description,
);
const ogImage = `${config.site.base_url}${image ? image : config.metadata.meta_image}`;
const canonicalHref =
  canonical ??
  new URL(Astro.url.pathname, config.site.base_url).toString();
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" href={config.site.favicon} />
    <meta name="generator" content={Astro.generator} />
    <meta name="theme-color" content="#0A0A0A" />

    <Font cssVariable="--font-primary-file" preload />
    <Font cssVariable="--font-secondary-file" preload />
    <Font cssVariable="--font-mono-file" />

    <title>{pageTitle}</title>
    <link rel="canonical" href={canonicalHref} />
    {noindex && <meta name="robots" content="noindex,nofollow" />}

    <meta name="description" content={pageDescription} />
    <meta name="author" content={config.metadata.meta_author} />

    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalHref} />
    <meta property="og:image" content={ogImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={pageDescription} />
    <meta name="twitter:image" content={ogImage} />

    {
      config.umami.enable && config.umami.website_id && (
        <script
          is:inline
          defer
          src={config.umami.script_src}
          data-website-id={config.umami.website_id}
        />
      )
    }
  </head>
  <body class="bg-body text-text font-secondary antialiased">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-body focus:px-3 focus:py-2"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

Key changes vs. current:
- Removed `astro-font`, `ClientRouter`, `TwSizeIndicator`, `GoogleTagmanager`.
- Added `<Font>` from `astro:assets` (Astro 5 native Fonts API — declared in `astro.config.mjs` Task 1.3).
- `<html class="dark">` unconditionally — dark-mode-first, no toggle.
- Umami tracker injected conditionally when `config.umami.enable` is true AND `website_id` is set (so empty strings don't produce a broken script tag in dev).
- Added a skip-to-content link (accessibility).
- Canonical URL uses `URL()` constructor so trailing slashes compose cleanly.

- [ ] **Step 2: Build to confirm page at least renders**

Run:
```bash
npm run build
```
Expected: may fail inside individual pages (they still reference old content collection shapes), but `Base.astro` itself should compile. If the failure is inside a `.astro` page file, that is expected and addressed in later tasks.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: rewrite base layout with astro fonts, umami, dark shell"
```

---

### Task 1.7: Overhaul base CSS for dark mode and typography

**Files:**
- Modify: `src/styles/main.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/buttons.css`
- Modify: `src/styles/navigation.css`

- [ ] **Step 1: Replace `src/styles/main.css`**

```css
@import "tailwindcss";
@plugin "../tailwind-plugin/tw-theme.mjs";
@plugin "../tailwind-plugin/tw-bs-grid.mjs";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

@import "./safe.css";
@import "./utilities.css";

@layer base {
  @import "./base.css";
}

@layer components {
  @import "./components.css";
  @import "./navigation.css";
  @import "./buttons.css";
}
```

(Kept identical to existing — it already imports what we need; we just rewrite the imported files.)

- [ ] **Step 2: Replace `src/styles/base.css`**

```css
html {
  @apply text-base;
}

body {
  @apply bg-body font-secondary font-normal leading-relaxed text-text;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: var(--color-primary);
  color: var(--color-body);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply font-primary font-semibold leading-tight text-text-dark;
}

h1,
.h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
}

h2,
.h2 {
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
}

h3,
.h3 {
  @apply text-h3-sm md:text-h3;
}

h4,
.h4 {
  @apply text-h4;
}

h5,
.h5 {
  @apply text-h5;
}

h6,
.h6 {
  @apply text-h6;
}

a {
  @apply underline decoration-transparent underline-offset-4 transition-colors;
}

a:hover,
a:focus-visible {
  @apply decoration-primary text-text-dark;
}

b,
strong {
  @apply font-semibold text-text-dark;
}

code,
pre,
kbd,
samp {
  @apply font-mono;
}

code {
  @apply rounded bg-light px-1.5 py-0.5 text-text-dark text-[0.9em];
}

*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Replace `src/styles/components.css`**

```css
.section {
  @apply py-24 md:py-32;
}

.container {
  @apply mx-auto! max-w-[1140px]! px-4!;
}

.social-icons {
  @apply flex flex-wrap gap-3;
  li {
    @apply inline-block;
    a {
      @apply block h-9 w-9 rounded-full border border-border text-center transition hover:border-primary hover:text-primary;

      svg {
        @apply m-auto h-9 w-4 fill-current;
      }
    }
  }
}

.content {
  @apply prose prose-invert max-w-none;
  @apply prose-headings:mt-[1em] prose-headings:mb-[0.5em] prose-headings:font-semibold prose-headings:text-text-dark prose-headings:font-primary;
  @apply prose-p:text-text;
  @apply prose-strong:text-text-dark;
  @apply prose-a:text-primary prose-a:no-underline hover:prose-a:underline;
  @apply prose-hr:border-border;
  @apply prose-blockquote:border-primary prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:text-text;
  @apply prose-code:text-primary prose-code:px-1 prose-code:bg-light prose-code:rounded;
  @apply prose-pre:rounded prose-pre:bg-light;
  @apply prose-li:text-text;
}

.mono-label {
  @apply font-mono text-sm text-primary tracking-wide;
}

.metric-number {
  @apply font-primary font-semibold text-text-dark;
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.015em;
}

.metric-rule {
  @apply font-mono text-xs text-text tracking-[0.2em] uppercase;
}

.engagement-card {
  @apply border border-border bg-light p-8 transition hover:border-primary;
}

.cursor-blink {
  display: inline-block;
  width: 0.6ch;
  background-color: currentColor;
  animation: cursor-blink 1.1s step-end infinite;
  vertical-align: baseline;
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-blink {
    animation: none;
    opacity: 1;
  }
}
```

Removed from previous file: card/col-recommended/faq-head/contact-list/swiper-pagination/notice/tab/accordion rules — none are used by the new design.

- [ ] **Step 4: Replace `src/styles/buttons.css`**

```css
.btn {
  @apply inline-flex items-center gap-2 font-primary font-semibold border px-6 py-3 leading-none transition-all;
}

.btn-primary {
  @apply bg-primary text-body border-primary;
}

.btn-primary:hover,
.btn-primary:focus-visible {
  @apply bg-transparent text-primary;
}

.btn-outline {
  @apply bg-transparent text-text-dark border-border;
}

.btn-outline:hover,
.btn-outline:focus-visible {
  @apply border-primary text-primary;
}
```

- [ ] **Step 5: Replace `src/styles/navigation.css`**

```css
.header {
  @apply border-b border-border bg-body/80 backdrop-blur-md sticky top-0 z-40;
}

.navbar {
  @apply relative flex flex-wrap items-center justify-between py-4;
}

.navbar-nav {
  @apply flex items-center gap-6;
}

.nav-link {
  @apply font-secondary text-sm text-text transition hover:text-text-dark;
}

.nav-link-active {
  @apply text-text-dark underline decoration-primary underline-offset-4;
}
```

- [ ] **Step 6: Build to confirm CSS compiles**

Run:
```bash
npm run build
```
Expected: Tailwind compiles the CSS; errors should now only come from page/component files that still reference removed content collection shapes (fixed in Phase 2).

- [ ] **Step 7: Commit**

```bash
git add src/styles/
git commit -m "feat: dark-mode base styles, new typography, lime accent components"
```

---

## Phase 2 — Content collections

Goal: rewrite `content.config.ts` to the new schema and populate markdown content files so every page has real copy to render in Phase 4.

### Task 2.1: Rewrite `src/content.config.ts`

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Replace content.config.ts**

```ts
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      tagline: z.string(),
      subhead: z.string(),
      primary_cta: z.object({
        label: z.string(),
        link: z.string(),
      }),
      secondary_cta: z.object({
        label: z.string(),
        link: z.string(),
      }),
    }),
    proof_strip: z.object({
      heading: z.string(),
      disclaimer: z.string(),
      metrics: z.array(
        z.object({
          metric: z.string(),
          context: z.string(),
        }),
      ),
    }),
    engagement_teasers: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      shapes: z.array(
        z.object({
          slug: z.string(),
          title: z.string(),
          premise: z.string(),
          link: z.string().default("/engagements/"),
        }),
      ),
    }),
    about_teaser: z.object({
      heading: z.string(),
      intro: z.string(),
      portrait: z.string(),
      credentials: z.array(z.string()),
      principal_line: z.string(),
      cta_label: z.string().default("More about Jaime"),
      cta_link: z.string().default("/about/"),
    }),
    final_cta: z.object({
      heading: z.string(),
      sub: z.string(),
      button_label: z.string(),
      button_link: z.string(),
    }),
  }),
});

const engagementsCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/engagements" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    intro: z.string(),
    capacity_note: z.string(),
    shapes: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        premise: z.string(),
        best_for: z.string(),
        scope: z.array(z.string()),
        duration: z.string(),
        outcome: z.string(),
        cta: z.object({
          label: z.string().default("Book a call"),
          link: z.string().default("/contact/"),
        }),
      }),
    ),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    portrait: z.string(),
    intro: z.string(),
    credentials_strip: z.array(z.string()),
    career_narrative: z.array(z.string()),
    track_record: z.array(
      z.object({
        metric: z.string(),
        role: z.string(),
        employer_shape: z.string(),
      }),
    ),
    how_i_work: z.array(z.string()),
    writing_links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    final_cta: z.object({
      heading: z.string(),
      button_label: z.string(),
      button_link: z.string(),
    }),
  }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heading: z.string(),
    sub: z.string(),
    cal_event_url: z.string(),
    cal_link_label: z.string(),
    form_heading: z.string(),
    form_intro: z.string(),
    email_line: z.string(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  homepage: homepageCollection,
  engagements: engagementsCollection,
  about: aboutCollection,
  contact: contactCollection,
  pages: pagesCollection,
};
```

Changes:
- Dropped `blog`, `pricing`, `faq` collections entirely.
- Added `engagements` and `about` collections with shapes from the spec §7.2.
- Rewrote `homepage` schema to match the new sections (`banner`, `proof_strip`, `engagement_teasers`, `about_teaser`, `final_cta`).
- Rewrote `contact` to match the new page copy.
- `pages` collection gets a proper loader (it had no loader before, which worked because `[regular].astro` used the old API — the new loader matches the pattern used elsewhere).

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: rewrite content collections for hecaton schema"
```

---

### Task 2.2: Rewrite `src/content/homepage/-index.md`

**Files:**
- Modify: `src/content/homepage/-index.md`

- [ ] **Step 1: Replace homepage content**

Replace the file with:

```markdown
---
banner:
  tagline: "You shipped fast. We'll make it last."
  subhead: "A fractional platform-engineering studio for scaling SaaS. We step into the chaos, document it, and leave you with the platform your team should've had."
  primary_cta:
    label: "Book a 30-min call"
    link: "/contact/"
  secondary_cta:
    label: "See engagements"
    link: "/engagements/"
proof_strip:
  heading: "SELECTED OUTCOMES FROM A DECADE OF PLATFORM WORK"
  disclaimer: "Drawn from a decade of platform work across employed roles — see About for full context."
  metrics:
    - metric: "52% AWS bill cut"
      context: "as SRE at a hospitality-tech Series B"
    - metric: "95% fewer outages"
      context: "as Senior DevOps at a mid-market SaaS"
    - metric: "SOC 2 + NF 525"
      context: "compliance delivered across two engagements"
    - metric: "70+ AWS accounts"
      context: "centralised observability as Senior Platform Engineer at a global BPO"
    - metric: "40% CI/CD spend cut"
      context: "pipeline refactor at the same BPO"
engagement_teasers:
  heading: "What we do"
  intro: "Two productised engagements. One boutique studio."
  shapes:
    - slug: "platform/audit"
      title: "Platform Audit & Roadmap"
      premise: "A fixed-scope sprint to map your infra, identify the sharpest pain, and leave you with a prioritised 6-month platform roadmap — plus quick-win fixes shipped in-band."
      link: "/engagements/"
    - slug: "platform/fractional"
      title: "Fractional Platform Engineer"
      premise: "Ongoing embedded platform capacity for teams that need senior infra work without hiring. Monthly retainer, 3-month minimum."
      link: "/engagements/"
about_teaser:
  heading: "Who's behind this"
  intro: "Hecaton is run by Jaime Baldó — a Senior Platform Engineer with a decade of infra work across employed roles. Spain-based, remote-first, quietly opinionated."
  portrait: "/images/jaime-portrait.jpg"
  credentials:
    - "Senior Platform Engineer"
    - "C2 English"
    - "remote, based in Spain"
  principal_line: "Hecaton is principal-led: you get Jaime on the keyboard, not a bench."
  cta_label: "More about Jaime"
  cta_link: "/about/"
final_cta:
  heading: "What's the worst part of your platform right now?"
  sub: "A 30-minute call costs nothing and usually leaves you with a clearer plan either way."
  button_label: "Book a call"
  button_link: "/contact/"
---
```

Note: `portrait: "/images/jaime-portrait.jpg"` — the image is a placeholder until Jaime provides one. Phase 6 runbook reminds the user to drop the real file there. Until then the site will render a broken-image glyph on that section — acceptable trade-off to unblock the build, and surfaced in Phase 7 QA.

- [ ] **Step 2: Commit**

```bash
git add src/content/homepage/-index.md
git commit -m "feat: hecaton homepage content"
```

---

### Task 2.3: Create `src/content/engagements/-index.md`

**Files:**
- Create: `src/content/engagements/-index.md`

- [ ] **Step 1: Create the engagements directory + content file**

```bash
mkdir -p src/content/engagements
```

Then create `src/content/engagements/-index.md`:

```markdown
---
title: "Engagements"
description: "Two productised platform-engineering engagements: Platform Audit & Roadmap and Fractional Platform Engineer."
intro: "Two productised engagements — shaped to match how platform work actually lands in scaling SaaS teams. Pick the one that fits, or book a call and we'll figure it out together."
capacity_note: "Currently taking one new retainer client at a time."
shapes:
  - slug: "platform/audit"
    title: "Platform Audit & Roadmap"
    premise: "A fixed-scope sprint to map your infra, identify the sharpest pain, and deliver a prioritised 6-month platform roadmap. Includes quick-win fixes shipped in-band."
    best_for: "Teams that know something is wrong but don't know where to start."
    scope:
      - "Cloud + CI/CD audit (AWS / GCP / Azure; GitHub Actions, GitLab, CircleCI)"
      - "IAM and security review"
      - "Cost audit with quantified opportunities"
      - "Observability gap analysis"
      - "6-month prioritised roadmap document"
      - "Quick-win fixes shipped during the engagement"
    duration: "3–4 weeks calendar, 40–60 hours of work"
    outcome: "You leave with a written plan, documented systems, and measurable quick wins in place."
    cta:
      label: "Book a call"
      link: "/contact/"
  - slug: "platform/fractional"
    title: "Fractional Platform Engineer"
    premise: "Ongoing embedded platform-engineering capacity for teams that need senior infra work without hiring."
    best_for: "Teams without a platform hire yet, or teams whose lone platform person is underwater."
    scope:
      - "IaC ecosystems (Terraform modules, self-serve repos)"
      - "CI/CD design, optimisation, cost reduction"
      - "Observability rollout (Grafana/Loki, CloudWatch, structured logging)"
      - "Security & compliance — SOC 2, NF 525 readiness, IAM overhauls"
      - "Cost optimisation (FinOps audits + ongoing reviews)"
      - "Documentation and runbooks"
      - "On-call uplift and incident review"
    duration: "10–20h/week, monthly retainer, 3-month minimum"
    outcome: "A platform that gets quietly better every month without derailing your product team."
    cta:
      label: "Book a call"
      link: "/contact/"
faqs:
  - question: "Do you work alone?"
    answer: "Yes. Hecaton is principal-led — Jaime on the keyboard. No bench, no handoffs."
  - question: "Can you work inside our VPC / with production access?"
    answer: "Yes, with the right controls. We establish least-privilege access, document it, and revoke it cleanly at end of engagement."
  - question: "What's your day rate?"
    answer: "It depends on engagement shape. Book a call and we'll scope it together."
  - question: "What's the notice period on the retainer?"
    answer: "30 days either side, after the 3-month minimum."
  - question: "Where are you based / timezone?"
    answer: "Spain (CET/CEST). Comfortable working async with teams from US East to APAC."
---
```

- [ ] **Step 2: Commit**

```bash
git add src/content/engagements
git commit -m "feat: engagements page content"
```

---

### Task 2.4: Create `src/content/about/-index.md`

**Files:**
- Create: `src/content/about/-index.md`

- [ ] **Step 1: Create the about directory + content file**

```bash
mkdir -p src/content/about
```

Then create `src/content/about/-index.md`:

```markdown
---
title: "About Jaime"
description: "Hecaton is run by Jaime Baldó, a Senior Platform Engineer with a decade of infra work across startups and global teams."
portrait: "/images/jaime-portrait.jpg"
intro: "I'm Jaime. I run Hecaton because I kept meeting teams who shipped product brilliantly and then drowned in their own infra. Hecaton is the studio I would have hired, five roles ago."
credentials_strip:
  - "Senior Platform Engineer"
  - "10+ years"
  - "C2 English"
  - "native Spanish"
  - "proficient Italian"
  - "remote, based in Spain"
career_narrative:
  - "I started in system administration — the unglamorous work of keeping other people's code running. That's where I learnt the habits that still show up in everything I build: document the system, automate the boring, own the outage."
  - "I moved into DevOps at ClickDimensions, then platform engineering at Eva Global and Amenitiz — a mix of mid-market SaaS, hospitality tech, and a global BPO. Terraform estates, multi-account AWS, SOC 2 and NF 525 compliance, observability rollouts, cost cuts that actually stuck. Different stacks, same underlying work: take the chaos, give it shape."
  - "I launched Hecaton because fractional work is honest work. Part-time, principal-led, no pretend team. If a client needs me, they get me. If they don't, I'm not upselling them a retainer."
track_record:
  - metric: "52% AWS bill cut"
    role: "SRE"
    employer_shape: "hospitality-tech Series B"
  - metric: "95% fewer outages"
    role: "Senior DevOps"
    employer_shape: "mid-market SaaS"
  - metric: "SOC 2 + NF 525"
    role: "Platform Engineer"
    employer_shape: "two separate engagements"
  - metric: "70+ AWS accounts"
    role: "Senior Platform Engineer"
    employer_shape: "global BPO"
  - metric: "40% CI/CD spend cut"
    role: "Senior Platform Engineer"
    employer_shape: "same global BPO"
  - metric: "3 incident-free launches"
    role: "SRE"
    employer_shape: "hospitality-tech Series B"
how_i_work:
  - "Document the system on the way in — every engagement leaves behind runbooks a new hire can read on day one."
  - "Infrastructure-as-code, always. If it only lives in a cloud console it doesn't exist."
  - "Outcome over output: fewer tickets closed, more problems that stop recurring."
  - "FinOps baked in, not bolted on — cost conversations happen while decisions are reversible."
  - "Opinionated but not dogmatic — I'll argue my case, then commit to your team's decision."
  - "No hand-holding. I manage my own work. You don't need to chase me for status."
writing_links: []
final_cta:
  heading: "Let's see if we're a fit."
  button_label: "Book a 30-min call"
  button_link: "/contact/"
---
```

Notes:
- `writing_links: []` — per the spec §6.3 hide-rule, empty array renders no Writing section. When Jaime wants to add LinkedIn/Medium posts, he fills in the array; no code change needed.
- `portrait: "/images/jaime-portrait.jpg"` — same placeholder image path as the homepage about teaser.

- [ ] **Step 2: Commit**

```bash
git add src/content/about
git commit -m "feat: about page content"
```

---

### Task 2.5: Rewrite `src/content/contact/-index.md`

**Files:**
- Modify: `src/content/contact/-index.md`

- [ ] **Step 1: Replace contact content**

```markdown
---
title: "Contact"
description: "Book a 30-minute intro call with Jaime, or drop a message and I'll get back within one business day."
heading: "Let's talk about your platform."
sub: "30-minute intro call, no pitch deck. Bring the mess."
cal_event_url: "https://cal.com/hecaton/intro"
cal_link_label: "Or pick a time: cal.com/hecaton/intro"
form_heading: "Prefer to send a message?"
form_intro: "I'll get back to you within one business day."
email_line: "Or email me directly: jaime@hecaton.tech"
---
```

- [ ] **Step 2: Commit**

```bash
git add src/content/contact/-index.md
git commit -m "feat: contact page content"
```

---

### Task 2.6: Rewrite `src/content/pages/privacy.md` and `src/content/pages/terms.md`

**Files:**
- Modify: `src/content/pages/privacy.md`
- Modify: `src/content/pages/terms.md`

- [ ] **Step 1: Replace privacy.md**

```markdown
---
title: "Privacy"
meta_title: "Privacy policy — Hecaton"
description: "How Hecaton handles the small amount of data this site collects."
---

Hecaton (the trading name of Jaime Baldó, based in Spain) operates this site. This page describes the limited data the site collects and what happens to it.

## Contact form

If you submit the form on `/contact/`, I receive:

- your name,
- your email address,
- optionally your company,
- and the message you wrote.

The form submits to **Web3Forms**, a third-party service that forwards submissions to my inbox at `jaime@hecaton.tech`. Web3Forms does not use this data for anything else; their privacy policy is at [web3forms.com/privacy](https://web3forms.com/privacy).

I keep message emails in my inbox and reply. If you want me to delete your message, email `jaime@hecaton.tech` and I will.

## Booking

The `/contact/` page embeds **Cal.com** so you can book a call. Cal.com is a third-party scheduling service. If you use the embedded widget, Cal.com receives the name, email, and any notes you enter — see [cal.com/privacy](https://cal.com/privacy).

## Analytics

The site uses **Umami Cloud** for basic privacy-friendly analytics. Umami does not set cookies, does not use any personal identifier, and does not cross-reference visitors across sites. I use it to see aggregate page views and understand roughly where visitors come from. See [umami.is/privacy](https://umami.is/privacy).

## What this site does not do

- No cookies.
- No third-party ad networks.
- No Google Analytics, no Facebook pixel, no tracking script beyond Umami.
- No newsletter or marketing email capture.

## Questions

Email `jaime@hecaton.tech`.
```

- [ ] **Step 2: Replace terms.md**

```markdown
---
title: "Terms"
meta_title: "Terms — Hecaton"
description: "Terms governing your use of the Hecaton website."
---

This site is provided by Hecaton (the trading name of Jaime Baldó, based in Spain).

## Site content

The content on this site — copy, metrics, engagement descriptions — is accurate to the best of my knowledge at the time of writing. Metrics attributed to prior roles reflect outcomes delivered while employed at those companies and are disclosed on the [About](/about/) page with full context.

## Contracts

Nothing on this site is a contract. Any work Hecaton does for a client is governed by a separate engagement agreement signed by both parties.

## No warranty

The site is provided "as is". I don't warrant that every link works, every external service is available, or that following any general guidance on the site will solve your specific infrastructure problem — that's what the engagement is for.

## Copyright

© Hecaton. Site design and copy are original; the code is based on the open-source Bigspring Light Astro template (MIT) with substantial rework.

## Contact

Email `jaime@hecaton.tech`.
```

- [ ] **Step 3: Remove any other old pages files**

Run:
```bash
ls src/content/pages/
```
Expected: `privacy.md`, `terms.md`, possibly `_index.md` or other stubs. Delete anything that isn't `privacy.md` or `terms.md`:

```bash
find src/content/pages -type f ! -name privacy.md ! -name terms.md -delete
```

- [ ] **Step 4: Commit**

```bash
git add src/content/pages/
git commit -m "feat: rewrite privacy and terms for hecaton"
```

---

## Phase 3 — Components

Goal: build the small component library the pages in Phase 4 will compose. Every new component is self-contained and requires no interactive JS except `CalEmbed` (which loads a third-party script).

### Task 3.1: `Logo.astro` — Hecaton wordmark

**Files:**
- Modify: `src/layouts/components/Logo.astro`

- [ ] **Step 1: Replace Logo.astro**

```astro
---
import config from "@/config/config.json";

export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---

<a href="/" aria-label={`${config.site.title} — home`} class={`font-primary font-semibold text-text-dark text-xl tracking-tight ${className}`}>
  <span>{config.site.logo_text}</span>
  <span class="text-primary" aria-hidden="true">.</span>
</a>
```

Typeset wordmark per spec §12 open-questions (launch with typeset, commission mark later). Accent lime dot gives it a small Hecaton flourish.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/Logo.astro
git commit -m "feat: typeset hecaton wordmark logo"
```

---

### Task 3.2: `Social.astro` — inline SVG icons (no React)

**Files:**
- Modify: `src/layouts/components/Social.astro`

- [ ] **Step 1: Replace Social.astro**

```astro
---
export interface ISocial {
  name: string;
  icon: string;
  link: string;
}

export interface Props {
  source: ISocial[];
  className?: string;
}

const { source, className = "" } = Astro.props;

const icons: Record<string, string> = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.77 5.46.77 11.73c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-1.88c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.99 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 2.99.72.79 1.16 1.8 1.16 3.03 0 4.32-2.64 5.28-5.15 5.56.41.35.77 1.04.77 2.1v3.11c0 .3.2.65.78.54 4.47-1.49 7.69-5.7 7.69-10.67C23.23 5.46 18.27.5 12 .5Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0Z"/></svg>',
};
---

<ul class={className}>
  {
    source.map((social) => (
      <li>
        <a
          aria-label={social.name}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="sr-only">{social.name}</span>
          <Fragment set:html={icons[social.icon] ?? ""} />
        </a>
      </li>
    ))
  }
</ul>
```

Changes: removed `DynamicIcon`/React dependency. Two inline SVG paths for github + linkedin (matches `social.json`). If a future icon is added, extend the `icons` record.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/Social.astro
git commit -m "feat: inline svg social icons, drop react dependency"
```

---

### Task 3.3: `MonoLabel.astro`

**Files:**
- Create: `src/layouts/components/MonoLabel.astro`

- [ ] **Step 1: Create MonoLabel.astro**

```astro
---
export interface Props {
  label: string;
  class?: string;
}

const { label, class: className = "" } = Astro.props;
---

<span class={`mono-label ${className}`}>&gt; {label}</span>
```

The `.mono-label` utility is defined in `components.css` (Task 1.7). Prints `> platform/audit` style decorators.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/MonoLabel.astro
git commit -m "feat: MonoLabel component"
```

---

### Task 3.4: `CursorBlink.astro`

**Files:**
- Create: `src/layouts/components/CursorBlink.astro`

- [ ] **Step 1: Create CursorBlink.astro**

```astro
---
export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---

<span class={`cursor-blink ${className}`} aria-hidden="true">&nbsp;</span>
```

The `.cursor-blink` keyframes and `prefers-reduced-motion` handling already live in `components.css` (Task 1.7).

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/CursorBlink.astro
git commit -m "feat: CursorBlink component"
```

---

### Task 3.5: `MetricStrip.astro`

**Files:**
- Create: `src/layouts/components/MetricStrip.astro`

- [ ] **Step 1: Create MetricStrip.astro**

```astro
---
export interface MetricItem {
  metric: string;
  context: string;
}

export interface Props {
  heading: string;
  metrics: MetricItem[];
  disclaimer?: string;
}

const { heading, metrics, disclaimer } = Astro.props;
---

<section class="section border-y border-border">
  <div class="container">
    <p class="metric-rule text-center mb-12">
      <span aria-hidden="true">─── </span>{heading}<span aria-hidden="true"> ───</span>
    </p>
    <ul class="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
      {
        metrics.map((item) => (
          <li>
            <p class="metric-number">{item.metric}</p>
            <p class="mt-2 text-sm text-text">{item.context}</p>
          </li>
        ))
      }
    </ul>
    {
      disclaimer && (
        <p class="mt-12 text-center text-xs text-text italic">{disclaimer}</p>
      )
    }
  </div>
</section>
```

Handles the spec's §6.1 "proof strip" — monospace rule decoration, grid of inline metric blocks, disclaimer line.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/MetricStrip.astro
git commit -m "feat: MetricStrip component"
```

---

### Task 3.6: `EngagementCard.astro`

**Files:**
- Create: `src/layouts/components/EngagementCard.astro`

- [ ] **Step 1: Create EngagementCard.astro**

```astro
---
import MonoLabel from "@/components/MonoLabel.astro";

export interface EngagementShape {
  slug: string;
  title: string;
  premise: string;
  best_for?: string;
  scope?: string[];
  duration?: string;
  outcome?: string;
  cta: {
    label: string;
    link: string;
  };
}

export interface Props {
  shape: EngagementShape;
  compact?: boolean;
}

const { shape, compact = false } = Astro.props;
---

<article class="engagement-card flex flex-col gap-6">
  <div class="flex flex-col gap-3">
    <MonoLabel label={shape.slug} />
    <h3 class="text-2xl md:text-3xl font-primary font-semibold text-text-dark">
      {shape.title}
    </h3>
    <p class="text-text">{shape.premise}</p>
  </div>

  {
    !compact && shape.best_for && (
      <div>
        <p class="mono-label mb-2">best_for</p>
        <p class="text-text">{shape.best_for}</p>
      </div>
    )
  }

  {
    !compact && shape.scope && shape.scope.length > 0 && (
      <div>
        <p class="mono-label mb-2">scope</p>
        <ul class="flex flex-col gap-2 text-text">
          {shape.scope.map((item) => (
            <li class="pl-4 border-l border-border">{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  {
    !compact && shape.duration && (
      <div>
        <p class="mono-label mb-2">duration</p>
        <p class="text-text">{shape.duration}</p>
      </div>
    )
  }

  {
    !compact && shape.outcome && (
      <div>
        <p class="mono-label mb-2">outcome</p>
        <p class="text-text">{shape.outcome}</p>
      </div>
    )
  }

  <div class="mt-auto">
    <a href={shape.cta.link} class="btn btn-primary">
      {shape.cta.label} <span aria-hidden="true">→</span>
    </a>
  </div>
</article>
```

`compact` prop lets the homepage teaser render without the scope/best_for/duration/outcome detail (homepage just wants slug + title + premise + link).

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/EngagementCard.astro
git commit -m "feat: EngagementCard component"
```

---

### Task 3.7: `TrackRecordItem.astro`

**Files:**
- Create: `src/layouts/components/TrackRecordItem.astro`

- [ ] **Step 1: Create TrackRecordItem.astro**

```astro
---
export interface Props {
  metric: string;
  role: string;
  employer_shape: string;
}

const { metric, role, employer_shape } = Astro.props;
---

<li class="flex flex-col gap-1 border-l border-border pl-4">
  <span class="metric-number text-2xl md:text-3xl">{metric}</span>
  <span class="text-sm text-text">as {role} at {employer_shape}</span>
</li>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/TrackRecordItem.astro
git commit -m "feat: TrackRecordItem component"
```

---

### Task 3.8: `FaqStrip.astro`

**Files:**
- Create: `src/layouts/components/FaqStrip.astro`

- [ ] **Step 1: Create FaqStrip.astro**

```astro
---
export interface FaqItem {
  question: string;
  answer: string;
}

export interface Props {
  heading?: string;
  faqs: FaqItem[];
}

const { heading = "Questions we hear a lot", faqs } = Astro.props;
---

<section class="section">
  <div class="container max-w-3xl!">
    <h2 class="mb-10">{heading}</h2>
    <ul class="flex flex-col divide-y divide-border border-y border-border">
      {
        faqs.map((item) => (
          <li>
            <details class="group py-6">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-6 font-primary font-semibold text-text-dark">
                <span>{item.question}</span>
                <span class="text-primary transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p class="mt-4 text-text">{item.answer}</p>
            </details>
          </li>
        ))
      }
    </ul>
  </div>
</section>
```

Uses native `<details>`/`<summary>` — zero JS, keyboard-accessible by default.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/FaqStrip.astro
git commit -m "feat: FaqStrip component using native details"
```

---

### Task 3.9: `CtaBlock.astro`

**Files:**
- Create: `src/layouts/components/CtaBlock.astro`

- [ ] **Step 1: Create CtaBlock.astro**

```astro
---
export interface Props {
  heading: string;
  sub?: string;
  button_label: string;
  button_link: string;
}

const { heading, sub, button_label, button_link } = Astro.props;
---

<section class="section">
  <div class="container">
    <div class="border border-border bg-light p-12 md:p-16 text-center">
      <h2 class="mb-4">{heading}</h2>
      {sub && <p class="mx-auto mb-8 max-w-2xl text-lg text-text">{sub}</p>}
      <a href={button_link} class="btn btn-primary">
        {button_label} <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/CtaBlock.astro
git commit -m "feat: CtaBlock component"
```

---

### Task 3.10: `CalEmbed.astro`

**Files:**
- Create: `src/layouts/components/CalEmbed.astro`

- [ ] **Step 1: Create CalEmbed.astro**

```astro
---
import config from "@/config/config.json";

export interface Props {
  calLink?: string;
  minHeight?: string;
}

const { calLink = config.cal_com.event_url, minHeight = "700px" } = Astro.props;

const calSlug = calLink.replace(/^https?:\/\/cal\.com\//, "");
---

<div
  id="cal-inline"
  class="w-full border border-border bg-light"
  style={`min-height: ${minHeight};`}
  data-cal-link={calSlug}
>
</div>

<script is:inline define:vars={{ embedSrc: config.cal_com.embed_script, calSlug }}>
  (function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
  })(window, embedSrc, "init");

  Cal("init", "intro", { origin: "https://cal.com" });
  Cal.ns.intro("inline", {
    elementOrSelector: "#cal-inline",
    calLink: calSlug,
    layout: "month_view",
  });
  Cal.ns.intro("ui", {
    theme: "dark",
    cssVarsPerTheme: { dark: { "cal-brand": "#CCFF66" } },
    hideEventTypeDetails: false,
    layout: "month_view",
  });
</script>
```

Notes:
- Loads `https://app.cal.com/embed/embed.js` (script URL from the spec §8.1). The bootstrap snippet is the official Cal.com embed pattern — it defers script loading until `Cal()` is called.
- `min-h-[700px]` is set via Tailwind arbitrary value so the container doesn't collapse before the iframe reports its height.
- Theme forced to dark, accent lime passed as the Cal brand colour for button styling inside the embed.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/CalEmbed.astro
git commit -m "feat: CalEmbed component with dark theme and lime brand"
```

---

### Task 3.11: `ContactForm.astro`

**Files:**
- Create: `src/layouts/components/ContactForm.astro`

- [ ] **Step 1: Create ContactForm.astro**

```astro
---
import config from "@/config/config.json";

const formAction = config.params.contact_form_action;
const accessKey = config.web3forms.access_key;
const redirectUrl = config.web3forms.redirect_url;
---

<form
  action={formAction}
  method="POST"
  enctype="application/x-www-form-urlencoded"
  class="flex flex-col gap-5"
>
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="hidden" name="redirect" value={redirectUrl} />
  <input type="hidden" name="subject" value="New Hecaton contact form submission" />
  <input type="hidden" name="from_name" value="hecaton.tech" />

  <input
    type="checkbox"
    name="botcheck"
    class="hidden"
    tabindex="-1"
    autocomplete="off"
    aria-hidden="true"
  />

  <label class="flex flex-col gap-2">
    <span class="mono-label">name <span class="text-text">(required)</span></span>
    <input
      type="text"
      name="name"
      required
      autocomplete="name"
      class="w-full border border-border bg-light px-4 py-3 text-text-dark focus:border-primary focus:outline-none"
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="mono-label">email <span class="text-text">(required)</span></span>
    <input
      type="email"
      name="email"
      required
      autocomplete="email"
      class="w-full border border-border bg-light px-4 py-3 text-text-dark focus:border-primary focus:outline-none"
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="mono-label">company</span>
    <input
      type="text"
      name="company"
      autocomplete="organization"
      class="w-full border border-border bg-light px-4 py-3 text-text-dark focus:border-primary focus:outline-none"
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="mono-label">what's broken? <span class="text-text">(required)</span></span>
    <textarea
      name="message"
      required
      rows="6"
      class="w-full border border-border bg-light px-4 py-3 text-text-dark focus:border-primary focus:outline-none"
    ></textarea>
  </label>

  <button type="submit" class="btn btn-primary self-start">
    Send message <span aria-hidden="true">→</span>
  </button>
</form>
```

Form contract per spec §6.4 and §8.2:
- Native `POST` with `enctype="application/x-www-form-urlencoded"` (not JSON) — avoids Web3Forms' documented CORS issue.
- Hidden `access_key`, `redirect`, and `botcheck` fields.
- Subject/from_name fields are niceties so inbox email is recognisable.
- `access_key` comes from `config.json` — stays empty in repo until Phase 6 runbook fills it in.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/ContactForm.astro
git commit -m "feat: ContactForm with native post to web3forms"
```

---

### Task 3.12: `Hero.astro`

**Files:**
- Create: `src/layouts/components/Hero.astro`

- [ ] **Step 1: Create Hero.astro**

```astro
---
import CursorBlink from "@/components/CursorBlink.astro";

export interface Props {
  tagline: string;
  subhead: string;
  primary: { label: string; link: string };
  secondary: { label: string; link: string };
}

const { tagline, subhead, primary, secondary } = Astro.props;
---

<section class="section pt-32 md:pt-40">
  <div class="container">
    <h1 class="max-w-5xl">
      {tagline}<CursorBlink />
    </h1>
    <p class="mt-8 max-w-2xl text-lg md:text-xl text-text">{subhead}</p>
    <div class="mt-12 flex flex-wrap gap-4">
      <a href={primary.link} class="btn btn-primary">
        {primary.label} <span aria-hidden="true">→</span>
      </a>
      <a href={secondary.link} class="btn btn-outline">
        {secondary.label}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/components/Hero.astro
git commit -m "feat: Hero component with blinking cursor flourish"
```

---

### Task 3.13: Rewrite `Header.astro`

**Files:**
- Modify: `src/layouts/partials/Header.astro`

- [ ] **Step 1: Replace Header.astro**

```astro
---
import Logo from "@/components/Logo.astro";
import config from "@/config/config.json";
import menu from "@/config/menu.json";

const pathname = Astro.url.pathname;
const { nav_button } = config;
---

<header class="header">
  <nav class="navbar container" aria-label="Main">
    <Logo />

    <input id="nav-toggle" type="checkbox" class="peer hidden" />
    <label
      for="nav-toggle"
      class="order-2 cursor-pointer md:hidden"
      aria-label="Toggle navigation"
    >
      <svg class="h-6 w-6 fill-current" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
      </svg>
    </label>

    <ul
      class="navbar-nav order-3 hidden w-full peer-checked:flex peer-checked:flex-col md:order-1 md:flex md:w-auto md:flex-row"
    >
      {
        menu.main.map((item) => (
          <li>
            <a
              href={item.url}
              class={`nav-link ${pathname === item.url ? "nav-link-active" : ""}`}
            >
              {item.name}
            </a>
          </li>
        ))
      }
      {
        nav_button.enable && (
          <li class="mt-4 md:mt-0 md:ml-6">
            <a class="btn btn-primary" href={nav_button.link}>
              {nav_button.label} <span aria-hidden="true">→</span>
            </a>
          </li>
        )
      }
    </ul>
  </nav>
</header>
```

Zero-JS mobile nav via `peer-checked` — keeps the template's hidden checkbox pattern but simplifies the class juggling.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/partials/Header.astro
git commit -m "feat: header with new nav, mobile toggle, book-a-call button"
```

---

### Task 3.14: Rewrite `Footer.astro`

**Files:**
- Modify: `src/layouts/partials/Footer.astro`

- [ ] **Step 1: Replace Footer.astro**

```astro
---
import Logo from "@/components/Logo.astro";
import Social from "@/components/Social.astro";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
---

<footer class="border-t border-border pt-16 pb-8">
  <div class="container">
    <div class="grid grid-cols-1 gap-12 md:grid-cols-4">
      <div class="md:col-span-2">
        <Logo />
        <p class="mt-4 max-w-sm text-text">{config.params.footer_content}</p>
        <Social source={social.main} className="social-icons mt-6" />
      </div>
      {
        menu.footer.map((col) => (
          <div>
            <h3 class="h5 font-primary font-semibold text-text-dark">{col.name}</h3>
            <ul class="mt-4 flex flex-col gap-2">
              {col.menu.map((item) => (
                <li>
                  <a href={item.url} class="text-text hover:text-text-dark">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      }
    </div>

    <div class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
      <p class="text-sm text-text">{config.params.copyright}</p>
      <p class="mono-label">You shipped fast. We'll make it last.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/partials/Footer.astro
git commit -m "feat: simplified dark footer with tagline sign-off"
```

---

## Phase 4 — Pages

Goal: compose the components into live pages. After Phase 4 `npm run build` produces the full static site.

### Task 4.1: Rewrite `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace index.astro**

```astro
---
import Base from "@/layouts/Base.astro";
import Hero from "@/components/Hero.astro";
import MetricStrip from "@/components/MetricStrip.astro";
import EngagementCard from "@/components/EngagementCard.astro";
import CtaBlock from "@/components/CtaBlock.astro";
import MonoLabel from "@/components/MonoLabel.astro";
import { Image } from "astro:assets";
import { getEntry } from "astro:content";

const homepage = await getEntry("homepage", "-index");
if (!homepage) throw new Error("homepage/-index.md content entry not found");

const {
  banner,
  proof_strip,
  engagement_teasers,
  about_teaser,
  final_cta,
} = homepage.data;
---

<Base>
  <Hero
    tagline={banner.tagline}
    subhead={banner.subhead}
    primary={banner.primary_cta}
    secondary={banner.secondary_cta}
  />

  <MetricStrip
    heading={proof_strip.heading}
    metrics={proof_strip.metrics}
    disclaimer={proof_strip.disclaimer}
  />

  <section class="section">
    <div class="container">
      <h2 class="mb-4">{engagement_teasers.heading}</h2>
      {engagement_teasers.intro && (
        <p class="mb-12 max-w-2xl text-lg text-text">{engagement_teasers.intro}</p>
      )}
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        {
          engagement_teasers.shapes.map((shape) => (
            <EngagementCard
              shape={{
                slug: shape.slug,
                title: shape.title,
                premise: shape.premise,
                cta: { label: "Learn more", link: shape.link },
              }}
              compact
            />
          ))
        }
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr] md:gap-16 items-start">
        <div>
          <Image
            src={about_teaser.portrait}
            alt="Jaime Baldó portrait"
            width={480}
            height={600}
            class="border border-border"
          />
        </div>
        <div>
          <h2 class="mb-4">{about_teaser.heading}</h2>
          <p class="mb-6 text-text">{about_teaser.intro}</p>
          <MonoLabel label={about_teaser.credentials.join(" · ")} />
          <p class="mt-6 text-text-dark">{about_teaser.principal_line}</p>
          <a href={about_teaser.cta_link} class="btn btn-outline mt-8">
            {about_teaser.cta_label} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <CtaBlock
    heading={final_cta.heading}
    sub={final_cta.sub}
    button_label={final_cta.button_label}
    button_link={final_cta.button_link}
  />
</Base>
```

Notes:
- `getEntry("homepage", "-index")` — the slug is `-index` because the glob pattern is `**/-*.{md,mdx}` and the file name is `-index.md`. Astro's content-collections strip the leading dash behaviour for slugs… verify at build time (Step 2). If the slug is different, adjust the `getEntry` call accordingly.
- Portrait image — if `/images/jaime-portrait.jpg` doesn't exist yet, Astro's `<Image>` will error. Use `<img>` as a fallback in dev or drop a placeholder until Phase 6.

- [ ] **Step 2: Build & verify slug**

Run:
```bash
npm run build
```
If build fails with "entry not found", inspect the actual entry id with a temporary `console.log` in the page or check `dist/`/`.astro/` for the collection cache. Adjust `getEntry("homepage", "<actual-slug>")` accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rewrite homepage with hero, metrics, engagements teaser, about teaser, cta"
```

---

### Task 4.2: Create `src/pages/engagements.astro`

**Files:**
- Create: `src/pages/engagements.astro`

- [ ] **Step 1: Create engagements.astro**

Since `trailingSlash: "always"` and `build.format: "directory"` are set, both `src/pages/engagements.astro` and `src/pages/engagements/index.astro` emit to `/engagements/`. Using the flat filename is simpler; Astro handles the directory output.

```astro
---
import Base from "@/layouts/Base.astro";
import EngagementCard from "@/components/EngagementCard.astro";
import FaqStrip from "@/components/FaqStrip.astro";
import CtaBlock from "@/components/CtaBlock.astro";
import MonoLabel from "@/components/MonoLabel.astro";
import { getEntry } from "astro:content";

const entry = await getEntry("engagements", "-index");
if (!entry) throw new Error("engagements/-index.md content entry not found");

const { title, description, intro, capacity_note, shapes, faqs } = entry.data;
---

<Base title={title} description={description}>
  <section class="section pt-32 md:pt-40">
    <div class="container">
      <h1>Engagements</h1>
      <p class="mt-6 max-w-2xl text-lg text-text">{intro}</p>
      <div class="mt-10">
        <MonoLabel label="capacity" />
        <p class="mt-2 text-text-dark">{capacity_note}</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        {shapes.map((shape) => <EngagementCard shape={shape} />)}
      </div>
    </div>
  </section>

  <FaqStrip faqs={faqs} />

  <CtaBlock
    heading="Not sure which shape fits?"
    sub="Book a call and we'll work it out together."
    button_label="Book a call"
    button_link="/contact/"
  />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/engagements.astro
git commit -m "feat: engagements page"
```

---

### Task 4.3: Create `src/pages/about.astro`

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

```astro
---
import Base from "@/layouts/Base.astro";
import TrackRecordItem from "@/components/TrackRecordItem.astro";
import CtaBlock from "@/components/CtaBlock.astro";
import MonoLabel from "@/components/MonoLabel.astro";
import { Image } from "astro:assets";
import { getEntry } from "astro:content";

const entry = await getEntry("about", "-index");
if (!entry) throw new Error("about/-index.md content entry not found");

const {
  title,
  description,
  portrait,
  intro,
  credentials_strip,
  career_narrative,
  track_record,
  how_i_work,
  writing_links,
  final_cta,
} = entry.data;
---

<Base title={title} description={description}>
  <section class="section pt-32 md:pt-40">
    <div class="container">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr] md:gap-16 items-start">
        <div>
          <Image
            src={portrait}
            alt="Portrait of Jaime Baldó"
            width={480}
            height={600}
            class="border border-border"
          />
        </div>
        <div>
          <h1>About Jaime</h1>
          <p class="mt-6 text-lg text-text">{intro}</p>
          <div class="mt-8">
            <MonoLabel label={credentials_strip.join(" · ")} />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container max-w-3xl!">
      <h2 class="mb-8">How I got here</h2>
      <div class="flex flex-col gap-6 text-text">
        {career_narrative.map((p) => <p>{p}</p>)}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="mb-4">Track record</h2>
      <p class="mb-10 max-w-2xl text-text">
        Outcomes from a decade of platform work across employed roles — anonymised by employer shape, named by my role at the time.
      </p>
      <ul class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {
          track_record.map((item) => (
            <TrackRecordItem
              metric={item.metric}
              role={item.role}
              employer_shape={item.employer_shape}
            />
          ))
        }
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container max-w-3xl!">
      <h2 class="mb-8">How I work</h2>
      <ul class="flex flex-col gap-4 text-text">
        {how_i_work.map((item) => (
          <li class="pl-4 border-l border-border">{item}</li>
        ))}
      </ul>
    </div>
  </section>

  {
    writing_links.length > 0 && (
      <section class="section">
        <div class="container max-w-3xl!">
          <h2 class="mb-8">Writing</h2>
          <ul class="flex flex-col gap-3">
            {writing_links.map((link) => (
              <li>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-text-dark hover:text-primary"
                >
                  {link.label} <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  <CtaBlock
    heading={final_cta.heading}
    button_label={final_cta.button_label}
    button_link={final_cta.button_link}
  />
</Base>
```

The `{writing_links.length > 0 && ...}` conditional implements the spec §6.3 hide-rule.

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: about page with track record, manifesto, hide-rule writing section"
```

---

### Task 4.4: Rewrite `src/pages/contact.astro`

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Replace contact.astro**

```astro
---
import Base from "@/layouts/Base.astro";
import CalEmbed from "@/components/CalEmbed.astro";
import ContactForm from "@/components/ContactForm.astro";
import { getEntry } from "astro:content";

const entry = await getEntry("contact", "-index");
if (!entry) throw new Error("contact/-index.md content entry not found");

const {
  title,
  description,
  heading,
  sub,
  cal_event_url,
  cal_link_label,
  form_heading,
  form_intro,
  email_line,
} = entry.data;
---

<Base title={title} description={description}>
  <section class="section pt-32 md:pt-40">
    <div class="container">
      <h1>{heading}</h1>
      <p class="mt-6 max-w-2xl text-lg text-text">{sub}</p>
    </div>
  </section>

  <section class="pb-16">
    <div class="container">
      <CalEmbed calLink={cal_event_url} />
      <p class="mt-4 text-sm text-text">
        <a href={cal_event_url} target="_blank" rel="noopener noreferrer" class="text-primary">
          {cal_link_label}
        </a>
      </p>
    </div>
  </section>

  <section class="section border-t border-border">
    <div class="container max-w-2xl!">
      <h2 class="mb-2">{form_heading}</h2>
      <p class="mb-8 text-text">{form_intro}</p>
      <ContactForm />
      <p class="mt-10 text-sm text-text">{email_line}</p>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: contact page with cal embed and web3forms fallback"
```

---

### Task 4.5: Create `src/pages/contact/thanks.astro`

**Files:**
- Create: `src/pages/contact/thanks.astro`

- [ ] **Step 1: Create the thanks page**

```bash
mkdir -p src/pages/contact
```

Then create `src/pages/contact/thanks.astro`:

```astro
---
import Base from "@/layouts/Base.astro";
import config from "@/config/config.json";

const calEventUrl = config.cal_com.event_url;
---

<Base
  title="Thanks"
  description="Message received — I'll get back to you within one business day."
  noindex
>
  <section class="section pt-32 md:pt-40">
    <div class="container max-w-2xl!">
      <h1>Thanks — message received.</h1>
      <p class="mt-6 text-lg text-text">
        I'll get back to you within one business day. In the meantime, if you'd
        rather just pick a time, here's my calendar.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a href={calEventUrl} class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Book a call <span aria-hidden="true">→</span>
        </a>
        <a href="/" class="btn btn-outline">Back to home</a>
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact/thanks.astro
git commit -m "feat: contact thanks confirmation page"
```

---

### Task 4.6: Rewrite `src/pages/404.astro`

**Files:**
- Modify: `src/pages/404.astro`

- [ ] **Step 1: Replace 404.astro**

```astro
---
import Base from "@/layouts/Base.astro";
---

<Base title="Not found" description="Page not found" noindex>
  <section class="section pt-32 md:pt-40">
    <div class="container max-w-2xl!">
      <p class="mono-label">error/404</p>
      <h1 class="mt-4">This page doesn't exist. Unlike your AWS bill.</h1>
      <p class="mt-8 text-lg text-text">
        The link might be wrong, the page may have moved, or I broke something.
        Head home and we'll start over.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a href="/" class="btn btn-primary">Back to home</a>
        <a href="/contact/" class="btn btn-outline">Contact</a>
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: restyle 404 in dark palette"
```

---

### Task 4.7: Verify `[regular].astro` still renders privacy + terms

**Files:**
- Read: `src/pages/[regular].astro`

- [ ] **Step 1: Inspect the file**

Run:
```bash
cat src/pages/[regular].astro
```

Expected: it reads from the `pages` collection and renders each entry at its slug. If it references `getCollection("pages")`, the new content.config.ts (Task 2.1) already supports it. If it uses the older `getEntry`-by-id pattern, it should still work since the file names `privacy.md` and `terms.md` are unchanged.

- [ ] **Step 2: If the file is broken (references removed symbols), rewrite it**

Minimal rewrite if needed:

```astro
---
import Base from "@/layouts/Base.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const pages = await getCollection("pages");
  return pages.map((page) => ({
    params: { regular: page.id },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await render(page);
---

<Base title={page.data.title} meta_title={page.data.meta_title} description={page.data.description}>
  <section class="section pt-32 md:pt-40">
    <div class="container max-w-3xl!">
      <h1>{page.data.title}</h1>
      <div class="content mt-10">
        <Content />
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 3: Build and verify /privacy/ and /terms/ emit**

Run:
```bash
npm run build
ls dist/privacy dist/terms 2>&1 | head
```
Expected: `dist/privacy/index.html` and `dist/terms/index.html` exist.

- [ ] **Step 4: Commit only if rewrite was needed**

```bash
git add src/pages/[regular].astro
git commit -m "fix: adapt pages route to new content config"
```

If no changes were needed, skip the commit.

---

### Task 4.8: Full-site build green

**Files:**
- None — verification task.

- [ ] **Step 1: Clean build**

Run:
```bash
rm -rf dist && npm run build
```
Expected: build completes with no errors. `dist/` should contain `index.html`, `engagements/index.html`, `about/index.html`, `contact/index.html`, `contact/thanks/index.html`, `privacy/index.html`, `terms/index.html`, `404.html`, and `sitemap-*.xml`.

- [ ] **Step 2: Preview locally**

Run:
```bash
npm run preview
```
Open `http://localhost:4321/` in a browser. Click through every page. Note any visual issues — address in Phase 7 QA.

Stop preview with Ctrl-C.

- [ ] **Step 3: Commit any fixes made in this task**

If inline fixes were needed during the build:
```bash
git add -A
git commit -m "fix: build-green cleanup"
```

---

## Phase 5 — Deploy

Goal: GitHub Pages configuration and Actions workflow that pushes every merge to `main` live to `hecaton.tech`.

### Task 5.1: Create `public/CNAME`

**Files:**
- Create: `public/CNAME`

- [ ] **Step 1: Create CNAME with apex domain**

```bash
echo -n "hecaton.tech" > public/CNAME
```

File content (single line, no trailing newline):
```
hecaton.tech
```

Anything in `public/` ships as-is into `dist/`, so every deploy re-plants the custom-domain binding.

- [ ] **Step 2: Commit**

```bash
git add public/CNAME
git commit -m "feat: bind pages deploy to hecaton.tech via CNAME"
```

---

### Task 5.2: Create `.github/workflows/deploy.yml`

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Make sure `.github/workflows/` exists**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          PUBLIC_UMAMI_WEBSITE_ID: ${{ vars.UMAMI_WEBSITE_ID }}

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notes:
- `actions/upload-pages-artifact@v4` and `actions/deploy-pages@v4` per spec §9.4 (v3 was deprecated 30 Jan 2025).
- `concurrency` block required — without it overlapping pushes race and fail.
- `PUBLIC_UMAMI_WEBSITE_ID` env var is included as a forward-compatible hook in case the site later wants to inject Umami via `import.meta.env` instead of config.json. For launch the site reads from `config.json`, so this var is a no-op; repo variable can be created when Umami is wired up.
- No `secrets.*` references because launch requires none.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy astro site to github pages via actions v4"
```

---

### Task 5.3: Push branch and open PR

**Files:**
- None — git ops.

- [ ] **Step 1: Push branch to origin**

Run:
```bash
git push -u origin feat/noissue/hecaton-site
```
Expected: push succeeds to `github.com/Hecaton-Consulting/website`.

- [ ] **Step 2: Open PR**

Run:
```bash
gh pr create --title "feat/noissue/hecaton-site-initial-build" --body "$(cat <<'EOF'
## Summary
- Strip Bigspring Light template down to a minimal Astro 5 + Tailwind 4 base
- Introduce dark-mode-first palette, Space Grotesk / Inter / JetBrains Mono via Astro 5 native Fonts API
- New content collections: `homepage`, `engagements`, `about`, `contact`, `pages`
- New pages: `/`, `/engagements/`, `/about/`, `/contact/`, `/contact/thanks/`, `/privacy/`, `/terms/`, `/404`
- GitHub Pages deploy via Actions (v4 upload + deploy-pages)

## Test plan
- [ ] `npm run build` succeeds locally
- [ ] `npm run preview` renders every page in a browser
- [ ] GitHub Pages deploy green on first push to main
- [ ] Custom domain `hecaton.tech` resolves and serves HTTPS after DNS propagation
- [ ] Cal.com embed loads on `/contact/`
- [ ] Web3Forms submission lands in `jaime@hecaton.tech` after access key is set
- [ ] Umami Cloud tracker fires after website ID is set
- [ ] Lighthouse Performance/Accessibility/Best-Practices/SEO all ≥ 95
EOF
)"
```

Do NOT merge yet — the services setup in Phase 6 needs to happen first, and the first deploy needs monitoring (Phase 7 Task 7.3). The PR exists to capture the change for review.

---

## Phase 6 — External services runbook

Goal: document the manual steps the user (Jaime) needs to perform in third-party dashboards, and wire the resulting identifiers back into `config.json`. This is a runbook file committed to the repo so future-Jaime (or a successor) has a record.

### Task 6.1: Write `docs/services-setup.md`

**Files:**
- Create: `docs/services-setup.md`

- [ ] **Step 1: Create the runbook**

```bash
mkdir -p docs
```

Then create `docs/services-setup.md`:

```markdown
# Services setup

External services the Hecaton site depends on, and exactly how to wire them up. None of these require GitHub repo secrets — every identifier is public-by-design (embedded in HTML or scripts on the client side).

## 1. Cal.com (booking)

1. Sign up at https://cal.com with the email `jaime@hecaton.tech`.
2. Set the organisation slug to `hecaton` (confirm it's available; if not, pick an alternative and update `config.cal_com.event_url` in `src/config/config.json` and every hard-coded reference in content files).
3. Create a 30-minute event type named **"Intro call — Hecaton"** with slug `intro`.
4. Confirm the canonical URL is `https://cal.com/hecaton/intro`.
5. In `src/config/config.json`, ensure `cal_com.event_url` matches.
6. No code changes needed — the embed is already wired up.

## 2. Web3Forms (fallback form)

1. Go to https://web3forms.com/ and request an access key using `jaime@hecaton.tech` (free tier: 250 submissions/month).
2. Open the activation email and click the confirm link. You'll receive an access key string.
3. Paste the access key into `src/config/config.json` under `web3forms.access_key`.
4. Confirm `web3forms.redirect_url` is `https://hecaton.tech/contact/thanks/` (trailing slash required — the build emits directories).
5. Commit the change on a feature branch and deploy.
6. Test: open `/contact/`, submit the form with test values, confirm:
   - browser redirects to `/contact/thanks/`
   - email arrives at `jaime@hecaton.tech`
7. If the redirect goes to a Web3Forms-hosted "thanks" page instead of your domain, the `redirect` field is being stripped — check that the form has `enctype="application/x-www-form-urlencoded"` (not `multipart/form-data`) and that there's no JS intercepting the submit.

**The access key is NOT a secret.** It's embedded client-side in HTML. Web3Forms uses it purely to route submissions to the registered inbox. Safe to commit.

## 3. Umami Cloud (analytics)

1. Sign up at https://cloud.umami.is with `jaime@hecaton.tech` (free tier: 10k events/month).
2. Add a new site called "Hecaton" with domain `hecaton.tech`.
3. Copy the website ID (UUID) from the tracking code snippet.
4. In `src/config/config.json`:
   - Set `umami.enable` to `true`.
   - Paste the website ID into `umami.website_id`.
5. Commit and deploy.
6. Verify: open `https://hecaton.tech/` in a new browser, then check the Umami dashboard for a real-time visit (can take ~30 seconds).
7. Umami does not use cookies. The privacy page already mentions this.

**The website ID is NOT a secret.** Standard for privacy-friendly analytics — it's embedded in the tracker script tag on every page.

## 4. GitHub Pages

Prereqs: the repo `Hecaton-Consulting/website` exists, `main` branch has content, and `.github/workflows/deploy.yml` is present (planned in Task 5.2).

1. **Enable Pages via Actions.** In the repo go to **Settings → Pages**.
   - **Source:** select **GitHub Actions**.
   - Do not pick "Deploy from a branch" — the workflow handles artifact upload.
2. **Set custom domain.** On the same page, enter `hecaton.tech` into the **Custom domain** field and click **Save**.
   - GitHub will attempt a DNS check; it may show a warning until DNS is configured (step 5).
   - A `CNAME` file already lives in `public/CNAME` and will be included in every deploy, keeping the binding stable across rebuilds.
3. **Configure DNS at your registrar for `hecaton.tech`.**

   Apex A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Optional AAAA records (IPv6):
   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

   CNAME record:
   ```
   www.hecaton.tech → hecaton-consulting.github.io
   ```

4. **Wait for DNS to propagate.** Verify with:
   ```bash
   dig hecaton.tech +short
   dig www.hecaton.tech +short
   ```
   Expected output: the four GitHub Pages IPs for the apex, and `hecaton-consulting.github.io` for `www`.

5. **Wait for Let's Encrypt certificate.** GitHub provisions a cert automatically — typically 15 minutes to 24 hours after DNS resolves. The **Enforce HTTPS** checkbox in Settings → Pages stays greyed out until the cert is ready.
6. **Enable Enforce HTTPS** once the checkbox is active.
7. If the cert gets stuck for more than 24 hours, toggle the custom-domain field off (save), then back on (save) to retry provisioning.

## 5. Repo secrets

**None required at launch.**

Reserved for the future: if analytics moves to a paid plan with an API, or if a server-side integration is added, secrets go under **Settings → Secrets and variables → Actions** and are referenced via `${{ secrets.NAME }}` in `deploy.yml`.

## 6. Ownership and identity

- Repo: `github.com/Hecaton-Consulting/website` (org-owned).
- Commit identity: `jbaldodiego` (personal GitHub user) — the org owns the repo; Jaime pushes under his own user.
- External-service accounts: all registered under `jaime@hecaton.tech`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/services-setup.md
git commit -m "docs: runbook for cal.com, web3forms, umami, and pages setup"
```

---

## Phase 7 — QA + first deploy

Goal: validate the site works end to end before flipping DNS.

### Task 7.1: Local QA sweep

**Files:**
- None — verification task.

- [ ] **Step 1: Clean build + preview**

```bash
rm -rf dist && npm run build && npm run preview
```

- [ ] **Step 2: Click-through checklist** (browser at `http://localhost:4321`)

Verify each:

- [ ] `/` — hero loads, cursor blinks (unless `prefers-reduced-motion` is on), both CTAs work, metric strip renders five items, two engagement teaser cards render, about teaser renders (portrait may be broken image if `jaime-portrait.jpg` is missing — acceptable), final CTA block renders.
- [ ] `/engagements/` — H1, intro, capacity note, two full engagement cards with scope/duration/outcome, FAQ strip with 5 items expanding on click, final CTA.
- [ ] `/about/` — portrait, intro, credentials strip, 3 career-narrative paragraphs, 6 track-record items, how-I-work list, **no Writing section** (since `writing_links` is empty), final CTA.
- [ ] `/contact/` — H1, sub, Cal.com embed loads within a few seconds (should show a dark calendar UI), "Or pick a time:" link opens new tab, form below renders all 4 fields + hidden honeypot is hidden, submit button styled correctly.
- [ ] `/contact/thanks/` — H1, text, Book-a-call button, Back-to-home button.
- [ ] `/privacy/` — renders markdown content through `content` prose class.
- [ ] `/terms/` — renders markdown content through `content` prose class.
- [ ] `/doesnotexist/` — serves 404 page with the "unlike your AWS bill" line and buttons.

- [ ] **Step 3: Link-check**

In browser devtools, every internal `<a href>` should end with `/` (trailing slash). Spot-check 10+ links across pages.

- [ ] **Step 4: Keyboard navigation**

Tab through the homepage and `/contact/`. Every interactive element must show a visible focus ring (lime). Skip-to-content link appears on first tab press.

- [ ] **Step 5: Reduced motion**

In OS settings, enable "Reduce motion". Reload `/`. The cursor should no longer blink. Any other animations (card hover transitions) should be near-instant.

- [ ] **Step 6: Lighthouse**

In Chrome devtools, run Lighthouse on `/` with `Performance`, `Accessibility`, `Best Practices`, `SEO` categories, desktop profile. All four should score ≥ 95.

If any category is below 95, fix root causes before moving on. Typical fixes:
- **Perf < 95:** check that images have explicit width/height, fonts preloaded, no blocking scripts.
- **A11y < 95:** missing alt text, insufficient contrast (shouldn't happen — palette is validated), missing label-for.
- **Best Practices < 95:** any console error; HTTPS-only check passes on preview automatically.
- **SEO < 95:** missing meta description, missing title, links with no href.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: qa-pass cleanup"
```

Stop preview with Ctrl-C.

---

### Task 7.2: Wire up external-service identifiers

**Files:**
- Modify: `src/config/config.json`

- [ ] **Step 1: Follow `docs/services-setup.md` to create Cal.com, Web3Forms, Umami accounts**

The user performs the manual signups. Collect:
- Cal.com event URL (already hardcoded, but verify it matches).
- Web3Forms access key.
- Umami website ID.

- [ ] **Step 2: Paste identifiers into `config.json`**

Edit `src/config/config.json`:
- Set `umami.enable` to `true`.
- Paste Umami website ID into `umami.website_id`.
- Paste Web3Forms access key into `web3forms.access_key`.

- [ ] **Step 3: Rebuild and smoke-test locally**

```bash
npm run build && npm run preview
```

- Open `/contact/`, confirm the Cal.com embed still loads correctly.
- Submit the form with a test message — browser should redirect to `/contact/thanks/` and email should arrive at `jaime@hecaton.tech`.
- Open Umami dashboard — a real-time pageview should appear within 30 seconds.

- [ ] **Step 4: Commit**

```bash
git add src/config/config.json
git commit -m "chore: enable umami and web3forms with production identifiers"
```

---

### Task 7.3: Merge PR and verify first deploy

**Files:**
- None — git ops.

- [ ] **Step 1: Push any new commits to the PR branch**

```bash
git push
```

- [ ] **Step 2: Verify PR is still open**

```bash
gh pr view --json state
```
Expected: `{"state":"OPEN"}`. If merged or closed, stop and investigate before pushing again.

- [ ] **Step 3: Merge PR**

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 4: Watch the Pages deploy**

```bash
gh run watch
```
Expected: `build` job then `deploy` job both succeed. If the deploy fails with "another deployment is already in progress", the concurrency block should prevent this — verify `deploy.yml` matches Task 5.2.

- [ ] **Step 5: Verify live site**

Once the deploy run completes:

```bash
curl -I https://hecaton-consulting.github.io/
```
Expected: HTTP/2 200 (until DNS is switched, the site is reachable at the org subdomain).

Once DNS is configured per the services-setup runbook:

```bash
curl -I https://hecaton.tech/
```
Expected: HTTP/2 200 with the site's HTML. If 301 → trailing-slash URL, the `trailingSlash` + `build.format` config is right but an individual link is missing its trailing slash somewhere — scan with:

```bash
grep -rn 'href="/[a-z]*"' src/
```

Anything matching is a bug; add the trailing slash.

- [ ] **Step 6: Final Lighthouse in production**

In Chrome devtools, run Lighthouse on `https://hecaton.tech/` (not localhost). Scores should still be ≥ 95.

---

## Self-review notes

**Spec coverage check:**
- §2 Audience — addressed through copy choices in homepage + engagements (Tasks 2.2, 2.3).
- §3 Brand — name/tagline baked into content (Task 2.2); wordmark in Logo (Task 3.1); voice throughout copy.
- §4 Visual — palette (Task 1.2), fonts (Task 1.3), typography scales (Task 1.7), motion (Task 3.4, Task 1.7 `prefers-reduced-motion`), no stock imagery (Task 0.6 delete; Tasks 2.x new copy).
- §5 IA — nav (Task 1.4), pages (Tasks 4.1–4.6), removed routes (Task 0.5), 404 (Task 4.6).
- §6 Page copy — each page's content in Phase 2; components in Phase 3; assembly in Phase 4.
- §7 Technical — dependency prune (Task 0.3), config rewrite (Task 0.4 + 1.3), collections (Task 2.1).
- §8 External services — components (Tasks 3.10, 3.11), config (Task 1.1), runbook (Task 6.1), wire-up (Task 7.2).
- §9 Deployment — CNAME (Task 5.1), workflow (Task 5.2), settings in runbook (Task 6.1 section 4).
- §10 A11y/perf — focus ring + skip link (Tasks 1.6, 1.7); Lighthouse gate (Task 7.1).
- §11 Out of scope — respected (no blog, no light-mode toggle, no CSP, no react islands).
- §12 Open questions — OG image and portrait flagged as launch-time assets in homepage/about content; Cal.com slug verified in runbook step 1.1.

**Type/name consistency:**
- `EngagementCard` uses `shape.slug`, `shape.title`, `shape.premise`, `shape.best_for`, `shape.scope`, `shape.duration`, `shape.outcome`, `shape.cta` — matches engagements schema (Task 2.1) and engagements content (Task 2.3).
- `MetricStrip` uses `metrics[].metric` and `metrics[].context` — matches homepage `proof_strip.metrics` schema (Task 2.1) and content (Task 2.2).
- `TrackRecordItem` uses `metric`, `role`, `employer_shape` — matches about schema and content.
- `CalEmbed`'s `calLink` prop matches `config.cal_com.event_url` and content's `cal_event_url`.
- `ContactForm` reads `config.params.contact_form_action`, `config.web3forms.access_key`, `config.web3forms.redirect_url` — all defined in Task 1.1.
- Every internal link ends with `/` (sampled across content files and components).

**Placeholder scan:** no TBDs, TODOs, or "add error handling" stubs remain. Placeholder portrait path is explicitly flagged with a note in Task 2.2 and Task 7.1 QA.
