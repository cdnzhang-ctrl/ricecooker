# ricecooker Design Document

## Product Design Principle

ricecooker is a quiet tool for reading the web. It should make noisy article pages feel calm, focused, and locally controlled without turning the extension into a dashboard or a branded content platform.

The product should feel like:

- A reader mode first.
- A small developer-native utility second.
- A warm editorial surface, not a generic browser popup.

The design should reduce friction around three actions: open the reader, tune the reading view, and copy clean Markdown.

## Visual Personality

ricecooker should sit between editorial reading and precise tooling.

Use:

- Warm paper surfaces.
- High-contrast ink text.
- Restrained rust/tan accents.
- Compact controls.
- Strong alignment and quiet separators.
- Typography that feels intentional at small sizes.

Avoid:

- Generic SaaS cards.
- Decorative filler.
- Heavy gradients.
- Oversized type inside tool surfaces.
- One-note beige styling with no contrast.
- Direct imitation of another product brand.

## Screen Roles

### Popup

The popup is a command surface. It should be compact, legible, and immediately actionable.

Primary jobs:

- Show the ricecooker identity.
- Open or close reader mode.
- Copy Markdown.
- Let the user adjust saved reader preferences.
- Report concise status.

The popup should not explain the whole product. It should assume the user opened it to act.

### Reader View

The reader view is the main experience. It should feel calm and expansive, with article content centered and page furniture removed.

Primary jobs:

- Present the cleaned article clearly.
- Keep reader controls available but visually secondary.
- Preserve useful structure: title, subtitle, headings, links, lists, code, images, tables, and blockquotes.
- Avoid duplicated metadata.

### Store And Promo Assets

Store assets should show the actual reading experience, not abstract marketing art. They should emphasize quiet focus, clean typography, and local control.

## Brand And Logotype

The product name is always lowercase: `ricecooker`.

Preferred popup header direction:

- Use the pixel wordmark from `brand/ricecooker-wordmark.svg` as the primary visible logotype.
- Pair it with `brand/cooker-sprite.svg` in the popup header when space allows.
- Use `brand/ricecooker-terminal.svg` as a display/accent wordmark, especially on dark terminal panels.
- Use the amber/orange lockup on warm paper and dark terminal surfaces.
- Use the ASCII cooker prompt as a secondary brand moment when there is room.
- In the reader toolbar, prefer `brand/ricecooker-lockup.svg`; it should stay compact so it feels like utility chrome, not a brand billboard.
- Keep the header compact and balanced.

Recommended wordmark feel:

- Lowercase.
- Monospace.
- Pixel/terminal-adjacent.
- Asset-based rather than recreated in CSS.
- No negative letter spacing.

The pixel cooker mark should replace the older serif `r` icon wherever Chrome or the UI displays the extension identity.

## Interaction Principles

- One click should open or close the reader.
- Controls should be obvious without instructional copy.
- Settings should persist locally and apply live when the reader is active.
- Status text should be short and state-based, such as `Ready.`, `Reader active.`, or `Markdown copied.`
- Copy actions should confirm success without taking over the layout.
- Keyboard support should remain available, but shortcut instructions should not dominate the popup.

## Accessibility And Readability

- Text must not clip, overlap, or wrap awkwardly at the popup width.
- Reader titles must not become giant blocks on narrow screens.
- Button labels must fit without changing button dimensions.
- Focus states must be visible.
- Touch/click targets should remain comfortable.
- Body text contrast should stay high in light and dark themes.
- Controls should be usable without color as the only signal.

## Version Notes

### V1.1 Extraction

V1.1 added targeted LitCharts extraction so reader mode captures essential summary and analysis content without menu, footer, theme legend, or paywall chrome.

### V1.2 Popup Style

V1.2 began refining the popup as a compact command surface and clarified that the brand area should not use generic heavy sans typography.

### V1.3 Brand Assets

V1.3 adopts the dedicated ricecooker brand asset pack: amber pixel cooker mark, pixel primary wordmark, terminal display wordmark, lockup SVG, and ASCII prompt mark. Future brand work should use these assets directly instead of rebuilding the logo with live text.
