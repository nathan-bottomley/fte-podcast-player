# `<podcast-player>`

A themable, accessible audio player (light DOM, no shadow DOM) for podcast sites. One file, no dependencies.

Version 0.x: no promises. Anything can change in a minor release.

## Install

```sh
npm install github:nathan-bottomley/fte-podcast-player#v0.1.0
```

Then serve `node_modules/fte-podcast-player/podcast-player.js` to the browser (with Eleventy, a passthrough copy) and load it as a module or with `defer`.

## Markup

```html
<podcast-player duration="4062.1">
  <p data-player-title>Episode title (optional, the site's own markup)</p>
  <audio controls preload="none"><source src="…" type="audio/mpeg"></audio>
</podcast-player>
```

The `<audio controls>` is the no-JS fallback. On upgrade its native controls are turned off and ours are appended to the element.

Load the script as a module or with `defer`. The player builds itself from its children when it connects, so they must already be parsed.

Where the browser doesn't allow scripts to set the volume (iOS), there's no volume slider. The mute button stays.

## Attributes

| Attribute | Meaning |
| --- | --- |
| `duration` | Known duration in seconds, shown until the audio reports its own. |
| `playback-rates` | Space-separated playback rates the speed button cycles through. |
| `skip-back` | Seconds the back button skips (default 10). |
| `skip-forward` | Seconds the forward button skips (default 30). |

Attributes are read once, when the player connects, so changing them later does nothing. The exception is `duration`, which is read whenever it's needed. A missing or unusable value falls back to the default.

## API

`seekTo(seconds)`, and the `audio` property.

Browsers don't bubble the audio element's events. To hear them on the player, listen in the capture phase: `addEventListener(type, fn, true)`.

## Accessibility

- The player is `role="group"`. It's labelled by the `[data-player-title]` element if there is one (given a generated id if it has none). Otherwise it uses your own `aria-label`, or `Audio player` if you haven't set one.
- Every control is a native `<button>` or `<input type="range">`, so the keyboard works without extra code. The sliders have `aria-valuetext`: `1:23 of 45:00` for seek, a percentage for volume.
- Changing the speed also writes `Speed 1.2x` to a `role="status"` element, because a changed label on a focused button isn't reliably announced.
- The skip buttons are labelled with their number of seconds.
- Under forced colours the player uses system colours, and the seek thumb and tracks stay visible.

## Media Session

The title in the lock-screen and notification controls comes from `[data-player-title]`. Play, pause, seek back, seek forward and seek-to are wired up. The session belongs to the page, so only the player that last started playing updates it.

## Styling

There's no shadow DOM, so use ordinary selectors.

- **Parts:** `[data-part="controls|back|play|forward|time|current|duration|seek|mute|volume|speed|status"]`
- **Attributes the player sets:** `playing` while audio plays, `buffering` while it waits for data, e.g. `article:has(podcast-player[playing])`. These report state. Setting them yourself does nothing.

The icons are Font Awesome Free (CC BY 4.0), used unmodified. The licence notice is kept in `podcast-player.js` and must survive minification.

The player injects a small stylesheet in its own cascade layer, so a site's unlayered CSS overrides it.

The stylesheet is added once, as the last element in `<head>`. Its layer is therefore declared after the site's own layers, so it beats a site's resets (for `button` and `svg`, say) but still loses to any of the site's unlayered CSS.

Theme with these custom properties, set on `podcast-player` or any ancestor:

| Property | Controls |
| --- | --- |
| `--player-accent-color` | focus ring, seek thumb, and the filled seek bar unless `--player-track-fill-color` is set |
| `--player-background-color` | background |
| `--player-text-color` | text and icons |
| `--player-track-color` | seek bar groove, the unfilled part |
| `--player-track-fill-color` | filled part of the seek bar and volume slider (defaults to the accent) |
| `--player-border-color` | border |
| `--player-hover-background-color` | button hover background |
| `--player-font-family` | font |
| `--player-icon-size` | icon size |
| `--player-touch-size` | minimum button size (44px) |
| `--player-track-height` | seek track thickness |
| `--player-thumb-size` | seek thumb diameter |
| `--player-radius` | corner radius |
| `--player-padding-inline` | side padding inside the player: around the title and the time, and beside the seek bar and volume slider, so their left edges line up (default 0.5rem) |
| `--player-padding-block` | top and bottom padding of the title (default 0.25rem) |
| `--player-title-font-size` | size of the `[data-player-title]` text (default 0.875rem) |
| `--player-controls-font-size` | size of the time and speed text in the controls row (default 0.875rem) |
| `--player-skip-number-scale` | multiplier for the numbers on the skip icons (default 1). Use it if your font's digits run large or small. Stay between about 0.8 and 1.2: any larger and the digits start to meet the arrow's tail |
