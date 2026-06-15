# ricecooker

ricecooker is a Manifest V3 Chrome extension that turns noisy articles into a Claude Code-inspired reader view: warm paper, precise controls, editorial headings, and clean code treatment.

## Load The Extension

1. Open Chrome and go to `chrome://extensions`.
2. Enable `Developer mode`.
3. Choose `Load unpacked`.
4. Select this folder: `/Users/apple/Documents/Monet`.
5. Open an article page and click the ricecooker extension icon.

The keyboard command is `Command+Shift+Y` on macOS and `Ctrl+Shift+Y` elsewhere.

## Local Test Page

Use `demo-article.html` as a quick local test article after loading the extension. Open it in Chrome, run the extension, and verify the reader removes the page furniture while preserving headings, paragraphs, lists, blockquotes, and code blocks.

## Publish

The Chrome Web Store upload package is built at:

```text
/Users/apple/Documents/Monet/dist/ricecooker-0.1.0.zip
```

Use `STORE_LISTING.md` for the short description, detailed description, permission rationale, and privacy notes when filling out the Chrome Web Store Developer Dashboard.

## Files

- `manifest.json`: Chrome extension manifest.
- `background.js`: Keyboard command handler and content-script fallback injection.
- `popup.html`, `popup.css`, `popup.js`: Compact command panel and saved reader preferences.
- `content.js`: Article extraction, reader rendering, settings application, and Markdown copy.
- `reader.css`: Claude Code-style reader overlay.
- `demo-article.html`: Manual test fixture.
