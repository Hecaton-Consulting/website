# hecaton.tech

Marketing site for **Hecaton Consulting** — a fractional platform-engineering studio. Built with Astro and Tailwind, deployed to GitHub Pages.

🔗 **Live:** [hecaton.tech](https://hecaton.tech)

## Stack

- **[Astro 5](https://astro.build)** — static site generator
- **[Tailwind CSS 4](https://tailwindcss.com)** (via `@tailwindcss/vite`)
- **MDX** content collections for page copy
- **GitHub Pages** hosting via GitHub Actions

## Local development

Requires Node.js 22 (LTS).

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build locally
npm run check    # astro type-check
npm run format   # format with Prettier
```

## Project structure

```
src/
├── config/         # site config + theme (config.json, theme.json, menu.json, social.json)
├── content/        # page copy as Markdown content collections (homepage, about, engagements, contact, pages)
├── layouts/        # Base layout, components, and partials
├── pages/          # route files (index, about, engagements, contact, [regular], 404)
└── styles/         # global CSS
public/             # static assets, CNAME, robots.txt
```

Most visible text lives in `src/content/**/*.md`, not in the `.astro` files — edit copy there.

## Configuration

Site settings and third-party integrations are in `src/config/config.json`:

- **Booking** — `cal_com.event_url` embeds the [Cal.com EU](https://cal.eu) booking widget.
- **Contact form** — `web3forms.access_key` powers the [Web3Forms](https://web3forms.com) contact form.
- **Analytics** — `umami.website_id` enables [Umami Cloud](https://umami.is) (cookieless, EU region).

These identifiers are **public by design** (embedded client-side in the page HTML) and are safe to commit — there are no secrets in this repository.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The custom domain is bound via `public/CNAME` (`hecaton.tech`).

## License & attribution

Site design and copy © Hecaton. The code is based on the open-source [Bigspring Light Astro](https://github.com/themefisher/bigspring-light-astro) template by Themefisher, released under the [MIT](./LICENSE) license, with substantial rework.
