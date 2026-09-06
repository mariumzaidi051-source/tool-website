import os, shutil
from data import CATEGORIES, TOOLS, POPULAR, CATEGORIES
import data as data_mod
from tool_content import TOOL_CONTENT
import gen
from gen import page, write, read_fragment, tool_page_html, ROOT, BUILD, SITE_URL

# ---------------------------------------------------------------------------
# Reset build dir
# ---------------------------------------------------------------------------
if os.path.exists(BUILD):
    shutil.rmtree(BUILD)
os.makedirs(BUILD)

# ---------------------------------------------------------------------------
# Copy static assets
# ---------------------------------------------------------------------------
shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(BUILD, "assets"))

# ---------------------------------------------------------------------------
# Shared card-rendering helpers (server-side, mirrors app.js toolCardHTML)
# ---------------------------------------------------------------------------
def tool_card_html(tool, root=""):
    cat = next(c for c in CATEGORIES if c["id"] == tool["category"])
    return f"""<div class="tool-card" data-id="{tool['id']}" data-category="{tool['category']}" data-keywords="{' '.join(tool.get('keywords', []))}">
      <div class="tool-card-top">
        <div class="tool-icon" style="background:{cat['accent']}22;color:{cat['accent']}" data-icon="{cat['icon']}"></div>
        <button type="button" class="fav-btn" data-fav-btn data-tool-id="{tool['id']}" aria-pressed="false" aria-label="Add to favorites" data-icon="star" data-icon-size="18"></button>
      </div>
      <h3><a href="{root}tools/{tool['id']}/">{tool['name']}</a></h3>
      <p>{tool['short']}</p>
      <div class="tool-card-foot">
        <span class="tool-tag" style="background:{cat['accent']}1a;color:{cat['accent']}">{cat['name']}</span>
        <a class="btn btn-sm btn-ghost" href="{root}tools/{tool['id']}/">Open tool</a>
      </div>
    </div>"""


def category_card_html(cat, root=""):
    count = len([t for t in TOOLS if t["category"] == cat["id"]])
    return f"""<a class="cat-card" href="{root}tools.html?cat={cat['id']}" style="text-decoration:none;">
      <div class="cat-icon" style="background:{cat['accent']}22;color:{cat['accent']}" data-icon="{cat['icon']}" data-icon-size="22"></div>
      <h3>{cat['name']}</h3>
      <p>{cat['desc']}</p>
      <span class="cat-count">{count} tools</span>
    </a>"""


# ---------------------------------------------------------------------------
# Homepage
# ---------------------------------------------------------------------------
popular_tools = [next(t for t in TOOLS if t["id"] == pid) for pid in POPULAR]
popular_pills = "".join(f'<a class="pill" href="tools/{t["id"]}/">{t["name"]}</a>' for t in popular_tools[:5])
category_cards = "".join(category_card_html(c) for c in CATEGORIES)
popular_cards = "".join(tool_card_html(t) for t in popular_tools)

home_content = (read_fragment("home.html")
                .replace("{{POPULAR_PILLS}}", popular_pills)
                .replace("{{CATEGORY_CARDS}}", category_cards)
                .replace("{{POPULAR_CARDS}}", popular_cards))

home_jsonld = f'''<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TOLVEXA",
  "url": "{SITE_URL}/",
  "potentialAction": {{
    "@type": "SearchAction",
    "target": "{SITE_URL}/tools.html?q={{search_term_string}}",
    "query-input": "required name=search_term_string"
  }}
}}</script>'''

write("index.html", page(
    title="TOLVEXA — Everything You Need in One Place",
    description="30 free online tools for PDFs, text, calculations, developer tasks, SEO and everyday jobs. No signup, 100% processed in your browser.",
    canonical_path="",
    root="",
    content=home_content,
    current_nav="home_",
    extra_head=home_jsonld,
))

# ---------------------------------------------------------------------------
# All Tools page
# ---------------------------------------------------------------------------
category_chips = "".join(f'<button class="chip" data-filter="{c["id"]}" aria-pressed="false">{c["name"]}</button>' for c in CATEGORIES)
all_tool_cards = "".join(tool_card_html(t) for t in TOOLS)

tools_content = (read_fragment("tools_listing.html")
                  .replace("{{CATEGORY_CHIPS}}", category_chips)
                  .replace("{{ALL_TOOL_CARDS}}", all_tool_cards))

write("tools.html", page(
    title="All Tools — TOLVEXA",
    description="Browse all 30 TOLVEXA tools: PDF, text, calculator, developer, SEO and everyday utilities. Search or filter by category.",
    canonical_path="tools.html",
    root="",
    content=tools_content,
    current_nav="tools",
))

# ---------------------------------------------------------------------------
# Favorites / Recent (client-rendered)
# ---------------------------------------------------------------------------
write("favorites.html", page(
    title="Favorites — TOLVEXA",
    description="Your starred TOLVEXA tools, saved locally in your browser.",
    canonical_path="favorites.html",
    root="",
    content=read_fragment("favorites.html"),
    current_nav="fav",
    noindex=True,
))

write("recent.html", page(
    title="Recently Used — TOLVEXA",
    description="Tools you've recently used on TOLVEXA, saved locally in your browser.",
    canonical_path="recent.html",
    root="",
    content=read_fragment("recent.html"),
    current_nav="recent",
    noindex=True,
))

# ---------------------------------------------------------------------------
# Static content pages
# ---------------------------------------------------------------------------
STATIC_PAGES = [
    ("about.html", "About — TOLVEXA", "What TOLVEXA is, why it exists, and how it protects your data."),
    ("contact.html", "Contact — TOLVEXA", "Get in touch with the TOLVEXA team — bug reports, ideas and feedback welcome."),
    ("privacy.html", "Privacy Policy — TOLVEXA", "How TOLVEXA handles your data — in short, it mostly doesn't collect any."),
    ("terms.html", "Terms of Service — TOLVEXA", "The terms that apply when you use TOLVEXA's free online tools."),
    ("disclaimer.html", "Disclaimer — TOLVEXA", "Important context on how to use TOLVEXA's calculators and generators."),
    ("cookies.html", "Cookie Policy — TOLVEXA", "How TOLVEXA uses local storage and cookies."),
]
for fname, title, desc in STATIC_PAGES:
    write(fname, page(
        title=title, description=desc, canonical_path=fname, root="",
        content=read_fragment(fname), current_nav="",
    ))

write("404.html", page(
    title="Page Not Found — TOLVEXA",
    description="The page you're looking for doesn't exist or may have moved.",
    canonical_path="404.html", root="",
    content=read_fragment("404.html"), current_nav="", noindex=True,
))

# ---------------------------------------------------------------------------
# Tool pages
# ---------------------------------------------------------------------------
for tool in TOOLS:
    content = TOOL_CONTENT.get(tool["id"])
    if not content:
        raise SystemExit(f"Missing TOOL_CONTENT for {tool['id']}")
    body_html = read_fragment(f"tools/{tool['id']}.html")
    html = tool_page_html(tool, body_html, content["how_to"], content["faq"], root="../../")
    write(f"tools/{tool['id']}/index.html", html)

# ---------------------------------------------------------------------------
# robots.txt + sitemap.xml
# ---------------------------------------------------------------------------
robots_txt = f"""User-agent: *
Allow: /
Disallow: /favorites.html
Disallow: /recent.html

Sitemap: {SITE_URL}/sitemap.xml
"""
with open(os.path.join(BUILD, "robots.txt"), "w") as f:
    f.write(robots_txt)

static_urls = ["", "tools.html", "about.html", "contact.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html"]
tool_urls = [f"tools/{t['id']}/" for t in TOOLS]
all_urls = static_urls + tool_urls

sitemap_entries = "\n".join(
    f'  <url><loc>{SITE_URL}/{u}</loc><changefreq>weekly</changefreq><priority>{"1.0" if u=="" else "0.7"}</priority></url>'
    for u in all_urls
)
sitemap_xml = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sitemap_entries}\n</urlset>\n'
with open(os.path.join(BUILD, "sitemap.xml"), "w") as f:
    f.write(sitemap_xml)

print(f"Build complete: {len(TOOLS)} tool pages + {len(STATIC_PAGES)+5} other pages written to {BUILD}")
