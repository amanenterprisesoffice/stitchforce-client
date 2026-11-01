export { cn } from "cn"


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
