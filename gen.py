import os, re, json
from data import CATEGORIES, TOOLS, TOOLS_BY_ID, POPULAR, related_tools

ROOT = "/home/claude/tolvexa"
BUILD = os.path.join(ROOT, "build")
SITE_URL = "https://tolvexa.com"
SITE_NAME = "TOLVEXA"
TAGLINE = "Everything You Need in One Place"

os.makedirs(BUILD, exist_ok=True)


def icon_inline(name):
    # Placeholder swapped at runtime by icons.js via data-icon; used server-side only for category dots.
    return f'<span data-icon="{name}"></span>'


def fonts_head():
    return (
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&'
        'family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
    )


def header_nav(root, current):
    items = [("home_", "Home", "index.html"), ("tools", "All Tools", "tools.html"),
             ("cats", "Categories", "index.html#explore"), ("fav", "Favorites", "favorites.html"),
             ("recent", "Recent", "recent.html")]
    links = []
    for key, label, href in items:
        cur = ' aria-current="page"' if key == current else ''
        links.append(f'<a href="{root}{href}"{cur}>{label}</a>')
    return "\n".join(links)


def head(title, description, canonical_path, root, extra_head="", noindex=False):
    canonical = f"{SITE_URL}/{canonical_path}".replace("//", "/").replace("https:/", "https://")
    robots = '<meta name="robots" content="noindex,follow">' if noindex else '<meta name="robots" content="index,follow">'
    return f"""<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
{robots}
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE_URL}/assets/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<link rel="icon" href="{root}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{root}assets/css/styles.css">
{fonts_head()}
<script>{open(os.path.join(ROOT,"assets/js/theme-init.js")).read()}</script>
{extra_head}"""


HEADER = """<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="{root}index.html">
      <span class="brand-mark">T</span> TOLVEXA
    </a>
    <nav class="main-nav" aria-label="Primary">
      {nav}
    </nav>
    <div class="header-actions">
      <button class="header-search" data-search-open type="button" aria-label="Search tools">
        <span data-icon="search" data-icon-size="17"></span>
        <span>Search tools...</span>
        <kbd>/</kbd>
      </button>
      <button class="btn btn-icon btn-ghost" data-theme-toggle type="button" aria-label="Toggle theme"></button>
      <button class="btn btn-icon btn-ghost hamburger" data-drawer-open type="button" aria-label="Open menu">
        <span data-icon="menu" data-icon-size="20"></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-drawer">
  <div class="backdrop"></div>
  <div class="panel" role="dialog" aria-modal="true" aria-label="Menu">
    <button class="btn btn-icon btn-ghost drawer-close" data-drawer-close type="button" aria-label="Close menu">
      <span data-icon="x" data-icon-size="20"></span>
    </button>
    <a href="{root}index.html">Home</a>
    <a href="{root}tools.html">All Tools</a>
    <a href="{root}index.html#explore">Categories</a>
    <a href="{root}favorites.html">Favorites</a>
    <a href="{root}recent.html">Recent</a>
  </div>
</div>

<div class="modal-backdrop" id="global-search-modal" style="display:none;">
  <div class="modal" style="max-width:560px;width:100%;" role="dialog" aria-modal="true" aria-label="Search tools">
    <div class="command-search" style="box-shadow:none;border:none;padding:0;">
      <div class="command-search-inner">
        <span data-icon="search" data-icon-size="18"></span>
        <input type="text" placeholder="Search tools..." aria-label="Search tools">
        <button class="modal-close" data-search-close aria-label="Close search">&times;</button>
      </div>
      <div class="command-search-results"></div>
    </div>
  </div>
  <div class="modal-backdrop-search" style="position:absolute;inset:0;z-index:-1;"></div>
</div>
"""


def footer(root):
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="{root}index.html" style="margin-bottom:10px;"><span class="brand-mark">T</span> TOLVEXA</a>
        <p style="max-width:32ch;">{TAGLINE}. Fast, free, client-side tools — no signup required.</p>
      </div>
      <div>
        <h4>Tools</h4>
        <ul>
          <li><a href="{root}tools.html">All Tools</a></li>
          <li><a href="{root}index.html#popular">Popular Tools</a></li>
          <li><a href="{root}tools.html">New Tools</a></li>
        </ul>
      </div>
      <div>
        <h4>Categories</h4>
        <ul>
          {"".join(f'<li><a href="{root}tools.html?cat={c["id"]}">{c["name"]}</a></li>' for c in CATEGORIES)}
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="{root}about.html">About</a></li>
          <li><a href="{root}contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="{root}privacy.html">Privacy Policy</a></li>
          <li><a href="{root}terms.html">Terms of Service</a></li>
          <li><a href="{root}disclaimer.html">Disclaimer</a></li>
          <li><a href="{root}cookies.html">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="footer-year">2026</span> TOLVEXA. All rights reserved.</span>
      <span>Built for speed. Processed entirely in your browser.</span>
    </div>
  </div>
</footer>
"""

SCRIPTS_BASE = """<script src="{root}assets/js/icons.js"></script>
<script src="{root}assets/js/tools-data.js"></script>
<script src="{root}assets/js/app.js"></script>
<script>document.getElementById('footer-year').textContent = new Date().getFullYear();</script>
"""


def page(*, title, description, canonical_path, root, content, current_nav="", extra_head="",
         extra_scripts="", body_class="", noindex=False):
    html = f"""<!doctype html>
<html lang="en">
<head>
{head(title, description, canonical_path, root, extra_head, noindex)}
</head>
<body class="{body_class}">
<script>window.TOLVEXA_ROOT_PREFIX = "{root}";</script>
{HEADER.format(root=root, nav=header_nav(root, current_nav))}
<main id="main">
{content}
</main>
{footer(root)}
{SCRIPTS_BASE.format(root=root)}
{extra_scripts}
</body>
</html>"""
    return html


def write(path, html):
    full = os.path.join(BUILD, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(html)


def read_fragment(name):
    with open(os.path.join(ROOT, "fragments", name), encoding="utf-8") as f:
        return f.read()


def related_cards_html(tool, root):
    rel = related_tools(tool["id"])
    if not rel:
        return '<p>More tools are on the way in this category.</p>'
    cards = []
    for t in rel:
        cat = next(c for c in CATEGORIES if c["id"] == t["category"])
        cards.append(f"""<a class="tool-card" href="{root}tools/{t['id']}/" style="text-decoration:none;">
          <div class="tool-card-top"><div class="tool-icon" style="background:{cat['accent']}22;color:{cat['accent']}" data-icon="{cat['icon']}"></div></div>
          <h3>{t['name']}</h3><p>{t['short']}</p>
        </a>""")
    return f'<div class="related-grid">{"".join(cards)}</div>'


EXTRA_TOOL_SCRIPTS = {
    "qr-code-generator": ["https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"],
    "pdf-merge": ["{root}assets/js/pdf-common.js"],
    "pdf-split": ["{root}assets/js/pdf-common.js"],
    "pdf-to-images": ["{root}assets/js/pdf-common.js"],
    "images-to-pdf": ["{root}assets/js/pdf-common.js"],
    "pdf-page-counter": ["{root}assets/js/pdf-common.js"],
}


def tool_page_html(tool, body_html, how_to_items, faq_items, root="../../"):
    cat = next(c for c in CATEGORIES if c["id"] == tool["category"])
    breadcrumbs = (
        f'<nav class="breadcrumbs" aria-label="Breadcrumb">'
        f'<a href="{root}index.html">Home</a><span>/</span>'
        f'<a href="{root}tools.html">All Tools</a><span>/</span>'
        f'<a href="{root}tools.html?cat={cat["id"]}">{cat["name"]}</a><span>/</span>'
        f'<span aria-current="page">{tool["name"]}</span></nav>'
    )
    how_to_html = "".join(f'<li>{step}</li>' for step in how_to_items)
    faq_html = "".join(
        f'<details class="faq-item"><summary>{q}</summary><p>{a}</p></details>'
        for q, a in faq_items
    )
    faq_jsonld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": re.sub('<[^<]+?>', '', a)}}
            for q, a in faq_items
        ]
    }
    app_jsonld = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": f"{tool['name']} – TOLVEXA",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any (runs in the browser)",
        "description": tool["short"],
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
    }
    jsonld = f'<script type="application/ld+json">{json.dumps(app_jsonld)}</script>\n<script type="application/ld+json">{json.dumps(faq_jsonld)}</script>'

    content = f"""<div class="container">
  {breadcrumbs}
  <div class="tool-header">
    <div class="titles">
      <div class="tool-icon" style="width:48px;height:48px;background:{cat['accent']}22;color:{cat['accent']}" data-icon="{cat['icon']}" data-icon-size="24"></div>
      <div>
        <h1 style="margin-bottom:4px;">{tool['name']}</h1>
        <span class="tool-tag" style="background:{cat['accent']}1a;color:{cat['accent']}">{cat['name']}</span>
      </div>
    </div>
    <div class="tool-header-actions">
      <button class="btn btn-icon" data-fav-btn data-tool-id="{tool['id']}" aria-pressed="false" aria-label="Add to favorites"></button>
      <button class="btn btn-icon" data-share-tool aria-label="Share this tool"><span data-icon="share" data-icon-size="17"></span></button>
    </div>
  </div>
  <p style="max-width:70ch;font-size:1.02rem;">{tool['short']}</p>

  <div class="tool-shell">
    {body_html}
  </div>

  <div class="ad-slot rectangle inline" aria-label="Advertisement placeholder">Ad space</div>

  <div class="panel">
    <h2 style="font-size:1.15rem;">How to use {tool['name']}</h2>
    <ol style="color:var(--text-muted);padding-left:20px;">{how_to_html}</ol>
  </div>

  <div class="panel">
    <h2 style="font-size:1.15rem;">Frequently asked questions</h2>
    {faq_html}
  </div>

  <div class="section" style="padding-bottom:0;">
    <h2 style="font-size:1.15rem;">Related tools</h2>
    {related_cards_html(tool, root)}
  </div>
</div>
"""
    extra_libs = "".join(
        f'<script src="{src.format(root=root)}"></script>\n' for src in EXTRA_TOOL_SCRIPTS.get(tool["id"], [])
    )
    extra_scripts = (
        f'<script src="{root}assets/js/tool-page.js"></script>\n'
        f'{extra_libs}'
        f'<script src="{root}assets/js/tools/{tool["id"]}.js"></script>\n'
        f'<script>document.addEventListener("DOMContentLoaded", function(){{ TOLVEXA.initToolPage("{tool["id"]}"); }});</script>'
    )
    return page(
        title=f"{tool['name']} — Free Online Tool | TOLVEXA",
        description=tool["short"],
        canonical_path=f"tools/{tool['id']}/",
        root=root,
        content=content,
        current_nav="tools",
        extra_head=jsonld,
        extra_scripts=extra_scripts,
    )
