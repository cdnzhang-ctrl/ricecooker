# ricecooker Visual Rules

Use this document as the visual QA checklist for popup, reader, logotype, and store-asset changes.

## Typography Rules

### General

- Use system-safe font stacks only unless a bundled font is added intentionally.
- Do not use viewport-width font scaling.
- Keep letter spacing at `0` unless a small uppercase label truly needs tracking.
- Do not use negative letter spacing.
- Match type scale to surface size: compact UI gets compact type; article titles may be larger.

### Brand And Header

- `ricecooker` stays lowercase.
- Use official brand assets from `brand/` for visible logotypes.
- Prefer `brand/ricecooker-wordmark.svg` as the primary logotype.
- Pair `brand/cooker-sprite.svg` with the primary wordmark when horizontal space allows.
- Use `brand/ricecooker-terminal.svg` as a larger display/accent wordmark.
- Keep `brand/ricecooker-lockup.svg` available for store assets or wide layouts.
- Use the ASCII cooker prompt as a secondary brand moment, not as primary navigation text.
- Use `brand/ricecooker-lockup.svg` in the reader toolbar so the cooker icon and wordmark stay consistent.
- Avoid rebuilding the logo from live text.
- Avoid oversized brand text inside the popup.

### Reader Content

- Article titles should be large but controlled.
- Long titles should clamp or scale so they do not dominate the entire viewport.
- Section headings should be smaller than article titles and around medium-bold weight.
- Body copy should prioritize reading rhythm over brand expression.
- Code blocks and inline code must use monospace.

## Color Rules

### Light Mode

Use warm, readable paper colors:

- Page: warm off-white or paper.
- Surface: slightly lighter or softer paper.
- Text: near-black ink.
- Muted text: warm gray/brown.
- Borders: low-contrast tan.
- Accent: restrained rust/tan.

Current useful values:

```css
--paper: #efe4d6;
--paper-soft: #f8f1e8;
--ink: #171512;
--muted: #746b62;
--rule: #c7b7a4;
--button: #14120f;
--rust: #b96d4f;
```

### Dark Mode

Dark mode should feel like a warm reading tool, not a pure black terminal.

- Use near-black page backgrounds.
- Use dark warm card surfaces.
- Keep body contrast high.
- Keep rust/tan accents subtle.

### Avoid

- Purple or blue gradients.
- Pure white panels in warm-paper UI.
- Low-contrast gray text.
- Color as the only state indicator.
- Decorative color blobs, orbs, or background effects.

## Layout And Spacing Rules

- Keep popup width stable.
- Use compact vertical rhythm.
- Group controls into obvious sections.
- Use separators and borders for structure, not heavy cards everywhere.
- Do not put cards inside cards.
- Avoid large empty header areas.
- Leave enough padding that controls do not feel cramped.
- Use stable dimensions for buttons, select rows, icons, and toolbar controls.

Popup guidance:

- Header should be compact and brand-forward.
- Primary actions should sit immediately below the header.
- Settings should scan as a simple control list.
- Status should sit at the bottom and stay quiet.

Reader guidance:

- Toolbar controls should be available but secondary.
- Article content should sit centered.
- The first viewport should prioritize the article title and start of content, not UI chrome.

## Component Rules

### Buttons

Do:

- Use black fill for the primary command.
- Keep secondary buttons outlined or quiet.
- Keep labels short and direct.
- Provide visible hover and focus states.

Avoid:

- Oversized button text.
- Marketing-style pill buttons.
- Inconsistent button heights.
- Labels that wrap at popup width.

### Select Controls

Do:

- Use predictable labels: Theme, Width, Type, Size, Code.
- Keep values readable and aligned.
- Keep row heights consistent.

Avoid:

- Custom controls that obscure native select behavior.
- Hidden labels.
- Tiny hit targets.

### Icons And Marks

Do:

- Use the real extension icon where brand recognition matters.
- Keep icon size stable.
- Align icon and wordmark optically, not just mathematically.

Avoid:

- CSS-drawn placeholder marks.
- Decorative icons with no function.
- New icon styles that conflict with the extension icon.

## Popup Header Rules

Target direction:

- Official amber pixel cooker + pixel wordmark.
- ASCII cooker prompt as a compact terminal panel when the popup has room.
- Terminal wordmark may appear inside the terminal panel.
- No crowded version chip in the main brand line unless it has a clear release purpose.

Header QA:

- The lockup should feel crisp and intentional.
- The cooker mark should not overpower the wordmark.
- The header should not exceed the visual weight of the primary action row.
- The brand must fit on one line.
- The header should still look balanced without a version chip.

## Reader View Rules

Reader view should keep the current warm editorial direction:

- Center the article.
- Preserve useful article structure.
- Remove duplicate title, author, date, nav, ads, social widgets, and site chrome.
- Keep toolbar controls compact.
- Keep Copy and Exit buttons visually aligned with the other controls.
- Code blocks should look like intentional reading artifacts, not pasted browser defaults.

LitCharts and other study-guide pages:

- Use the page or chapter title as `h1`.
- Use labels such as `Summary & Analysis` as subtitle, not as part of the main title.
- Do not include theme legends, active-theme chips, unlock dialogs, footer links, or navigation text in article content.

## Visual QA Checklist

Before shipping a visual change, check:

- No text clipping.
- No overlapping UI.
- No button label wrapping.
- No oversized popup title.
- No cramped select rows.
- No generic SaaS styling.
- No decorative filler.
- No nested cards.
- No color-only state changes.
- Popup actions still work.
- Settings still persist.
- Reader title and subtitle are distinct.
- Markdown copy uses the same cleaned content.
- Light and dark reader themes remain readable.
