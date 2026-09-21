import type { BrandingResponse, UpdateBrandingInput } from './types'

export async function getBranding(): Promise<BrandingResponse> {
  const response = await fetch('/api/auth/branding', {
    credentials: 'include',
  })

  if (!response.ok) {
    return {
      isCustom: false,
      branding: {
        logoUrl: null,
        primaryColor: null,
        backgroundColor: null,
      },
    }
  }

  const raw = await response.json()
  const logoUrl = raw.branding?.logoUrl ?? raw.logoUrl ?? raw.brandLogoUrl ?? null
  const primaryColor = raw.branding?.primaryColor ?? raw.primaryColor ?? raw.brandPrimaryColor ?? null
  const backgroundColor = raw.branding?.backgroundColor ?? raw.backgroundColor ?? raw.brandBackgroundColor ?? null
  const isCustom = raw.isCustom ?? Boolean(logoUrl || (primaryColor && primaryColor !== '#e6b94e') || (backgroundColor && backgroundColor !== '#0c0a08'))

  return {
    isCustom,
    branding: {
      logoUrl,
      primaryColor,
      backgroundColor,
    },
  }
}

export async function updateBranding(
  input: UpdateBrandingInput,
): Promise<BrandingResponse> {
  const response = await fetch('/api/auth/branding', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Falha ao atualizar personalização de marca.')
  }

  const raw = await response.json()
  const logoUrl = raw.branding?.logoUrl ?? raw.logoUrl ?? raw.brandLogoUrl ?? null
  const primaryColor = raw.branding?.primaryColor ?? raw.primaryColor ?? raw.brandPrimaryColor ?? null
  const backgroundColor = raw.branding?.backgroundColor ?? raw.backgroundColor ?? raw.brandBackgroundColor ?? null
  const isCustom = raw.isCustom ?? Boolean(logoUrl || (primaryColor && primaryColor !== '#e6b94e') || (backgroundColor && backgroundColor !== '#0c0a08'))

  return {
    isCustom,
    branding: {
      logoUrl,
      primaryColor,
      backgroundColor,
    },
  }
}

function getContrastTextColor(hexColor: string): string {
  const clean = hexColor.replace('#', '').trim()
  if (clean.length === 3) {
    const r = Number.parseInt(clean[0] + clean[0], 16)
    const g = Number.parseInt(clean[1] + clean[1], 16)
    const b = Number.parseInt(clean[2] + clean[2], 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150 ? '#1a160d' : '#ffffff'
  }
  if (clean.length === 6) {
    const r = Number.parseInt(clean.slice(0, 2), 16)
    const g = Number.parseInt(clean.slice(2, 4), 16)
    const b = Number.parseInt(clean.slice(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150 ? '#1a160d' : '#ffffff'
  }
  return '#1a160d'
}

/**
 * Injects custom CSS properties into document.documentElement for dynamic theming
 */
export function applyTheme(primaryColor?: string | null, backgroundColor?: string | null) {
  const root = document.documentElement

  if (primaryColor) {
    root.style.setProperty('--brand-primary', primaryColor)
    root.style.setProperty('--brand-btn-text', getContrastTextColor(primaryColor))
    root.style.setProperty(
      '--brand-primary-gradient',
      `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 90%, #ffffff 10%), color-mix(in srgb, ${primaryColor} 75%, #000000 25%))`,
    )
    root.style.setProperty(
      '--brand-primary-hover',
      `color-mix(in srgb, ${primaryColor} 85%, #ffffff 15%)`,
    )
    root.style.setProperty(
      '--brand-primary-subtle',
      `color-mix(in srgb, ${primaryColor} 18%, transparent)`,
    )
    root.style.setProperty(
      '--brand-primary-border',
      `color-mix(in srgb, ${primaryColor} 45%, transparent)`,
    )
  } else {
    root.style.removeProperty('--brand-primary')
    root.style.removeProperty('--brand-btn-text')
    root.style.removeProperty('--brand-primary-gradient')
    root.style.removeProperty('--brand-primary-hover')
    root.style.removeProperty('--brand-primary-subtle')
    root.style.removeProperty('--brand-primary-border')
  }

  if (backgroundColor) {
    root.style.setProperty('--brand-bg', backgroundColor)
    root.style.setProperty(
      '--brand-bg-sidebar',
      `color-mix(in srgb, ${backgroundColor} 85%, #000000 15%)`,
    )
    root.style.setProperty(
      '--brand-bg-card',
      `color-mix(in srgb, ${backgroundColor} 80%, #ffffff 6%)`,
    )
  } else {
    root.style.removeProperty('--brand-bg')
    root.style.removeProperty('--brand-bg-sidebar')
    root.style.removeProperty('--brand-bg-card')
  }
}
