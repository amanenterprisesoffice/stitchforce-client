export async function logout() {
  // clear all cookie set by server
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
  })
  const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  if (res.ok) {
    window.location.href = '/login';
  } else {
    console.error('Failed to logout');
  }
}

export function getInitials(name: string) {
  if (!name) return "??"
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return (words[0][0] + (words[0][1] || words[0][0])).toUpperCase()
  } else {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
}


export function formatDate(date?: string | Date | null) {
  if (!date) return "—"

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) return "—"

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value)
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0) / 100)
}

export function unwrapList<T>(value: any, keys: string[] = []): T[] {
  if (Array.isArray(value)) return value

  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key]
  }

  if (Array.isArray(value?.data)) return value.data

  return []
}

export function prettifyKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}