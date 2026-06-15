# ricecooker - brand assets

Retro-tech / amber-terminal identity for the ricecooker reader extension.
The mark is a hand-built 8-bit rice cooker; the wordmark is monospace.
Everything is amber-orange on screen black.

## Palette
  amber          #D97757   (primary - Claude orange / CRT phosphor)
  phosphor tint  #ECA982   (steam / highlight pixels)
  screen black   #16120E   (dark surfaces / tiles)

## Contents

icon/
  cooker-sprite.svg            vector pixel mark, transparent bg (scales infinitely)
  cooker-tile.svg              vector mark on rounded screen-black tile
  png/icon-16|32|48|128.png    dark-tile icons - drop straight into a Chrome extension
  png/icon-512.png             large showcase tile
  png-transparent/icon-*.png   orange pixels, transparent bg (for light/dark toolbars)

wordmark/
  ricecooker-mono.svg|.png      Space Mono bold  (recommended)
  ricecooker-terminal.svg|.png  VT323
  ricecooker-pixel.svg|.png     Press Start 2P
  (SVGs are outlined - no font needed to view or edit)

lockup/
  ricecooker-lockup.svg|.png    pixel mark + mono wordmark, horizontal

ascii/
  ricecooker.txt                the ASCII cooker + prompt (paste anywhere)
  ricecooker-ascii.svg          terminal-framed render (font embedded)

fonts/
  the three OFL fonts + sources, in case you want to set new text

## Chrome manifest (manifest v3)

  "icons": {
    "16": "icon/png/icon-16.png",
    "32": "icon/png/icon-32.png",
    "48": "icon/png/icon-48.png",
    "128": "icon/png/icon-128.png"
  },
  "action": {
    "default_icon": {
      "16": "icon/png-transparent/icon-16.png",
      "32": "icon/png-transparent/icon-32.png"
    }
  }
