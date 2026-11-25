# Changelog

Until version 1.0, any minor release may contain breaking changes.

## 0.2.2 (2026-11-26)

### Changed

- The narrow layout, where the seek slider drops to its own row and the volume slider is hidden, now depends on the width of the player, not the width of the window. It starts when the player is narrower than 540px (it was 500px of window width), so the seek slider is never squeezed to almost nothing. The player is now a query container (`container-type: inline-size`).
- In the narrow layout, the seek slider's side margins now line up its ends with the icons in the row above.
- The duration is hidden when the player is narrower than 380px, again measured on the player and not the window.

## 0.2.1 (2026-11-22)

### Changed

- The playback speed is now written with a multiplication sign (`1.2×`) instead of the letter x, in the speed button, its `aria-label` and the status announcement.

## 0.2.0 (2026-11-22)

### Breaking

- The `data-part` attributes were renamed to `data-player-…`. For example, `[data-part="seek"]` is now `[data-player-seek]`. All twelve parts changed, so update any CSS that selects them. See the Styling section of the README for the full list.

### Changed

- If you set `aria-label` or `aria-labelledby` on `<podcast-player>`, the player now leaves it alone. Before, a `[data-player-title]` element would override your `aria-label`.
- The README was rewritten and now documents the API, the accessibility features, the Media Session support and the `data-player-…` attributes.

## 0.1.0 (2026-11-22)

First release as a standalone package. The player was previously part of the 500 Year Diary website.
