# PRD: Claude Code-Style Reader Extension

## Product Name

Working title: `ricecooker`

A Chrome extension that converts noisy web articles into a calm, single-style reading view inspired by Claude Code's developer-event visual language: warm paper background, monospace controls, editorial serif headings, ASCII/terminal details, and precise low-friction formatting.

## Product Vision

Make any article feel like a clean technical briefing: readable, distraction-free, visually consistent, and subtly developer-native.

This is not a generic "minimal reader mode." It should feel like Safari Reader passed through Claude Code: warm, typographic, terminal-aware, and designed for people who read deeply across blogs, docs, essays, newsletters, and engineering posts.

## Target Users

- Developers reading technical blogs, docs, RFCs, changelogs, and long-form articles.
- Researchers, founders, designers, and power readers who want less visual clutter.
- Users who like Claude Code's aesthetic and want reading to feel more focused and tool-like.

## Core User Problem

Web articles are visually inconsistent: ads, popups, sidebars, font chaos, poor contrast, newsletter banners, and layout clutter interrupt reading. Existing reader modes solve readability, but they usually feel generic, browser-native, or visually bland.

## Product Goals

- Extract the main article content reliably.
- Reformat text into one consistent Claude Code-inspired style.
- Preserve useful article structure: title, author, date, headings, links, code blocks, images, lists, quotes.
- Let users toggle reader mode instantly from the extension icon.
- Make the reader view feel intentionally designed, not like a browser utility page.

## Non-Goals

- Not an RSS reader in MVP.
- Not a bookmarking/read-it-later product in MVP.
- Not a note-taking app in MVP.
- Not an AI summarizer in the first version, unless added as an optional later feature.
- Not trying to reproduce Anthropic branding exactly; it should be inspired by Claude Code, not impersonate it.

## MVP User Flow

1. User opens an article page.
2. User clicks the Chrome extension icon.
3. Extension extracts article content.
4. Page transforms into reader mode.
5. User can adjust a small set of controls: type size, width, theme, code-friendly mode.
6. User clicks again or presses Escape to return to the original page.

## Primary Features

- One-click reader mode.
- Automatic article extraction.
- Unified typography and spacing.
- Claude Code-style visual theme.
- Code block preservation with terminal-like styling.
- Image preservation with captions where available.
- Reading preferences saved locally.
- Keyboard shortcut support.
- Restore original page without reload when possible.

## Reader Style

Visual direction: `Warm Terminal / ASCII Modernism`.

Core style formula:

```text
warm paper background + serif article title + monospace metadata/body controls + thin grid lines + black command-style buttons + subtle ASCII details
```

Design tokens:

- Background: `#EEDCCE` or `#F1E1D3`
- Text: `#111111`
- Muted text: `#6F6862`
- Rule/border: `#B8ADA3`
- Button fill: `#10100F`
- Accent rust: `#C8643E`

Typography:

- Article title: serif, such as `Georgia`, `Lora`, or `Tiempos-like`
- Body: readable serif or mono-toggle depending on mode
- UI controls: monospace, such as `SF Mono`, `IBM Plex Mono`, or `JetBrains Mono`
- Code blocks: monospace only

## Interface Requirements

- Extension popup should be compact and command-like.
- Reader toolbar should feel like a terminal header, not a floating SaaS toolbar.
- Controls should use short labels:
  - `Reader`
  - `Width`
  - `Type`
  - `Theme`
  - `Code`
  - `Exit`
- Avoid colorful icons, glassmorphism, gradients, or generic rounded SaaS cards.
- Use thin separators and strong alignment.

## Functional Requirements

- Detect main article content using a readability parser.
- Remove ads, nav, cookie banners, related posts, social widgets, and comments.
- Preserve:
  - title
  - subtitle/dek
  - author
  - publish date
  - headings
  - paragraphs
  - links
  - images
  - blockquotes
  - lists
  - tables where possible
  - code blocks
- Support dynamic pages after content loads.
- Support keyboard shortcut, such as `Cmd/Ctrl + Shift + R`.
- Save settings in Chrome local storage.
- Work on common article sites, blogs, docs, and newsletters.

## Reader Controls

- Font size: small / default / large
- Line width: narrow / standard / wide
- Theme:
  - `Paper`
  - `Ink`
  - `Terminal`
- Body font:
  - `Editorial`
  - `Mono`
- Code emphasis:
  - normal
  - high contrast
- Optional: copy clean Markdown.

## Claude Code-Inspired Details

Reader header can show:

```text
◓ Parsing article...
~/ricecooker/article
```

Loading state can use terminal-style progress:

```text
Extracting main content...
Removing page noise...
Formatting text...
```

Empty/error state:

```text
Could not find a readable article.
Try selecting text, then run Reader again.
```

Subtle ASCII motif can appear in the corner or loading screen, but should never reduce readability.

## Success Metrics

- Reader mode activation rate.
- Successful extraction rate.
- Average reading session duration.
- Percentage of users who keep reader mode active for more than 60 seconds.
- Preference retention: users who return after configuring style.
- Low exit-after-activation rate, indicating extraction quality.

## Edge Cases

- Paywalled pages: only format accessible content.
- Docs pages with side navigation: preserve main doc content, remove nav.
- Article pages with many code blocks: prioritize code readability.
- Image-heavy articles: preserve images but constrain width.
- Failed extraction: offer selected-text mode as fallback.

## V1.1 / Future Ideas

- Save article as clean Markdown.
- Send article to Notion/Obsidian.
- AI summary in Claude-like brief format.
- Explain code blocks mode.
- Reading progress indicator.
- Site-specific formatting rules.
- Read-it-later library.
- Sync preferences across browsers.

## MVP Acceptance Criteria

- User can activate reader mode on a normal article page in one click.
- Extracted article is readable without ads/nav/sidebar clutter.
- Typography, colors, and layout match the Claude Code-style direction.
- Code blocks remain intact and readable.
- User preferences persist across sessions.
- User can exit reader mode cleanly.

## Product Principle

This extension should feel like a quiet developer tool for reading the web: less "browser feature," more "well-crafted command line for attention."
