import React from 'react'

interface BrandLogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  subtitle?: string
}

export function BrandLogo({ variant = 'light', size = 'md', subtitle }: BrandLogoProps) {
  const iconDimensions = size === 'sm' ? 36 : size === 'lg' ? 48 : 40
  const primaryTextColor = variant === 'light' ? '#FFFFFF' : '#064E3B'
  const secondaryTextColor = variant === 'light' ? '#6EE7B7' : '#059669'
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.78)' : '#475569'

  return (
    <div className="brand-logo-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? '0.6rem' : '0.75rem', minWidth: 0, maxWidth: '100%' }}>
      <svg
        className="brand-logo-icon"
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 3px 8px rgba(5, 150, 105, 0.28))' }}
      >
        <rect width="64" height="64" rx="15" fill="url(#uddipok_green_bg)" />
        <rect x="2.5" y="2.5" width="59" height="59" rx="12.5" stroke="#6EE7B7" strokeOpacity="0.4" strokeWidth="1.5" />
        <path
          d="M32 10L14 18V31.5C14 43.1 21.7 53.5 32 56.5C42.3 53.5 50 43.1 50 31.5V18L32 10Z"
          fill="#064E3B"
          fillOpacity="0.6"
          stroke="#A7F3D0"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M19 27.5L32 21L45 27.5L32 34L19 27.5Z"
          fill="#10B981"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M24 31V39C24 41.8 27.58 44 32 44C36.42 44 40 41.8 40 39V31"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M45 27.5V36" stroke="#6EE7B7" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="45" cy="37" r="1.8" fill="#6EE7B7" />
        <defs>
          <linearGradient id="uddipok_green_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="0.5" stopColor="#059669" />
            <stop offset="1" stopColor="#064E3B" />
          </linearGradient>
        </defs>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span
            className="brand-title-bn"
            style={{
              fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
              fontWeight: 700,
              color: primaryTextColor,
              fontFamily: "'Hind Siliguri', sans-serif",
              letterSpacing: '0.01em',
            }}
          >
            উদ্দীপক
          </span>
          <span
            className="brand-title-en"
            style={{
              fontSize: size === 'sm' ? '0.8rem' : size === 'lg' ? '1.05rem' : '0.88rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: secondaryTextColor,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textTransform: 'uppercase',
            }}
          >
            Uddipok Education
          </span>
        </div>
        <span
          className="brand-subtitle"
          style={{
            fontSize: size === 'sm' ? '0.68rem' : '0.73rem',
            fontWeight: 500,
            color: subColor,
            letterSpacing: '0.01em',
            marginTop: '2px',
            fontFamily: "'Hind Siliguri', 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {subtitle || 'অনলাইন পরীক্ষা ও মূল্যায়ন প্ল্যাটফর্ম'}
        </span>
      </div>
    </div>
  )
}
