export { cn } from "cn"


export async function logout() {
  const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  if (res.ok) {
    window.location.href = '/login';
  } else {
    console.error('Failed to logout');
  }
}