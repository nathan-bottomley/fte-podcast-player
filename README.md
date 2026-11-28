# `<podcast-player>`

A themable, accessible audio player for podcast sites. One file, no dependencies.

`<podcast-player>` has not yet reached version 1.0, and so its API may change at any time. A stable version 1.0 will be released before the end of 2026.

## Install

First, `npm install` the package.

```sh
npm install github:nathan-bottomley/fte-podcast-player#semver:^0.2.0
```

Then serve `node_modules/fte-podcast-player/podcast-player.js` to the browser and load it with `type="module"`.

```html
<script type="module" src="/js/podcast-player.js"></script>
```

## Markup

```html
<podcast-player duration="4062.1" artist="Podcast name" artwork="/img/podcast-logo.jpg" remember-speed>
  <p data-player-title>Episode title</p>
  <audio controls preload="none"><source src="…" type="audio/mpeg"></audio>
</podcast-player>
```

`<podcast-player>` wraps an `<audio controls>` element whose source is the audio file, and an optional element with a `data-player-title` attribute: the content of this element serves as the episode title. From that markup, it creates a custom themable player UI. If the script fails to load, the browser will fall back to its default audio player.

The player has a play/pause button, skip back and skip forward buttons, a seek slider with the current time and duration, a mute button, a volume slider (where the browser allows volume to be set), and a playback speed button.

## Attributes

The `<podcast-player>` element supports the following attributes:

| Attribute | Meaning |
| --- | --- |
| `duration` | Known duration in seconds, shown until the audio reports its own |
| `playback-rates` | A space-separated list of playback rates cycled through by pressing the speed button (default `0.7 1 1.2 1.5 1.7 2`) |
| `skip-back` | Seconds skipped by the back button (default 10) |
| `skip-forward` | Seconds skipped by the forward button (default 30) |
| `remember-speed` | Boolean. Saves the playback speed in the browser's `localStorage` when the person listening changes it, and applies it to every player on the site that has this attribute. A saved speed that isn't one of the player's `playback-rates` is ignored. Nothing is stored without it |
| `artist` | Name shown under the title by the media session, usually the name of the podcast |
| `artwork` | URL of the image shown by the media session. A relative URL is resolved against the page's address |

All these attributes are optional. Attributes are read once, when the player connects, so changing them later has no effect. The exceptions are `duration`, which is read whenever it's needed and is used only until the audio reports its own duration, and `artist` and `artwork`, which are read each time the player starts playing.

## API

| Member | Kind | What it does |
| --- | --- | --- |
| `seekTo(seconds)` | Method | Moves the playhead to `seconds`, limited to the length of the audio. The display updates straight away. |
| `audio` | Read-only property | The `<audio>` element inside the player. Use it to call `play()` and `pause()`, to read `currentTime`, to listen for events with `addEventListener()`, and so on. |

## Accessibility

The player is designed to be accessible. It uses native `<button>` and `<input type="range">` elements, so that keyboard navigation works, and its controls are labelled for people using screen readers.

- The player has `role="group"`. You can set `aria-label` or `aria-labelledby` on the player yourself. If you don't, the group is named from the content of the `[data-player-title]` element, or `"Audio player"` if there isn't one.
- Buttons announce their state (Play/Pause, mute on/off) and have a default minimum 44px target size.
- The seek slider uses `aria-valuetext` to describe the current position in the audio and the audio's total duration (`"1:23 of 45:00"`).
- The volume slider uses `aria-valuetext` to describe the current volume level (`"75%"`).
- Changing the speed writes `"Speed 1.2×"` to a visually hidden `[data-player-status]` element, which is a live region so that screen readers will announce the change.
- If the audio fails to load, the player shows "Audio failed to load" in a `[data-player-error]` element with `role="alert"`, so that screen readers announce it.
- The skip buttons have labels that include the number of seconds (`"Skip forward 30 seconds"`).
- When a forced colours mode is active (such as a Windows contrast theme), the browser applies system colours, and the player redraws the seek and volume sliders so their tracks and thumbs remain visible.

## Media Session

The player uses [the page's media session][] to drive the lock-screen and notification controls. While audio plays, they show the title, artist and artwork of the most recently started player, and play, pause, seek back, seek forward and seek-to all work.

The title is the content of the `[data-player-title]` element or, if there isn't one, the `aria-label` that you set on the player.

[the page's media session]: https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API

## Styling

`podcast-player` doesn't use the shadow DOM, so you can style it using ordinary selectors.

Each part of the player has its own `data-player-…` attribute to select it:

| Selector | Element |
| --- | --- |
| `[data-player-controls]` | The row that holds all the controls |
| `[data-player-back]` | The skip back button |
| `[data-player-play]` | The play/pause button |
| `[data-player-forward]` | The skip forward button |
| `[data-player-time]` | Wraps the current time and the duration |
| `[data-player-current]` | The current time |
| `[data-player-duration]` | The duration, with its leading slash |
| `[data-player-seek]` | The seek slider |
| `[data-player-mute]` | The mute button |
| `[data-player-volume]` | The volume slider (missing where the browser doesn't allow volume to be set) |
| `[data-player-speed]` | The playback speed button |
| `[data-player-status]` | The visually hidden live region that announces speed changes |
| `[data-player-error]` | The message "Audio failed to load", which is empty (and not displayed) unless the audio has failed |

`data-player-title` is the one attribute that you add yourself, to your own title element.

The player also sets two attributes on `<podcast-player>`: `playing` while audio plays and `buffering` while it waits for data, for example `article:has(podcast-player[playing])`. These report state. Setting them yourself does nothing.

The player injects a small stylesheet, once, as the last element in `<head>`, in its own cascade layer. The layer is therefore declared after the site's own layers, so it beats a site's resets (for `button` and `svg`, say) but still loses to any of the site's unlayered CSS.

These custom properties can be set on `podcast-player` or any ancestor:

| Property | Controls |
| --- | --- |
| `--player-accent-color` | focus ring, seek thumb, and the filled part of the seek slider unless `--player-track-fill-color` is set |
| `--player-background-color` | background |
| `--player-text-color` | text and icons |
| `--player-track-color` | seek and volume slider grooves, the unfilled part |
| `--player-track-fill-color` | filled part of the seek and volume sliders (defaults to the accent) |
| `--player-track-border-color` | a 1px outline around the seek and volume slider tracks (default transparent) |
| `--player-border-color` | border |
| `--player-hover-background-color` | button hover background |
| `--player-font-family` | font |
| `--player-icon-size` | icon size |
| `--player-touch-size` | minimum button size (default 44px) |
| `--player-track-height` | seek and volume track thickness |
| `--player-thumb-size` | seek thumb diameter |
| `--player-radius` | corner radius |
| `--player-padding-inline` | side padding inside the player: around the title and the time, and beside the seek and volume sliders, so their left edges line up (default 0.5rem) |
| `--player-padding-block` | top and bottom padding of the title (default 0.25rem) |
| `--player-title-font-size` | size of the `[data-player-title]` text (default 0.875rem) |
| `--player-controls-font-size` | size of the time and speed text in the controls row (default 0.875rem) |
| `--player-skip-number-scale` | multiplier for the numbers on the skip icons (default 1). Use it if your font's digits run large or small. Stay between about 0.8 and 1.2: any larger and the digits start to meet the arrow's tail |

## Avoiding a layout shift

Until the script has run, the browser shows its own audio player, and the page below it can shift when the custom player replaces it. If you see that, reserve the space with a rule in your own CSS:

```css
podcast-player:not(:defined) {
  display: block;
  min-block-size: 3.5rem; /* the height of your built player */
}
```

Don't hide the audio element this way. If the script fails to load, it is the player people are left with.

## Licence

`fte-podcast-player` is released under the [ISC licence](LICENSE), a short permissive licence much like MIT. You can use, copy, modify and distribute it, including in commercial projects, as long as the copyright notice and licence text stay with it.

The icons are Font Awesome Free (CC BY 4.0), used unmodified. The licence notice is kept in `podcast-player.js` and must survive minification.
