import json
from data import CATEGORIES, TOOLS, POPULAR

OUT = "/home/claude/tolvexa/assets/js/tools-data.js"

payload = {
    "categories": CATEGORIES,
    "tools": TOOLS,
    "popular": POPULAR,
}

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// Auto-generated from data.py — do not edit by hand.\n")
    f.write("window.TOLVEXA_DATA = ")
    f.write(json.dumps(payload, indent=2))
    f.write(";\n")

print("wrote", OUT)
