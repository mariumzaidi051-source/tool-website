"""Central data for TOLVEXA: categories + tools.
This is the single source of truth. gen.py reads it to build every page,
and export_js() turns it into assets/js/tools-data.js for client-side use
(search, All Tools filtering, related tools, favorites/recents lookups)."""

CATEGORIES = [
    {"id": "pdf", "name": "PDF", "desc": "Work with PDF files quickly and easily.", "accent": "#E1526B", "icon": "file-text"},
    {"id": "text", "name": "Text", "desc": "Analyze and transform text instantly.", "accent": "#2BB3A3", "icon": "type"},
    {"id": "calculator", "name": "Calculator", "desc": "Fast calculators for everyday calculations.", "accent": "#E0A62E", "icon": "calculator"},
    {"id": "developer", "name": "Developer", "desc": "Useful tools for developers and technical workflows.", "accent": "#8B7CF6", "icon": "code"},
    {"id": "seo", "name": "SEO", "desc": "Simple tools for improving and managing your SEO.", "accent": "#4CAF6D", "icon": "search"},
    {"id": "utilities", "name": "Utilities", "desc": "Handy everyday tools for common tasks.", "accent": "#4C9AE0", "icon": "grid"},
]

TOOLS = [
    # PDF
    {"id": "pdf-merge", "name": "PDF Merge", "category": "pdf",
     "short": "Combine multiple PDF files into a single document.",
     "keywords": ["pdf", "merge", "combine", "join pdf"]},
    {"id": "pdf-split", "name": "PDF Split", "category": "pdf",
     "short": "Split a PDF into separate files by page range.",
     "keywords": ["pdf", "split", "separate", "extract pages"]},
    {"id": "pdf-to-images", "name": "PDF to Images", "category": "pdf",
     "short": "Convert each PDF page into a downloadable PNG image.",
     "keywords": ["pdf", "images", "png", "convert", "export pages"]},
    {"id": "images-to-pdf", "name": "Images to PDF", "category": "pdf",
     "short": "Combine one or more images into a single PDF file.",
     "keywords": ["images", "pdf", "jpg to pdf", "png to pdf", "convert"]},
    {"id": "pdf-page-counter", "name": "PDF Page Counter", "category": "pdf",
     "short": "Instantly check how many pages are in a PDF file.",
     "keywords": ["pdf", "pages", "count", "page count"]},
    # Text
    {"id": "word-counter", "name": "Word Counter", "category": "text",
     "short": "Count words, characters, sentences and reading time instantly.",
     "keywords": ["words", "word count", "reading time", "sentence count"]},
    {"id": "character-counter", "name": "Character Counter", "category": "text",
     "short": "Count characters with and without spaces, live as you type.",
     "keywords": ["characters", "character count", "letters", "limit"]},
    {"id": "case-converter", "name": "Case Converter", "category": "text",
     "short": "Convert text to UPPERCASE, lowercase, Title Case and more.",
     "keywords": ["case", "uppercase", "lowercase", "title case", "capitalize"]},
    {"id": "remove-extra-spaces", "name": "Remove Extra Spaces", "category": "text",
     "short": "Clean up messy text by removing extra spaces and blank lines.",
     "keywords": ["spaces", "whitespace", "clean text", "trim"]},
    {"id": "text-sorter", "name": "Text Sorter", "category": "text",
     "short": "Sort lines of text alphabetically, by length, or reversed.",
     "keywords": ["sort", "sort lines", "alphabetize", "order text"]},
    # Calculator
    {"id": "percentage-calculator", "name": "Percentage Calculator", "category": "calculator",
     "short": "Calculate percentages, increases, decreases and differences.",
     "keywords": ["percentage", "percent", "calculate percent"]},
    {"id": "age-calculator", "name": "Age Calculator", "category": "calculator",
     "short": "Find your exact age in years, months and days.",
     "keywords": ["age", "birthday", "date of birth", "how old"]},
    {"id": "discount-calculator", "name": "Discount Calculator", "category": "calculator",
     "short": "Work out sale prices and how much you're saving.",
     "keywords": ["discount", "sale price", "savings", "coupon"]},
    {"id": "time-calculator", "name": "Time Calculator", "category": "calculator",
     "short": "Add or subtract hours, minutes and seconds.",
     "keywords": ["time", "add time", "subtract time", "duration"]},
    {"id": "unit-converter", "name": "Unit Converter", "category": "calculator",
     "short": "Convert length, weight, temperature and volume units.",
     "keywords": ["unit", "convert", "length", "weight", "temperature"]},
    # Developer
    {"id": "json-formatter", "name": "JSON Formatter", "category": "developer",
     "short": "Format and beautify messy JSON with proper indentation.",
     "keywords": ["json", "format", "beautify", "pretty print"]},
    {"id": "json-validator", "name": "JSON Validator", "category": "developer",
     "short": "Check whether your JSON is valid and find syntax errors.",
     "keywords": ["json", "validate", "lint", "syntax error"]},
    {"id": "base64-encoder-decoder", "name": "Base64 Encoder/Decoder", "category": "developer",
     "short": "Encode text to Base64 or decode Base64 back to text.",
     "keywords": ["base64", "encode", "decode"]},
    {"id": "url-encoder-decoder", "name": "URL Encoder/Decoder", "category": "developer",
     "short": "Encode or decode URLs and query string components.",
     "keywords": ["url", "encode", "decode", "uri component"]},
    {"id": "html-formatter-minifier", "name": "HTML Formatter/Minifier", "category": "developer",
     "short": "Beautify messy HTML or minify it for production.",
     "keywords": ["html", "format", "minify", "beautify"]},
    # SEO
    {"id": "meta-tag-generator", "name": "Meta Tag Generator", "category": "seo",
     "short": "Generate title, description and Open Graph meta tags.",
     "keywords": ["meta tags", "seo", "open graph", "title tag"]},
    {"id": "keyword-density-checker", "name": "Keyword Density Checker", "category": "seo",
     "short": "See how often each keyword appears in a block of text.",
     "keywords": ["keyword density", "seo", "keyword frequency"]},
    {"id": "slug-generator", "name": "Slug Generator", "category": "seo",
     "short": "Turn any title into a clean, URL-friendly slug.",
     "keywords": ["slug", "url slug", "permalink", "seo"]},
    {"id": "robots-txt-generator", "name": "Robots.txt Generator", "category": "seo",
     "short": "Build a valid robots.txt file for your website.",
     "keywords": ["robots.txt", "seo", "crawlers", "disallow"]},
    {"id": "sitemap-generator", "name": "Sitemap Generator", "category": "seo",
     "short": "Generate an XML sitemap from a list of your page URLs.",
     "keywords": ["sitemap", "xml sitemap", "seo"]},
    # Utilities
    {"id": "qr-code-generator", "name": "QR Code Generator", "category": "utilities",
     "short": "Create a scannable QR code for a URL, text, email or Wi-Fi.",
     "keywords": ["qr code", "qr generator", "scan"]},
    {"id": "password-generator", "name": "Password Generator", "category": "utilities",
     "short": "Generate strong, random passwords you control the rules for.",
     "keywords": ["password", "generator", "random password", "secure"]},
    {"id": "color-converter", "name": "Color Converter", "category": "utilities",
     "short": "Convert colors between HEX, RGB and HSL instantly.",
     "keywords": ["color", "hex", "rgb", "hsl", "convert"]},
    {"id": "timestamp-converter", "name": "Timestamp Converter", "category": "utilities",
     "short": "Convert Unix timestamps to dates and back again.",
     "keywords": ["timestamp", "unix time", "epoch", "convert"]},
    {"id": "lorem-ipsum-generator", "name": "Lorem Ipsum Generator", "category": "utilities",
     "short": "Generate placeholder text by paragraphs, sentences or words.",
     "keywords": ["lorem ipsum", "placeholder text", "dummy text"]},
]

POPULAR = ["word-counter", "qr-code-generator", "percentage-calculator", "json-formatter",
           "pdf-merge", "images-to-pdf", "password-generator", "age-calculator"]

TOOLS_BY_ID = {t["id"]: t for t in TOOLS}


def related_tools(tool_id, limit=4):
    t = TOOLS_BY_ID[tool_id]
    same_cat = [x for x in TOOLS if x["category"] == t["category"] and x["id"] != tool_id]
    return same_cat[:limit]
