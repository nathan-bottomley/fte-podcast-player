/* global HTMLElement, customElements, Audio, MediaMetadata, navigator, document */

/*!
 * The play, pause, volume and muted icon paths used here are from
 * Font Awesome Free 7.3.1 - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0)
 * Copyright 2026 Fonticons, Inc. Used unmodified.
*/

/* Icons */

const icons = {
  play: { width: 448, path: 'M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z' },
  pause: { width: 384, path: 'M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z' },
  volume: { width: 640, path: 'M533.6 32.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C557.5 113.8 592 180.8 592 256s-34.5 142.2-88.7 186.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C598.5 426.7 640 346.2 640 256S598.5 85.2 533.6 32.5zM473.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C475.3 170.7 496 210.9 496 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C393.1 227.6 400 241 400 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C434.1 312.9 448 286.1 448 256s-13.9-56.9-35.4-74.5zM80 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L128 160 80 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48z' },
  muted: { width: 576, path: 'M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z' }
}

const skipArrow = '<g transform="translate(20 -4)"><path d="M256 147A145 145 0 0 1 339 411" fill="none" stroke="currentColor" stroke-width="40"/><path d="M256 87L166 147L256 207z" stroke="currentColor" stroke-width="16" stroke-linejoin="round"/></g>'
const skipIcons = {
  back: { arrow: skipArrow, numberAt: [72, 436], numberAnchor: 'start' },
  forward: { arrow: `<g transform="matrix(-1 0 0 1 512 0)">${skipArrow}</g>`, numberAt: [440, 436], numberAnchor: 'end' }
}

function wrapInSvg (width, content) {
  return `<svg viewBox="0 0 ${width} 512" aria-hidden="true" focusable="false" fill="currentColor">${content}</svg>`
}

function renderIcon (name) {
  const { width, path } = icons[name]
  return wrapInSvg(width, `<path d="${path}"/>`)
}

function renderSkipIcon (direction, seconds) {
  const { arrow, numberAt, numberAnchor } = skipIcons[direction]
  const fontSize = String(seconds).length > 2 ? 150 : 220 // three digits need to be smaller to fit
  const number = `<text x="${numberAt[0]}" y="${numberAt[1]}" text-anchor="${numberAnchor}" font-weight="700" style="font-size: calc(${fontSize}px * var(--_skip-number-scale))">${seconds}</text>`
  return wrapInSvg(512, arrow + number)
}

/* Helpers */

function formatDuration (seconds) {
  const wholeSeconds = Math.floor(Number.isFinite(seconds) ? Math.max(0, seconds) : 0)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, '0')
  if (hours) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${remainingSeconds}`
  }
  return `${minutes}:${remainingSeconds}`
}

function parseSeconds (value, fallback) {
  const seconds = parseFloat(value)
  return seconds > 0 ? seconds : fallback
}

function parsePlaybackRates (value) {
  const defaultPlaybackRates = [0.7, 1, 1.2, 1.5, 1.7, 2]
  const playbackRates = (value ?? '')
    .split(/\s+/)
    .map(Number)
    .filter(rate => rate > 0)
    .sort((a, b) => a - b)

  if (playbackRates.length === 0) return defaultPlaybackRates

  return playbackRates
}

function volumeIsSettable () {
  const probe = new Audio()
  probe.volume = 0.5
  return probe.volume === 0.5
}

/* Custom element */

class PodcastPlayer extends HTMLElement {
  static #generatedIdCount = 0
  static #currentPlayer // the player that last claimed the media session

  #built = false
  #audio
  #parts = {} // the controls, keyed by name
  #scrubbing = false // the user is dragging the seek slider
  #skipBack = 10 // "what did they just say?"
  #skipForward = 30 // "skip this ad"

  /* Setting up */

  connectedCallback () {
    if (this.#built) return

    this.#audio = this.querySelector('audio')
    if (!this.#audio) return

    this.#audio.controls = false
    this.#skipBack = parseSeconds(this.getAttribute('skip-back'), this.#skipBack)
    this.#skipForward = parseSeconds(this.getAttribute('skip-forward'), this.#skipForward)

    this.setAttribute('role', 'group')
    this.#labelGroup()
    this.#renderControls()
    this.#setUpPlayback()
    this.#setUpPosition()
    this.#setUpVolume()
    this.#setUpSpeed()
    this.#setUpMediaSession()
    this.#built = true
  }

  #labelGroup () {
    if (this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby')) return

    const title = this.querySelector('[data-player-title]')
    if (title?.id) {
      this.setAttribute('aria-labelledby', title.id)
    } else if (title) {
      title.id = `podcast-player-title-${++PodcastPlayer.#generatedIdCount}`
      this.setAttribute('aria-labelledby', title.id)
    } else {
      this.setAttribute('aria-label', 'Audio player') // a group needs a name
    }
  }

  #renderControls () {
    const controls = document.createElement('div')
    controls.dataset.playerControls = ''
    controls.innerHTML = `
      <button type="button" data-player-back aria-label="Skip back ${this.#skipBack} seconds">${renderSkipIcon('back', this.#skipBack)}</button>
      <button type="button" data-player-play aria-label="Play">${renderIcon('play')}</button>
      <button type="button" data-player-forward aria-label="Skip forward ${this.#skipForward} seconds">${renderSkipIcon('forward', this.#skipForward)}</button>
      <span data-player-time><span data-player-current>0:00</span><span data-player-duration></span></span>
      <input type="range" data-player-seek aria-label="Seek" min="0" step="1" value="0">
      <button type="button" data-player-mute aria-label="Mute" aria-pressed="false">${renderIcon('volume')}</button>
      ${volumeIsSettable() ? '<input type="range" data-player-volume aria-label="Volume" min="0" max="1" step="0.05" value="1">' : ''}
      <button type="button" data-player-speed></button>
      <span data-player-status role="status"></span>`
    this.append(controls)

    const partNames = ['back', 'play', 'forward', 'time', 'current', 'duration', 'seek', 'mute', 'volume', 'speed', 'status']
    for (const name of partNames) this.#parts[name] = controls.querySelector(`[data-player-${name}]`)
  }

  #setUpPlayback () {
    const audio = this.#audio
    const { play } = this.#parts

    const showPlayState = () => {
      play.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause')
      play.innerHTML = renderIcon(audio.paused ? 'play' : 'pause')
      this.toggleAttribute('playing', !audio.paused)
    }

    showPlayState()
    for (const type of ['play', 'pause', 'ended']) audio.addEventListener(type, showPlayState)

    play.addEventListener('click', () => (audio.paused ? this.#play() : audio.pause()))

    audio.addEventListener('waiting', () => this.toggleAttribute('buffering', true))
    for (const type of ['playing', 'canplay', 'pause', 'emptied']) {
      audio.addEventListener(type, () => this.toggleAttribute('buffering', false))
    }
  }

  #setUpPosition () {
    const audio = this.#audio
    const { seek, back, forward } = this.#parts

    // While the user drags, or a seek is still in flight, audio.currentTime
    // is stale or in flux. Ignore it so the bar doesn't jump back.
    const showAudioPosition = () => {
      if (!this.#scrubbing && !audio.seeking) this.#showPosition(audio.currentTime)
    }

    showAudioPosition()
    for (const type of ['timeupdate', 'seeked', 'durationchange', 'loadedmetadata']) {
      audio.addEventListener(type, showAudioPosition)
    }

    seek.addEventListener('input', () => {
      this.#scrubbing = true
      this.#showPosition(seek.valueAsNumber)
    })
    seek.addEventListener('change', () => {
      this.#scrubbing = false
      this.seekTo(seek.valueAsNumber)
    })

    back.addEventListener('click', () => this.seekTo(audio.currentTime - this.#skipBack))
    forward.addEventListener('click', () => this.seekTo(audio.currentTime + this.#skipForward))
  }

  #setUpVolume () {
    const audio = this.#audio
    const { mute, volume } = this.#parts

    const showVolume = () => {
      const silent = audio.muted || audio.volume === 0
      mute.innerHTML = renderIcon(silent ? 'muted' : 'volume')
      mute.setAttribute('aria-pressed', String(silent))
      if (volume) {
        const level = audio.muted ? 0 : audio.volume
        volume.value = level
        volume.setAttribute('aria-valuetext', `${Math.round(level * 100)}%`) // the raw value is 0 to 1
        volume.style.setProperty('--_filled', `${level * 100}%`)
      }
    }

    showVolume()
    audio.addEventListener('volumechange', showVolume)

    mute.addEventListener('click', () => {
      if (audio.volume === 0) {
        // Silent because the slider is at zero, not because of mute: turn it back up.
        audio.volume = 1
        audio.muted = false
      } else {
        audio.muted = !audio.muted
      }
    })
    volume?.addEventListener('input', () => {
      audio.muted = false
      audio.volume = volume.valueAsNumber
    })
  }

  #setUpSpeed () {
    const audio = this.#audio
    const { speed, status } = this.#parts
    const playbackRates = parsePlaybackRates(this.getAttribute('playback-rates'))

    const showSpeed = () => {
      speed.textContent = `${audio.playbackRate}x`
      speed.setAttribute('aria-label', `Playback speed: ${audio.playbackRate}x`)
    }

    showSpeed()
    audio.addEventListener('ratechange', showSpeed)

    speed.addEventListener('click', () => {
      audio.playbackRate = playbackRates.find(rate => rate > audio.playbackRate) ?? playbackRates[0]
      // A changed label on a focused button isn't reliably announced.
      status.textContent = `Speed ${audio.playbackRate}x`
    })
  }

  #setUpMediaSession () {
    if (!('mediaSession' in navigator)) return

    const audio = this.#audio
    const session = navigator.mediaSession

    const updatePosition = () => {
      if (PodcastPlayer.#currentPlayer !== this) return

      const duration = this.#duration
      if (!duration) return

      try {
        session.setPositionState({
          duration,
          playbackRate: audio.playbackRate,
          position: Math.min(audio.currentTime, duration)
        })
      } catch {} // some browsers reject out-of-range values
    }

    audio.addEventListener('play', () => {
      PodcastPlayer.#currentPlayer = this
      session.metadata = new MediaMetadata({
        title: this.querySelector('[data-player-title]')?.textContent.trim() ?? ''
      })

      const handlers = {
        play: () => this.#play(),
        pause: () => audio.pause(),
        seekbackward: details => this.seekTo(audio.currentTime - (details.seekOffset || this.#skipBack)),
        seekforward: details => this.seekTo(audio.currentTime + (details.seekOffset || this.#skipForward)),
        seekto: details => this.seekTo(details.seekTime)
      }
      for (const [action, handler] of Object.entries(handlers)) {
        try { session.setActionHandler(action, handler) } catch {} // unsupported action
      }
      updatePosition()
    })

    for (const type of ['durationchange', 'ratechange', 'seeked']) {
      audio.addEventListener(type, updatePosition)
    }
    // timeupdate keeps the lock-screen scrubber honest, but only matters while playing.
    audio.addEventListener('timeupdate', () => { if (!audio.paused) updatePosition() })
  }

  /* public API */

  get audio () {
    return this.#audio
  }

  seekTo (seconds) {
    const end = this.#duration || Infinity
    const target = Math.min(Math.max(0, seconds), end)
    this.#audio.currentTime = target
    // The browser doesn't fire timeupdate events until data has loaded, so update the display ourselves
    this.#showPosition(target)
  }

  /* Private helpers */

  #play () {
    return this.#audio.play().catch(error => {
      if (error.name !== 'AbortError') throw error // paused again before playback began
    })
  }

  get #duration () {
    const fromAudio = this.#audio.duration
    return Number.isFinite(fromAudio) ? fromAudio : parseFloat(this.getAttribute('duration')) || 0
  }

  #showPosition (time) {
    const { seek, current, duration } = this.#parts
    const totalDuration = this.#duration
    seek.max = totalDuration
    seek.value = time
    seek.style.setProperty('--_filled', totalDuration ? `${(time / totalDuration) * 100}%` : '0%')
    seek.setAttribute('aria-valuetext', `${formatDuration(time)} of ${formatDuration(totalDuration)}`)
    current.textContent = formatDuration(time)
    duration.textContent = ` / ${formatDuration(totalDuration)}`
  }
}

/* Styles */

const componentStyles = /* css */ `
  @layer podcast-player {
  /* Each public --player-* property is resolved to its default once, here.
     The rules below use these --_ versions. */
  podcast-player {
    --_accent: var(--player-accent-color, AccentColor);
    --_background: var(--player-background-color, Canvas);
    --_text: var(--player-text-color, CanvasText);
    --_track: var(--player-track-color, color-mix(in srgb, CanvasText 25%, transparent));
    --_track-fill: var(--player-track-fill-color, var(--_accent));
    --_border: var(--player-border-color, color-mix(in srgb, CanvasText 30%, transparent));
    --_hover: var(--player-hover-background-color, color-mix(in srgb, CanvasText 10%, transparent));
    --_icon: var(--player-icon-size, 1.25rem);
    --_touch: var(--player-touch-size, 44px);
    --_track-height: var(--player-track-height, 0.25rem);
    --_thumb: var(--player-thumb-size, 0.625rem);
    --_radius: var(--player-radius, 0.5rem);
    --_padding-inline: var(--player-padding-inline, 0.5rem);
    --_padding-block: var(--player-padding-block, 0.25rem);
    --_title-font-size: var(--player-title-font-size, 0.875rem);
    --_controls-font-size: var(--player-controls-font-size, 0.875rem);
    --_skip-number-scale: var(--player-skip-number-scale, 1);

    display: block;
    inline-size: 100%;
    color: var(--_text);
    background: var(--_background);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    font-family: var(--player-font-family, inherit);
  }

  /* No-JS fallback: the native controls */
  podcast-player audio {
    display: block;
    inline-size: 100%;
  }

  /* The site's own title element, given the player's spacing so everything lines up */
  podcast-player [data-player-title] {
    margin: 0;
    padding: var(--_padding-block) var(--_padding-inline);
    font-size: var(--_title-font-size);
  }

  podcast-player [data-player-controls] {
    display: flex;
    align-items: center;
    padding-block: 0.125rem;
  }

  podcast-player button {
    display: grid;
    flex: none;
    place-items: center;
    min-inline-size: var(--_touch);
    block-size: var(--_touch);
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: 0;
    border-radius: var(--_radius);
    cursor: pointer;
  }

  podcast-player button:hover {
    background: var(--_hover);
  }

  podcast-player :is(button, input):focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: -4px;
  }

  podcast-player svg {
    inline-size: var(--_icon);
    block-size: var(--_icon);
  }

  /* The skip arcs are wide and shallow, and carry a number, so they get more room */
  podcast-player :is([data-player-back], [data-player-forward]) svg {
    inline-size: calc(var(--_icon) * 1.5);
    block-size: calc(var(--_icon) * 1.5);
  }

  podcast-player [data-player-time],
  podcast-player [data-player-speed] {
    font-size: var(--_controls-font-size);
    font-variant-numeric: tabular-nums;
  }

  podcast-player [data-player-time] {
    padding-inline: var(--_padding-inline);
    white-space: nowrap;
  }

  /* Range inputs: the seek and volume sliders */
  podcast-player input[type="range"] {
    appearance: none;
    min-inline-size: 0;
    block-size: var(--_touch);
    margin: 0 var(--_padding-inline);
    background: none;
    cursor: pointer;
  }

  podcast-player [data-player-seek] {
    flex: 1 1 6rem;
  }

  podcast-player [data-player-volume] {
    flex: 0 1 4rem;
  }

  /* --_filled (how far the fill reaches) is set by the script on each slider.
     The WebKit and Firefox rules can't share one selector list: a list that
     contains an unknown vendor pseudo-element is dropped whole. */
  podcast-player input[type="range"]::-webkit-slider-runnable-track {
    block-size: var(--_track-height);
    border-radius: var(--_track-height);
    background: linear-gradient(to right, var(--_track-fill) var(--_filled, 0%), var(--_track) var(--_filled, 0%));
  }

  podcast-player input[type="range"]::-moz-range-track {
    block-size: var(--_track-height);
    border-radius: var(--_track-height);
    background: linear-gradient(to right, var(--_track-fill) var(--_filled, 0%), var(--_track) var(--_filled, 0%));
  }

  podcast-player input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    inline-size: var(--_thumb);
    block-size: var(--_thumb);
    margin-block-start: calc((var(--_track-height) - var(--_thumb)) / 2);
    background: var(--_accent);
    border: 0;
    border-radius: 50%;
  }

  podcast-player input[type="range"]::-moz-range-thumb {
    inline-size: var(--_thumb);
    block-size: var(--_thumb);
    background: var(--_accent);
    border: 0;
    border-radius: 50%;
  }

  /* Forced colours (Windows High Contrast) swaps author colours for system ones.
     Redraw the groove, fill and thumb from system colours so they stay visible. */
  @media (forced-colors: active) {
    podcast-player input[type="range"]::-webkit-slider-runnable-track {
      outline: 1px solid CanvasText; /* not a border, which would nudge the thumb off-centre */
      background: linear-gradient(to right, Highlight var(--_filled, 0%), Canvas var(--_filled, 0%));
    }

    podcast-player input[type="range"]::-moz-range-track {
      outline: 1px solid CanvasText; /* not a border, which would nudge the thumb off-centre */
      background: linear-gradient(to right, Highlight var(--_filled, 0%), Canvas var(--_filled, 0%));
    }

    podcast-player input[type="range"]::-webkit-slider-thumb {
      background: CanvasText;
    }

    podcast-player input[type="range"]::-moz-range-thumb {
      background: CanvasText;
    }
  }

  /* Screen-reader announcements only */
  podcast-player [data-player-status] {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* Waiting for data */
  podcast-player[buffering] [data-player-seek] {
    opacity: 0.7;
  }

  /* Narrow: the seek slider drops to its own row, and the volume slider goes */
  @media (width < 500px) {
    podcast-player [data-player-controls] {
      flex-wrap: wrap;
    }

    podcast-player [data-player-time] {
      margin-inline-end: auto;
    }

    podcast-player [data-player-seek] {
      order: 1;
      flex-basis: 100%;
    }

    /* On its own row the slider needn't be a full touch-size tall; that only leaves a chin.
       The attribute selectors outrank the generic range-input rule. */
    podcast-player input[type="range"][data-player-seek] {
      block-size: calc(var(--_touch) * 0.65);
    }

    podcast-player [data-player-volume] {
      display: none;
    }
  }

  @media (width < 380px) {
    podcast-player [data-player-duration] {
      display: none;
    }
  }
}`

if (!document.querySelector('style[data-podcast-player]')) {
  const style = document.createElement('style')
  style.dataset.podcastPlayer = ''
  style.textContent = componentStyles
  document.head.append(style)
}

customElements.define('podcast-player', PodcastPlayer)
