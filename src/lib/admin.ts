import { supabase } from './supabase'

export async function refreshSite() {
  const { data } = await supabase.auth.getSession()
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` },
  })
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

// next/image only renders hosts listed in next.config.ts — anything else would crash the page.
export function isAllowedImageUrl(url: string) {
  if (!url) return true
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === 'https:' && (hostname === 'images.unsplash.com' || hostname.endsWith('.supabase.co'))
  } catch {
    return url.startsWith('/')
  }
}
