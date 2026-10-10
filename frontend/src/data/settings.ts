export type ReadingFont = 'story' | 'readable' | 'sans'
export type ReadingTheme = 'ivory' | 'white' | 'sepia' | 'night'
export type MotionPreference = 'off' | 'on'

export interface Settings {
  font: ReadingFont
  /** Reading text size in px at the browser default; stored as rem so zoom still applies. */
  size: number
  lineHeight: number
  theme: ReadingTheme
  motion: MotionPreference
  markers: boolean
}

export const defaultSettings: Settings = {
  font: 'story',
  size: 20,
  lineHeight: 1.75,
  theme: 'ivory',
  motion: 'off',
  markers: true,
}

const SETTINGS_KEY = 'readingbridge.settings'

const fontFamilies: Record<ReadingFont, string> = {
  story: 'var(--font-story)',
  readable: 'var(--font-readable)',
  sans: 'var(--font-ui)',
}

export function getSettings(): Settings {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Storage unavailable: the choice still applies until the page is closed.
  }
  applySettings(settings)
}

/** Puts the reader's choices onto :root, where the reading view and every preview pick them up. */
export function applySettings(settings: Settings): void {
  const root = document.documentElement
  root.style.setProperty('--reading-font-family', fontFamilies[settings.font])
  root.style.setProperty('--reading-font-size', `${settings.size / 16}rem`)
  root.style.setProperty('--reading-line-height', String(settings.lineHeight))
  // Motion stays off unless chosen; CSS still turns it off when the device asks for less.
  if (settings.motion === 'on') root.dataset.motion = 'on'
  else delete root.dataset.motion
}
