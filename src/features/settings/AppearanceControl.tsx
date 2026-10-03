import { useEffect, useMemo, useState } from 'react'
import './appearance.css'

type ThemeName = 'light' | 'sepia' | 'forest' | 'night'
type FontChoice = 'serif' | 'sans' | 'rounded'

type AppearancePreferences = {
  theme: ThemeName
  fontScale: number
  fontFamily: FontChoice
  readerText: string
  background: string
}

const storageKey = 'biblia-appearance-v1'

const themes: Record<
  ThemeName,
  {
    label: string
    bg: string
    surface: string
    surfaceStrong: string
    readerSurface: string
    ink: string
    muted: string
    line: string
    brand: string
    accent: string
    accentSoft: string
    glass: string
    glassStrong: string
    glassBorder: string
    readerText: string
  }
> = {
  light: {
    label: 'Claro',
    bg: '#eee9df',
    surface: '#fbf9f4',
    surfaceStrong: '#ffffff',
    readerSurface: '#fffdf8',
    ink: '#17251f',
    muted: '#637068',
    line: '#ded8cc',
    brand: '#173a2a',
    accent: '#b88845',
    accentSoft: '#f2e7d5',
    glass: 'rgba(255, 255, 255, 0.56)',
    glassStrong: 'rgba(255, 255, 255, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.62)',
    readerText: '#202821',
  },
  sepia: {
    label: 'Sepia',
    bg: '#dfd2bc',
    surface: '#f5ecdd',
    surfaceStrong: '#fff8eb',
    readerSurface: '#fff7e8',
    ink: '#3e3024',
    muted: '#786857',
    line: '#cdbfa9',
    brand: '#594129',
    accent: '#a16e35',
    accentSoft: '#ead8bc',
    glass: 'rgba(255, 248, 235, 0.58)',
    glassStrong: 'rgba(255, 248, 235, 0.76)',
    glassBorder: 'rgba(255, 250, 240, 0.64)',
    readerText: '#33291f',
  },
  forest: {
    label: 'Verde',
    bg: '#d8e1da',
    surface: '#edf3ee',
    surfaceStrong: '#f8fbf8',
    readerSurface: '#f8fbf7',
    ink: '#183126',
    muted: '#5e7067',
    line: '#c8d4cb',
    brand: '#174a35',
    accent: '#8e7042',
    accentSoft: '#e1e7d7',
    glass: 'rgba(245, 251, 247, 0.58)',
    glassStrong: 'rgba(248, 252, 249, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.62)',
    readerText: '#1d3026',
  },
  night: {
    label: 'Noche',
    bg: '#111b22',
    surface: '#18262e',
    surfaceStrong: '#20313a',
    readerSurface: '#1a2a31',
    ink: '#edf3f0',
    muted: '#aab8b2',
    line: '#34474f',
    brand: '#cfe8da',
    accent: '#d3ab68',
    accentSoft: '#293d40',
    glass: 'rgba(28, 44, 51, 0.72)',
    glassStrong: 'rgba(33, 51, 59, 0.84)',
    glassBorder: 'rgba(223, 238, 231, 0.16)',
    readerText: '#f1f5f2',
  },
}

const fonts: Record<FontChoice, { label: string; stack: string }> = {
  serif: {
    label: 'Clásica',
    stack: 'Georgia, "Times New Roman", serif',
  },
  sans: {
    label: 'Limpia',
    stack: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  rounded: {
    label: 'Suave',
    stack: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
  },
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return undefined
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

function luminance(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastRatio(foreground: string, background: string) {
  const a = luminance(foreground)
  const b = luminance(background)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

function readStoredPreferences(): AppearancePreferences {
  const fallback: AppearancePreferences = {
    theme: 'light',
    fontScale: 100,
    fontFamily: 'serif',
    readerText: themes.light.readerText,
    background: themes.light.bg,
  }

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<AppearancePreferences>
    const theme = parsed.theme && parsed.theme in themes ? parsed.theme : fallback.theme
    const fontFamily =
      parsed.fontFamily && parsed.fontFamily in fonts ? parsed.fontFamily : fallback.fontFamily

    return {
      theme,
      fontScale:
        typeof parsed.fontScale === 'number'
          ? Math.min(145, Math.max(85, parsed.fontScale))
          : fallback.fontScale,
      fontFamily,
      readerText:
        typeof parsed.readerText === 'string' ? parsed.readerText : themes[theme].readerText,
      background:
        typeof parsed.background === 'string' ? parsed.background : themes[theme].bg,
    }
  } catch {
    return fallback
  }
}

function applyPreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  const theme = themes[preferences.theme]

  root.style.setProperty('--bg', preferences.background)
  root.style.setProperty('--surface', theme.surface)
  root.style.setProperty('--surface-strong', theme.surfaceStrong)
  root.style.setProperty('--reader-surface', theme.readerSurface)
  root.style.setProperty('--ink', theme.ink)
  root.style.setProperty('--muted', theme.muted)
  root.style.setProperty('--line', theme.line)
  root.style.setProperty('--brand', theme.brand)
  root.style.setProperty('--brand-soft', theme.accentSoft)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-soft', theme.accentSoft)
  root.style.setProperty('--nav-accent', theme.brand)
  root.style.setProperty('--glass-surface', theme.glass)
  root.style.setProperty('--glass-surface-strong', theme.glassStrong)
  root.style.setProperty('--glass-border', theme.glassBorder)
  root.style.setProperty('--reader-text', preferences.readerText)
  root.style.setProperty('--reader-font-scale', String(preferences.fontScale / 100))
  root.style.setProperty('--reader-font-family', fonts[preferences.fontFamily].stack)
  root.dataset.theme = preferences.theme
}

export function AppearanceControl() {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<AppearancePreferences>(() =>
    readStoredPreferences(),
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    applyPreferences(preferences)
    window.localStorage.setItem(storageKey, JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const currentTheme = themes[preferences.theme]
  const contrast = useMemo(
    () => contrastRatio(preferences.readerText, currentTheme.readerSurface),
    [preferences.readerText, currentTheme.readerSurface],
  )

  function chooseTheme(themeName: ThemeName) {
    const theme = themes[themeName]
    setPreferences((current) => ({
      ...current,
      theme: themeName,
      background: theme.bg,
      readerText: theme.readerText,
    }))
    setMessage('')
  }

  function chooseReaderText(color: string) {
    if (contrastRatio(color, currentTheme.readerSurface) < 4.5) {
      setMessage('Ese color no tiene suficiente contraste para leer con comodidad.')
      return
    }
    setPreferences((current) => ({ ...current, readerText: color }))
    setMessage('')
  }

  return (
    <>
      <button
        className="appearance-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Personalizar apariencia"
      >
        Aa
      </button>

      {open ? (
        <div className="appearance-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="appearance-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appearance-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="appearance-header">
              <div>
                <span>Apariencia</span>
                <strong id="appearance-title">Personalizar lectura</strong>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
            </div>

            <div className="appearance-section">
              <strong>Tema general</strong>
              <div className="theme-grid">
                {(Object.keys(themes) as ThemeName[]).map((themeName) => (
                  <button
                    key={themeName}
                    className={preferences.theme === themeName ? 'active' : ''}
                    type="button"
                    onClick={() => chooseTheme(themeName)}
                  >
                    <span
                      className="theme-dot"
                      style={{ background: themes[themeName].bg, color: themes[themeName].brand }}
                    />
                    {themes[themeName].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="appearance-section">
              <label htmlFor="reader-size">
                <strong>Tamaño del texto</strong>
                <span>{preferences.fontScale}%</span>
              </label>
              <input
                id="reader-size"
                type="range"
                min="85"
                max="145"
                step="5"
                value={preferences.fontScale}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    fontScale: Number(event.target.value),
                  }))
                }
              />
            </div>

            <div className="appearance-section">
              <strong>Fuente de lectura</strong>
              <div className="font-grid">
                {(Object.keys(fonts) as FontChoice[]).map((fontName) => (
                  <button
                    key={fontName}
                    className={preferences.fontFamily === fontName ? 'active' : ''}
                    type="button"
                    style={{ fontFamily: fonts[fontName].stack }}
                    onClick={() =>
                      setPreferences((current) => ({ ...current, fontFamily: fontName }))
                    }
                  >
                    {fonts[fontName].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="appearance-section appearance-colors">
              <label>
                <span>
                  <strong>Color del texto bíblico</strong>
                  <small>Contraste actual: {contrast.toFixed(1)}:1</small>
                </span>
                <input
                  type="color"
                  value={preferences.readerText}
                  onChange={(event) => chooseReaderText(event.target.value)}
                />
              </label>
              <label>
                <span>
                  <strong>Fondo general</strong>
                  <small>Las tarjetas conservan su propia superficie legible.</small>
                </span>
                <input
                  type="color"
                  value={preferences.background}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      background: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            {message ? <p className="appearance-message" role="status">{message}</p> : null}

            <button
              className="appearance-reset"
              type="button"
              onClick={() =>
                setPreferences({
                  theme: 'light',
                  fontScale: 100,
                  fontFamily: 'serif',
                  readerText: themes.light.readerText,
                  background: themes.light.bg,
                })
              }
            >
              Restablecer apariencia
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}
