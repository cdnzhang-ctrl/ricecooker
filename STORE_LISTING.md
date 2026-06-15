# ricecooker Chrome Web Store Listing

## Short Description

Turn noisy articles into a quiet, Claude Code-inspired reader view with warm typography, focused layout, and clean code formatting.

## Detailed Description

ricecooker is a lightweight reader mode for Chrome. Open an article, click the extension, and ricecooker reformats the page into a centered reading view with warm paper colors, editorial body type, compact controls, and readable code blocks.

Features:

- Clean reader mode for articles and long-form pages.
- Light and dark themes.
- Adjustable width, text size, and type style.
- Code-aware formatting for technical articles.
- Copy cleaned article content as Markdown.
- Keyboard shortcut support.

ricecooker runs only when you activate it. Article extraction and formatting happen locally in your browser.

## Category

Productivity

## Privacy Notes

ricecooker does not collect, sell, transmit, or store personal data on external servers. It uses Chrome storage only to remember local reader preferences such as theme, width, text size, type style, and code display mode.

## Permission Rationale

- `activeTab`: lets ricecooker read and format the current page only after the user activates the extension.
- `scripting`: injects the reader script and styles into the current tab when activated.
- `storage`: remembers local reader settings.

