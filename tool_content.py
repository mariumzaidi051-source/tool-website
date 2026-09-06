# -*- coding: utf-8 -*-
"""Per-tool 'how to use' steps and FAQ content. Kept separate from data.py
so the core metadata stays lightweight and this can grow independently."""

TOOL_CONTENT = {
    "pdf-merge": {
        "how_to": [
            "Click the upload area and choose two or more PDF files, or drag and drop them in.",
            "Use the up and down arrows on each file to put them in the order you want.",
            "Click <strong>Merge &amp; download</strong> — your combined PDF downloads immediately.",
        ],
        "faq": [
            ("Are my files uploaded to a server?", "No. PDF Merge runs entirely in your browser — your files never leave your device."),
            ("Is there a file size or page limit?", "There's no hard limit, but very large PDFs may take longer to process since everything happens on your device."),
            ("Can I merge password-protected PDFs?", "Not currently. Remove the password first using your PDF viewer, then merge."),
        ],
    },
    "pdf-split": {
        "how_to": [
            "Upload a single PDF file.",
            "Once it loads, TOLVEXA shows you how many pages it has.",
            "Enter the pages you want, like <code>1-3, 5, 8-10</code>, and click <strong>Extract &amp; download</strong>.",
        ],
        "faq": [
            ("Can I extract non-consecutive pages?", "Yes — separate page numbers or ranges with commas, e.g. 1-2, 7, 10-12."),
            ("Does this create multiple files?", "It creates one new PDF containing exactly the pages you specified, in that order."),
            ("Will this work on scanned PDFs?", "Yes, page extraction doesn't depend on whether the PDF is scanned or text-based."),
        ],
    },
    "pdf-to-images": {
        "how_to": [
            "Upload a PDF file.",
            "TOLVEXA renders every page as an image directly in your browser.",
            "Click <strong>Download PNG</strong> under any page to save it.",
        ],
        "faq": [
            ("What image format do I get?", "Each page is exported as a PNG image."),
            ("Can I download all pages at once?", "Right now each page downloads individually — click Download PNG under each one you need."),
            ("Will image quality be good enough for printing?", "Pages render at a solid resolution for screen use and casual printing; for print-grade output, a dedicated desktop tool may give more control."),
        ],
    },
    "images-to-pdf": {
        "how_to": [
            "Upload one or more JPG or PNG images.",
            "Reorder them with the arrows — each image becomes one page, in order.",
            "Click <strong>Create &amp; download PDF</strong>.",
        ],
        "faq": [
            ("What image formats are supported?", "JPG and PNG."),
            ("Can I mix JPG and PNG in one PDF?", "Yes, you can combine both formats freely."),
            ("Will my images be resized?", "Each image becomes a page sized to match that image's own dimensions, so nothing is cropped or stretched."),
        ],
    },
    "pdf-page-counter": {
        "how_to": [
            "Upload a PDF file.",
            "TOLVEXA reads the file and shows the total page count instantly.",
        ],
        "faq": [
            ("Does this open or display the PDF?", "No, it only reads the document structure to count pages — it doesn't render the content."),
            ("Does it work on password-protected PDFs?", "No — encrypted PDFs can't be read without the password."),
        ],
    },
    "word-counter": {
        "how_to": [
            "Paste or type your text into the box.",
            "Word count, character count, sentence count and reading time update as you type.",
            "Use <strong>Copy summary</strong> or <strong>Share result</strong> to save the stats.",
        ],
        "faq": [
            ("How is reading time calculated?", "We use an average reading speed of about 200 words per minute, rounded to the nearest minute."),
            ("Does it count numbers and symbols as words?", "Yes — anything separated by whitespace counts as a word, matching how most word processors count."),
        ],
    },
    "character-counter": {
        "how_to": [
            "Type or paste text into the box.",
            "See the total character count, with and without spaces, update live.",
        ],
        "faq": [
            ("Does this count emoji correctly?", "Most emoji are counted, though some complex multi-character emoji may count as more than one character — this matches how JavaScript (and most platforms) measure text length."),
            ("Is there a character limit?", "No limit is enforced by the tool itself, though very long text may feel slow to type in some browsers."),
        ],
    },
    "case-converter": {
        "how_to": [
            "Type or paste your text.",
            "Choose a case style from the dropdown.",
            "Copy or download the converted result.",
        ],
        "faq": [
            ("What's the difference between camelCase and snake_case?", "camelCase runs words together with each new word capitalized (myVariableName); snake_case separates words with underscores (my_variable_name) — both are common in programming."),
            ("Does Title Case follow style-guide capitalization rules?", "It capitalizes the first letter of every word for simplicity, rather than following a specific style guide's rules about small words like 'the' or 'of'."),
        ],
    },
    "remove-extra-spaces": {
        "how_to": [
            "Paste text that has messy spacing or extra blank lines.",
            "TOLVEXA trims each line and collapses repeated spaces automatically.",
            "Optionally collapse extra blank lines too, then copy or download the result.",
        ],
        "faq": [
            ("Will this remove intentional formatting, like indented code?", "Yes — it collapses all repeated spaces on a line, so it isn't suited to preserving code indentation."),
            ("Does it trim leading and trailing spaces on each line?", "Yes, each line is trimmed at both ends."),
        ],
    },
    "text-sorter": {
        "how_to": [
            "Paste your list, one item per line.",
            "Choose how you'd like it sorted.",
            "Optionally remove duplicate lines, then copy or download the result.",
        ],
        "faq": [
            ("Is sorting case-sensitive?", "No, alphabetical sorting ignores case, so 'Apple' and 'apple' are treated the same way."),
            ("What does Shuffle do?", "It randomizes the order of your lines — useful for randomizing a list of names or items."),
        ],
    },
    "percentage-calculator": {
        "how_to": [
            "Choose the type of percentage calculation you need.",
            "Enter the two numbers involved.",
            "Read the result instantly, or copy/share it.",
        ],
        "faq": [
            ("What's the difference between 'X% of Y' and 'X is what % of Y'?", "The first finds a portion of a number (20% of 150 = 30); the second finds what percentage one number is of another (30 is what % of 150 = 20%)."),
            ("How is percentage change calculated?", "As (new value − original value) ÷ original value × 100, so a drop from 100 to 80 shows as a 20% decrease."),
        ],
    },
    "age-calculator": {
        "how_to": [
            "Enter your date of birth.",
            "Optionally set a different 'as of' date — otherwise today's date is used.",
            "See your exact age in years, months and days, plus total days and your next birthday countdown.",
        ],
        "faq": [
            ("Does this account for leap years?", "Yes, the calculation is based on actual calendar dates, so leap years are handled automatically."),
            ("Can I calculate someone's age on a specific past or future date?", "Yes — set the 'Calculate age as of' field to any date."),
        ],
    },
    "discount-calculator": {
        "how_to": [
            "Enter the original price.",
            "Enter the discount percentage.",
            "See the sale price and amount saved update instantly.",
        ],
        "faq": [
            ("Does this include tax?", "No, this calculates the discount only. Add tax separately if needed for your total."),
            ("Can I calculate a discount from a final price back to the original?", "Not directly in this tool — it's built for the common case of price and percentage in, sale price out."),
        ],
    },
    "time-calculator": {
        "how_to": [
            "Enter hours, minutes and seconds for Time A.",
            "Choose add or subtract, then enter Time B.",
            "Read the resulting duration.",
        ],
        "faq": [
            ("What happens if subtracting gives a negative result?", "The result is shown with a minus sign to indicate Time B was larger than Time A."),
            ("Can I use this for adding up work hours?", "Yes — enter each duration as Time A and Time B and add them; for more than two durations, add the running total back into Time A."),
        ],
    },
    "unit-converter": {
        "how_to": [
            "Choose a category: length, weight, volume or temperature.",
            "Pick the units you're converting from and to.",
            "Enter a value and see the converted result instantly.",
        ],
        "faq": [
            ("How precise are the conversions?", "Results are calculated using standard conversion factors and rounded to six decimal places."),
            ("Which volume units are used — US or UK?", "Volume conversions use US customary units (US gallons, quarts, pints, cups, fluid ounces)."),
        ],
    },
    "json-formatter": {
        "how_to": [
            "Paste your JSON into the box.",
            "Choose an indentation style.",
            "Copy, download, or toggle Minify for a compact single-line version.",
        ],
        "faq": [
            ("What happens if my JSON is invalid?", "You'll see a clear error message describing the problem instead of a silent failure."),
            ("Does this validate JSON Schema?", "No — it only checks that the JSON syntax itself is valid, not whether it matches a specific schema."),
        ],
    },
    "json-validator": {
        "how_to": [
            "Paste your JSON into the box.",
            "TOLVEXA tells you instantly whether it's valid, and points to the approximate error location if not.",
        ],
        "faq": [
            ("Why does it show a line number for errors?", "JSON parsers report a character position; we convert that into an approximate line number to help you find the issue faster."),
            ("Does it fix invalid JSON automatically?", "No — it flags the problem so you can fix it. Try the JSON Formatter once your JSON is valid."),
        ],
    },
    "base64-encoder-decoder": {
        "how_to": [
            "Choose Encode or Decode.",
            "Type or paste your text.",
            "Copy or download the result.",
        ],
        "faq": [
            ("Does this handle special characters and emoji?", "Yes — text is encoded as UTF-8 before Base64 conversion, so accented letters and emoji round-trip correctly."),
            ("What happens if I try to decode invalid Base64?", "You'll see a friendly error message instead of garbled output."),
        ],
    },
    "url-encoder-decoder": {
        "how_to": [
            "Choose Encode or Decode.",
            "Choose Component scope (encodes everything, including / and ?) or full URI scope (keeps URL structure characters intact).",
            "Type or paste your text and copy the result.",
        ],
        "faq": [
            ("When should I use 'Component' vs 'Full URI'?", "Use Component when encoding a single value like a query parameter; use Full URI when encoding an entire URL you want to remain a working link."),
            ("Why did decoding fail?", "The text you pasted may contain a malformed percent-encoded sequence — double-check it was encoded correctly first."),
        ],
    },
    "html-formatter-minifier": {
        "how_to": [
            "Paste your HTML.",
            "Choose Beautify for readable, indented output or Minify for a compact version.",
            "Copy or download the result.",
        ],
        "faq": [
            ("Does formatting change my HTML's behavior?", "No — only whitespace and indentation change; tags, attributes and content are preserved."),
            ("Does minifying remove comments?", "Yes, HTML comments are stripped during minification."),
        ],
    },
    "meta-tag-generator": {
        "how_to": [
            "Fill in your page title, description, URL and other details.",
            "Character counters help you stay within recommended limits.",
            "Copy or download the generated tags and paste them into your page's &lt;head&gt;.",
        ],
        "faq": [
            ("Why do titles and descriptions have recommended lengths?", "Search engines typically truncate titles around 60 characters and descriptions around 160, so staying within those limits helps your full text display in results."),
            ("What are Open Graph tags for?", "They control how your page looks when shared on social platforms like Facebook and LinkedIn — the preview title, description and image."),
        ],
    },
    "keyword-density-checker": {
        "how_to": [
            "Paste your article or page content.",
            "Choose single words or two-word phrases.",
            "Review the most frequent keywords and their density percentage.",
        ],
        "faq": [
            ("Why are words like 'the' and 'and' excluded?", "Common stopwords are filtered out so the results highlight meaningful keywords instead of filler words."),
            ("What's a healthy keyword density?", "There's no strict rule, but heavy repetition (well above 2-3%) can look unnatural to both readers and search engines — write for clarity first."),
        ],
    },
    "slug-generator": {
        "how_to": [
            "Type or paste a title.",
            "Choose a separator and whether to force lowercase.",
            "Copy the generated, URL-friendly slug.",
        ],
        "faq": [
            ("What happens to accented letters?", "Accents are stripped automatically (é becomes e) so the slug stays URL-safe."),
            ("Can I use underscores instead of hyphens?", "Yes, switch the separator dropdown — though hyphens are generally recommended for SEO."),
        ],
    },
    "robots-txt-generator": {
        "how_to": [
            "Choose whether to allow or disallow crawling by default.",
            "List any specific paths to disallow, one per line.",
            "Optionally add your sitemap URL, then copy or download robots.txt.",
        ],
        "faq": [
            ("Where do I put the robots.txt file?", "Upload it to the root of your domain, e.g. https://example.com/robots.txt — it won't work in a subfolder."),
            ("What does blocking AI crawlers do?", "It adds rules asking bots like GPTBot and CCBot not to crawl your site for AI training — compliant bots respect this, though it isn't legally enforceable."),
        ],
    },
    "sitemap-generator": {
        "how_to": [
            "Paste your page URLs, one per line.",
            "Choose an optional change frequency and priority.",
            "Copy or download the generated sitemap.xml.",
        ],
        "faq": [
            ("Do I need to include https:// for each URL?", "Yes — each line should be a complete, valid URL starting with http:// or https://; other lines are skipped."),
            ("Where should I upload the sitemap?", "Typically to your site's root, e.g. https://example.com/sitemap.xml, then submit that URL in Google Search Console."),
        ],
    },
    "qr-code-generator": {
        "how_to": [
            "Choose a content type: URL/text, email, phone, or Wi-Fi.",
            "Fill in the relevant fields — the QR code updates live.",
            "Download the PNG, or use Share for a link/QR you can send.",
        ],
        "faq": [
            ("Will the QR code work without an internet connection?", "Yes — once generated, the QR code just encodes data; scanning it doesn't require TOLVEXA to be open."),
            ("What does error correction level do?", "Higher levels (Q, H) let the code still scan even if partially damaged or obscured, at the cost of a slightly denser pattern."),
            ("Is my Wi-Fi password sent anywhere?", "No — the QR code is generated entirely in your browser and never leaves your device."),
        ],
    },
    "password-generator": {
        "how_to": [
            "Set your desired length and character types.",
            "A password generates automatically — click <strong>Generate new</strong> for another.",
            "Copy it, or use Share to send it via your device's share options.",
        ],
        "faq": [
            ("Are these passwords generated securely?", "Yes — TOLVEXA uses your browser's cryptographically secure random number generator, not a predictable pseudo-random function."),
            ("Are passwords sent to a server?", "No, everything happens locally in your browser."),
            ("What does 'exclude similar characters' do?", "It removes characters that are easy to confuse, like l, 1, I, O and 0, which helps when typing a password manually."),
        ],
    },
    "color-converter": {
        "how_to": [
            "Use the color picker, or type a value directly into HEX, RGB, or HSL.",
            "All three formats update together automatically.",
            "Copy all formats at once, or share the result.",
        ],
        "faq": [
            ("Why do my RGB and HSL values shift slightly after conversion?", "HSL uses rounded percentages, so converting back and forth can shift a color by a tiny, usually imperceptible amount."),
            ("What format should I use in CSS?", "All three work in modern CSS — HEX is the most compact, HSL is often easiest to adjust by hand (lightness, saturation)."),
        ],
    },
    "timestamp-converter": {
        "how_to": [
            "Paste a Unix timestamp to convert it to a readable date, or use 'Use now' for the current time.",
            "Or pick a date and time to convert it into a Unix timestamp.",
            "Both directions update live and can be copied together.",
        ],
        "faq": [
            ("What's a Unix timestamp?", "It's the number of seconds (or milliseconds) since January 1, 1970 UTC — a common way computers represent a point in time."),
            ("Why do I see both seconds and milliseconds?", "Some systems (like Unix/Linux tools) use seconds, while others (like JavaScript) use milliseconds — we show both to avoid confusion."),
        ],
    },
    "lorem-ipsum-generator": {
        "how_to": [
            "Choose paragraphs, sentences, or words.",
            "Set the amount you need.",
            "Copy or download the generated placeholder text.",
        ],
        "faq": [
            ("Is this real Latin?", "It's inspired by the traditional Lorem Ipsum placeholder text, using the same vocabulary in randomized order."),
            ("Can I generate more than 50 units at once?", "The tool caps at 50 to keep results fast and manageable — generate it a few times if you need more."),
        ],
    },
}
