import os
from PIL import Image, ImageDraw, ImageFont

ROOT = "/home/claude/tolvexa"
ASSETS = os.path.join(ROOT, "assets")
os.makedirs(ASSETS, exist_ok=True)

# ---- favicon.svg ----
favicon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#2E6BFF"/><stop offset="1" stop-color="#7A5CFA"/>
</linearGradient></defs>
<rect width="32" height="32" rx="8" fill="url(#g)"/>
<text x="16" y="22" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#fff" text-anchor="middle">T</text>
</svg>"""
with open(os.path.join(ASSETS, "favicon.svg"), "w") as f:
    f.write(favicon_svg)

# ---- og-default.png (1200x630 branded share image) ----
W, H = 1200, 630
img = Image.new("RGB", (W, H), "#090C12")
draw = ImageDraw.Draw(img)

# subtle gradient glow (approximate with translucent ellipses)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse([-200, -300, 700, 400], fill=(46, 107, 255, 60))
gdraw.ellipse([700, -250, 1400, 350], fill=(122, 92, 250, 45))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(img)

# brand mark square
draw.rounded_rectangle([80, 210, 170, 300], radius=20, fill="#2E6BFF")
try:
    mark_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 54)
except Exception:
    mark_font = ImageFont.load_default()
draw.text((125, 255), "T", font=mark_font, fill="#ffffff", anchor="mm")

title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 78)
tag_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 34)

draw.text((200, 220), "TOLVEXA", font=title_font, fill="#E7EBF3", anchor="lm")
draw.text((82, 340), "Everything You Need in One Place", font=tag_font, fill="#9AA4B8", anchor="lm")
draw.text((82, 400), "30 free tools \u00b7 100% in your browser \u00b7 no signup", font=tag_font, fill="#5B8DEF", anchor="lm")

img.save(os.path.join(ASSETS, "og-default.png"), "PNG")
print("wrote favicon.svg and og-default.png")
