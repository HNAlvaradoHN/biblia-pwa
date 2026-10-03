import { useEffect, useState } from 'react'
import './appearance.css'

type ThemeName = 'light' | 'sepia' | 'forest' | 'ocean' | 'wine' | 'violet' | 'night'
type FontChoice = 'serif' | 'sans' | 'rounded'
type VerseLayout = 'separate' | 'flow'

type AppearancePreferences = {
  theme: ThemeName
  fontScale: number
  fontFamily: FontChoice
  verseLayout: VerseLayout
}

type ThemeTokens = {
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
  onBrand: string
}

const storageKey = 'biblia-appearance-v2'
const legacyStorageKey = 'biblia-appearance-v1'

const themes: Record<ThemeName, ThemeTokens> = {
  light: {
    label: 'Claro',
    bg: '#eee9df',
    surface: '#fbf9f4',
    surfaceStrong: '#ffffff',
    readerSurface: '#fffdf8',
    ink: '#17251f',
    muted: '#59675f',
    line: '#d7d1c5',
    brand: '#173a2a',
    accent: '#8f5c25',
    accentSoft: '#efe2cf',
    glass: 'rgba(255, 255, 255, 0.62)',
    glassStrong: 'rgba(255, 255, 255, 0.82)',
    glassBorder: 'rgba(255, 255, 255, 0.72)',
    readerText: '#202821',
    onBrand: '#ffffff',
  },
  sepia: {
    label: 'Sepia',
    bg: '#dfd0b8',
    surface: '#f4eadb',
    surfaceStrong: '#fff7e9',
    readerSurface: '#fff6e6',
    ink: '#3d2f23',
    muted: '#6f604f',
    line: '#c9baa2',
    brand: '#5c4128',
    accent: '#9a642f',
    accentSoft: '#e8d3b4',
    glass: 'rgba(255, 248, 235, 0.64)',
    glassStrong: 'rgba(255, 250, 240, 0.84)',
    glassBorder: 'rgba(255, 251, 244, 0.74)',
    readerText: '#33281f',
    onBrand: '#fffaf2',
  },
  forest: {
    label: 'Verde',
    bg: '#d7e3db',
    surface: '#edf4ef',
    surfaceStrong: '#f8fbf9',
    readerSurface: '#f8fbf7',
    ink: '#183126',
    muted: '#526b60',
    line: '#c2d1c7',
    brand: '#174a35',
    accent: '#467258',
    accentSoft: '#dce9df',
    glass: 'rgba(244, 251, 247, 0.64)',
    glassStrong: 'rgba(249, 253, 250, 0.84)',
    glassBorder: 'rgba(255, 255, 255, 0.72)',
    readerText: '#1d3026',
    onBrand: '#ffffff',
  },
  ocean: {
    label: 'Azul',
    bg: '#dbe7f1',
    surface: '#edf4f9',
    surfaceStrong: '#f9fcff',
    readerSurface: '#f8fbfe',
    ink: '#172d3d',
    muted: '#526b7c',
    line: '#c5d6e2',
    brand: '#245b7a',
    accent: '#2f6d96',
    accentSoft: '#dcecf6',
    glass: 'rgba(242, 249, 253, 0.64)',
    glassStrong: 'rgba(249, 253, 255, 0.84)',
    glassBorder: 'rgba(255, 255, 255, 0.72)',
    readerText: '#1b2f3d',
    onBrand: '#ffffff',
  },
  wine: {
    label: 'Rojo',
    bg: '#eadcdb',
    surface: '#f7eeee',
    surfaceStrong: '#fffafa',
    readerSurface: '#fffafa',
    ink: '#3b2022',
    muted: '#76595c',
    line: '#dbc6c8',
    brand: '#7f3036',
    accent: '#b84d55',
    accentSoft: '#f0dddf',
    glass: 'rgba(253, 246, 246, 0.66)',
    glassStrong: 'rgba(255, 251, 251, 0.86)',
    glassBorder: 'rgba(255, 255, 255, 0.72)',
    readerText: '#392426',
    onBrand: '#ffffff',
  },
  violet: {
    label: 'Morado',
    bg: '#e7e0ef',
    surface: '#f4f0f8',
    surfaceStrong: '#fcfaff',
    readerSurface: '#fcfaff',
    ink: '#2f2638',
    muted: '#685d73',
    line: '#d3c9dd',
    brand: '#65437b',
    accent: '#8a62a6',
    accentSoft: '#eadff1',
    glass: 'rgba(249, 246, 252, 0.66)',
    glassStrong: 'rgba(253, 251, 255, 0.86)',
    glassBorder: 'rgba(255, 255, 255, 0.72)',
    readerText: '#31283a',
    onBrand: '#ffffff',
  },
  night: {
    label: 'Noche',
    bg: '#0e171b',
    surface: '#162229',
    surfaceStrong: '#1d2d34',
    readerSurface: '#142229',
    ink: '#f3f7f5',
    muted: '#bac8c2',
    line: '#41535a',
    brand: '#9ce1c1',
    accent: '#f1bf69',
    accentSoft: '#293b3e',
    glass: 'rgba(23, 37, 43, 0.78)',
    glassStrong: 'rgba(31, 48, 55, 0.9)',
    glassBorder: 'rgba(222, 240, 232, 0.24)',
    readerText: '#f6f9f7',
    onBrand: '#102019',
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

function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && value in themes
}

function isFontChoice(value: unknown): value is FontChoice {
  return typeof value === 'string' && value in fonts
}

function isVerseLayout(value: unknown): value is VerseLayout {
  return value === 'separate' || value === 'flow'
}

function readStoredPreferences(): AppearancePreferences {
  const fallback: AppearancePreferences = {
    theme: 'light',
    fontScale: 100,
    fontFamily: 'serif',
    verseLayout: 'separate',
  }

  for (const key of [storageKey, legacyStorageKey]) {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as Partial<AppearancePreferences>

      return {
        theme: isThemeName(parsed.theme) ? parsed.theme : fallback.theme,
        fontScale:
          typeof parsed.fontScale === 'number'
            ? Math.min(145, Math.max(85, parsed.fontScale))
            : fallback.fontScale,
        fontFamily: isFontChoice(parsed.fontFamily) ? parsed.fontFamily : fallback.fontFamily,
        verseLayout: isVerseLayout(parsed.verseLayout) ? parsed.verseLayout : fallback.verseLayout,
      }
    } catch {
      continue
    }
  }

  return fallback
}

function applyPreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  const theme = themes[preferences.theme]

  root.style.setProperty('--bg', theme.bg)
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
  root.style.setProperty('--reader-text', theme.readerText)
  root.style.setProperty('--on-brand', theme.onBrand)
  root.style.setProperty('--reader-font-scale', String(preferences.fontScale / 100))
  root.style.setProperty('--reader-font-family', fonts[preferences.fontFamily].stack)
  root.dataset.theme = preferences.theme
  root.dataset.verseLayout = preferences.verseLayout
}

export function AppearanceControl() {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<AppearancePreferences>(() =>
    readStoredPreferences(),
  )

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
        <div className="appearance-backdrop submenu-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="appearance-panel submenu-surface"
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
              <strong>Temas predefinidos</strong>
              <p className="appearance-help">Cada tema ya incluye colores de fondo, tarjetas y texto ajustados para conservar contraste.</p>
              <div className="theme-grid">
                {(Object.keys(themes) as ThemeName[]).map((themeName) => (
                  <button
                    key={themeName}
                    className={preferences.theme === themeName ? 'active' : ''}
                    type="button"
                    onClick={() =>
                      setPreferences((current) => ({ ...current, theme: themeName }))
                    }
                  >
                    <span
                      className="theme-preview"
                      style={{
                        background: themes[themeName].bg,
                        color: themes[themeName].brand,
                        borderColor: themes[themeName].line,
                      }}
                    >
                      <i style={{ background: themes[themeName].brand }} />
                      <i style={{ background: themes[themeName].accent }} />
                    </span>
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
              <strong>Disposición de versículos</strong>
              <p className="appearance-help">Elegí si querés cada versículo separado o una lectura más corrida.</p>
              <div className="layout-grid">
                <button
                  type="button"
                  className={preferences.verseLayout === 'separate' ? 'active' : ''}
                  onClick={() =>
                    setPreferences((current) => ({ ...current, verseLayout: 'separate' }))
                  }
                >
                  <strong>Separados</strong>
                  <span>Un versículo por bloque.</span>
                </button>
                <button
                  type="button"
                  className={preferences.verseLayout === 'flow' ? 'active' : ''}
                  onClick={() =>
                    setPreferences((current) => ({ ...current, verseLayout: 'flow' }))
                  }
                >
                  <strong>Corridos</strong>
                  <span>Texto continuo con referencias.</span>
                </button>
              </div>
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

            <button
              className="appearance-reset"
              type="button"
              onClick={() =>
                setPreferences({
                  theme: 'light',
                  fontScale: 100,
                  fontFamily: 'serif',
                  verseLayout: 'separate',
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
