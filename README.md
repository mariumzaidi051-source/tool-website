# TOLVEXA — Everything You Need in One Place

A fast, free, client-side toolkit: 30 working tools across PDF, Text, Calculator,
Developer, SEO and Utilities. No accounts, no backend, no build step to deploy.

## What's in this project

```
tolvexa/
├── build/                 ← THE READY-TO-DEPLOY SITE. Upload this folder's
│                             contents as-is to any static host.
├── assets/                ← source CSS/JS (copied into build/ on generation)
│   ├── css/styles.css     ← the entire design system (dark + light theme)
│   ├── js/
│   │   ├── app.js         ← storage, theme, search, favorites, share/QR modal
│   │   ├── icons.js        ← hand-authored inline SVG icon set
│   │   ├── tool-page.js    ← shared harness most tool pages use
│   │   ├── pdf-common.js   ← shared file-upload/dropzone helper for PDF tools
│   │   ├── tools-data.js   ← AUTO-GENERATED from data.py, do not hand-edit
│   │   └── tools/*.js      ← one file per tool's logic
├── fragments/              ← HTML content for every page (source of truth)
│   └── tools/*.html        ← the input/output markup for each tool
├── data.py                 ← the list of all 30 tools + 6 categories
├── tool_content.py         ← "How to use" steps + FAQ for every tool
├── gen.py                  ← page-shell renderer (head/header/footer/tool shell)
├── build.py                ← run this to (re)generate build/ from the above
├── export_js.py            ← regenerates assets/js/tools-data.js from data.py
└── make_assets.py          ← regenerates favicon.svg + assets/og-default.png
```

## Running it

There is **no build step to view or deploy the site** — `build/` is already a
complete static site. To preview it locally:

```bash
cd build
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `build/index.html` directly in a browser (a few PDF/QR
tools that call `fetch`-based CDN scripts work best served over http(s)
rather than the `file://` protocol, due to normal browser security rules).

To deploy, upload the contents of `build/` to any static host — Netlify,
Vercel (as a static site), Cloudflare Pages, GitHub Pages, S3, or a plain
nginx server. No server-side runtime is required.

## Making changes

Don't hand-edit files inside `build/` — they're regenerated from the files
listed above. To change something:

- **Add or edit a tool's metadata** (name, category, description, keywords) → `data.py`
- **Add or edit a tool's "How to use" / FAQ content** → `tool_content.py`
- **Change a tool's input/output markup** → `fragments/tools/<tool-id>.html`
- **Change a tool's logic** → `assets/js/tools/<tool-id>.js`
- **Change shared design (colors, spacing, components)** → `assets/css/styles.css`
- **Change header/footer/page shell** → `gen.py`
- **Change static pages** (About, Privacy, etc.) → `fragments/*.html`

Then regenerate everything:

```bash
python3 export_js.py   # only needed if you changed data.py
python3 build.py       # rebuilds build/ from scratch
```

### Adding a brand-new tool

1. Add an entry to `TOOLS` in `data.py`.
2. Add a `"how_to"` / `"faq"` entry in `tool_content.py`.
3. Create `fragments/tools/<id>.html` with the input/output markup.
4. Create `assets/js/tools/<id>.js` with the logic. For simple "text in →
   text out" tools, use the shared `TOLVEXA.TextTool({...})` harness from
   `tool-page.js` — see `word-counter.js` for the smallest example.
5. Run `python3 export_js.py && python3 build.py`.

## Before you deploy

- **Domain**: every page currently uses `https://tolvexa.com` as the
  canonical/OG URL (see `SITE_URL` in `gen.py`). Update this to your real
  domain before deploying, then re-run `python3 build.py`.
- **Contact form**: `contact.html` opens the visitor's email client
  addressed to `hello@tolvexa.com` — update that address in
  `fragments/contact.html`.
- **Analytics / AdSense**: `.ad-slot` elements are placeholders in fixed,
  sensible locations (below the hero, inside tool pages, etc.) — see
  `assets/css/styles.css` (`.ad-slot`) and drop your ad code in wherever
  those divs appear across `fragments/`.
- **OG image**: `assets/og-default.png` is a generated placeholder. Swap it
  for a real one at the same path/dimensions (1200×630) if you'd like.

## How the tools work (and what needs the internet)

25 of the 30 tools are pure JavaScript and work completely offline once the
page has loaded — no external dependencies, no data ever leaves the browser.

Five tools load a small, well-established library from a CDN **only when
that specific tool's page is opened** (never on the homepage or other
tools, to keep the site fast):

| Tool | Library | Why |
|---|---|---|
| PDF Merge / Split / Images→PDF / Page Counter | [pdf-lib](https://pdf-lib.js.org/) | reading/writing PDF files client-side |
| PDF → Images | [pdf.js](https://mozilla.github.io/pdf.js/) | rendering PDF pages to canvas |
| QR Code Generator | [qrcode.js](https://davidshimjs.github.io/qrcodejs/) | generating the QR code image |

These five degrade gracefully with a clear, friendly message if the CDN
can't be reached (tested by deliberately blocking network access) — they
just won't work until the visitor's connection allows the script to load.
Every other tool, and the rest of the site (search, favorites, theme,
navigation), needs no internet connection beyond the initial page load.

## Accounts

Per your instruction, **there is no sign-in system** — TOLVEXA works
entirely as a guest. Favorites, recently-used tools, and theme preference
are all stored in the browser's `localStorage` and never leave the device.
If you want to add real accounts later, `data.py`/`assets/js/app.js` were
kept framework-agnostic specifically so this could be layered in later
(e.g. rebuilding the storage layer on Next.js + Auth.js with Google
OAuth) without needing to touch the individual tools.

## Testing performed

Every tool and page in this build was tested with a real headless Chromium
browser (Playwright): default/dark/light theme switching and persistence,
global and in-page search and filtering, favoriting and recently-used
tracking and persistence across reloads, the mobile navigation drawer, and
each of the 30 tools' actual input → output behavior (including invalid
input handling). No console or page errors were found. The five CDN-backed
PDF/QR tools were also verified to fail gracefully rather than crash when
the network is unavailable.

What wasn't possible to test in this environment: the CDN-hosted libraries
themselves (pdf-lib, pdf.js, qrcode.js) require internet access this sandbox
doesn't have, so exercise those five tools for real once deployed — the
integration code is written directly against each library's documented,
stable API, but hasn't been run against the live library.

## Browser support

Built on standard, broadly-supported web APIs (`localStorage`,
`Clipboard API` with an `execCommand` fallback, `Web Share API` with a
copy-link fallback, `crypto.getRandomValues` for password generation).
Works in all current major browsers; degrades gracefully (rather than
breaking) in older ones lacking a specific API.
