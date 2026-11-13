export function validateFullName(name: string): string | null {
  if (!name.trim()) return 'Full name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return null
}

export function validateMobile(mobile: string): string | null {
  if (!mobile.trim()) return 'Mobile number is required'
  const cleaned = mobile.trim().replace(/\s+/g, '')
  const valid = /^01[3-9]\d{8}$/.test(cleaned) ||
    /^\+8801[3-9]\d{8}$/.test(cleaned) ||
    /^8801[3-9]\d{8}$/.test(cleaned)
  if (!valid) return 'Enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX)'
  return null
}

export function normalizeMobile(mobile: string): string {
  const cleaned = mobile.trim().replace(/\s+/g, '')
  if (cleaned.startsWith('+880')) return '0' + cleaned.slice(4)
  if (cleaned.startsWith('880')) return '0' + cleaned.slice(3)
  return cleaned
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email address is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address'
  return null
}
