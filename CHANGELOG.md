# Changelog

Until version 1.0, any minor release may contain breaking changes.

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
