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

Prereqs: the repo `Hecaton-Consulting/website` exists, `main` branch has content, and `.github/workflows/deploy.yml` is present.

1. **Enable Pages via Actions.** In the repo go to **Settings → Pages**.
   - **Source:** select **GitHub Actions**.
   - Do not pick "Deploy from a branch" — the workflow handles artifact upload.
2. **Set custom domain.** On the same page, enter `hecaton.tech` into the **Custom domain** field and click **Save**.
   - GitHub will attempt a DNS check; it may show a warning until DNS is configured (step 3).
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
