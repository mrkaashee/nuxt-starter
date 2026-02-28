/**
 * SEO Metadata for pages
 */
export interface SeoMeta {
  title?: string // Page title
  description?: string // Meta description
  keywords?: string[] // Meta keywords
  canonicalUrl?: string // Canonical URL
  ogTitle?: string // Open Graph title
  ogDescription?: string // Open Graph description
  ogImg?: string // Open Graph image URL
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player' // Twitter card type
  twitterTitle?: string
  twitterDescription?: string
  twitterImg?: string
  [key: string]: unknown // For any extra SEO fields
}

/**
 * Site Configuration
 */
export interface SiteConfig {
  general: {
    name: string
    description: string
    logo: string
    favicon: string
  }
  seo?: SeoMeta
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    [key: string]: unknown
  }
  social?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

/**
 * Pagination Metadata
 */
export interface Pagination {
  total: number // Total items
  page: number // Current page
  limit: number // Items per page
  totalPages: number // Total pages
  hasNext: boolean // Is there a next page
  hasPrev: boolean // Is there a previous page
  query?: string // Optional search/filter query
  [key: string]: unknown
}

/**
 * API Metadata (for stats, configs, SEO, pagination, etc.)
 */
export interface ApiMeta {
  config?: SiteConfig
  seo?: SeoMeta
  stats?: Record<string, unknown> // Any dashboard stats
  pagination?: Pagination
  [key: string]: unknown // Extensible for future meta
}

/**
 * Unified API Response
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  meta?: ApiMeta
  error?: {
    code: string // Machine-readable error code
    details?: unknown // Optional additional info
  }
}
