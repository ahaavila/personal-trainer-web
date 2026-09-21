export interface BrandingConfig {
  logoUrl?: string | null
  primaryColor?: string | null
  backgroundColor?: string | null
}

export interface BrandingResponse {
  isCustom: boolean
  branding: {
    logoUrl: string | null
    primaryColor: string | null
    backgroundColor: string | null
  }
}

export interface UpdateBrandingInput {
  logoUrl?: string | null
  primaryColor?: string | null
  backgroundColor?: string | null
}
