# Watts website

A static technical landing page for Watts and the proposed managed Watts Platform. No build step, dependencies, external fonts, analytics, or server-side services. ACL example tabs are progressive enhancement; the page remains readable without JavaScript. Execution examples are illustrative, not a live dashboard or measured product results.

## Preview

From the `watts-platform` repository root:

```sh
python3 -m http.server 8090 --bind 127.0.0.1
```

Open http://127.0.0.1:8090/. The repository-root `index.html`, `assets/`, and `slides/` are the static website. Asset paths are relative, so the same files support a root domain or a GitHub Pages project subpath.

## GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save. The entry point and `.nojekyll` are already at the repository root; no copying or build step is needed. Commit and push the changes to trigger publication. Relative asset paths support GitHub Pages project URLs. See [GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## S3

Upload `index.html`, `assets/`, and `slides/` to a bucket configured for static website hosting and set `index.html` as its index document. For an HTTPS production site, serve a private S3 bucket through CloudFront with origin access control. No routing fallback or application backend is required. Infrastructure provisioning and deployment are not included.

## Editing

- `index.html`: copy, navigation, workflow illustration, and initial workflow excerpt.
- `assets/style.css`: responsive layout and visual design.
- `assets/site.js`: accessible ACL tabs with Agent and module excerpts.
- `assets/icon.svg`: favicon.

The public source/documentation links point to `jasondeutsch/watts` on GitHub. Update them if the repository or default branch changes. The ACL specification link points to the `watts2` branch, where the language implementation currently lives; switch it when that work reaches the default branch. Keep the current prototype capabilities separate from proposed platform features; do not substitute concept metrics for evaluation evidence.

## Unlinked project briefing

The pitch is published at `/slides/` (or `<project-subpath>/slides/` on GitHub Pages). It is intentionally absent from the main page and navigation. Its HTML contains `noindex, nofollow`; anyone with the URL can read it. No authentication or routing configuration is required.

Deploy the root `slides/` directory along with `index.html` and `assets/`. The briefing includes static copies of the four concept images and links repository documentation to GitHub. It remains readable without JavaScript and has a print layout.

`PITCH.md` is the source. After editing it, regenerate the checked-in HTML with the existing `marked` Markdown renderer:

```sh
node scripts/build-slides.mjs /path/to/marked/lib/marked.esm.js
```

Run this command from `watts-platform/`. If `marked` is already installed and resolvable by Node, omit the module path. Generation tooling is optional; deployment uses only the checked-in static files.
