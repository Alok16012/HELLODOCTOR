'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, ExternalLink, Upload, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { refreshSite, uploadImage, isAllowedImageUrl } from '@/lib/admin'

type Row = Record<string, unknown> & { id?: number }

export type Field = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'markdown' | 'number' | 'date' | 'image' | 'list' | 'select' | 'multiselect' | 'checkbox'
  required?: boolean
  options?: string[]
  help?: string
  nullable?: boolean
  step?: string
  // Auto-fill a slug from this field when creating a new item.
  slugFrom?: string
  wide?: boolean
}

export interface ContentManagerProps {
  table: 'colleges' | 'blogs' | 'scholarships'
  title: string
  singular: string
  fields: Field[]
  columns: { key: string; label: string }[]
  searchKeys: string[]
  orderBy: { column: string; ascending: boolean }
  defaults: Row
  viewUrl: (row: Row) => string
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Form state keeps lists as newline-separated text; convert both ways at the edges.
function toForm(row: Row, fields: Field[]): Row {
  const f: Row = { ...row }
  for (const field of fields) {
    const v = row[field.name]
    if (field.type === 'list') f[field.name] = Array.isArray(v) ? v.join('\n') : ''
    else if (field.type === 'number') f[field.name] = v === null || v === undefined ? '' : String(v)
  }
  return f
}

function toPayload(form: Row, fields: Field[]): Row {
  const out: Row = {}
  for (const field of fields) {
    const v = form[field.name]
    switch (field.type) {
      case 'list':
        out[field.name] = String(v ?? '').split('\n').map(s => s.trim()).filter(Boolean)
        break
      case 'number':
        out[field.name] = v === '' || v === undefined ? (field.nullable ? null : 0) : Number(v)
        break
      case 'checkbox':
        out[field.name] = Boolean(v)
        break
      case 'multiselect':
        out[field.name] = Array.isArray(v) ? v : []
        break
      default:
        out[field.name] = typeof v === 'string' ? v.trim() : v ?? ''
    }
  }
  return out
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

export default function ContentManager(props: ContentManagerProps) {
  const { table, title, singular, fields, columns, searchKeys, orderBy, defaults, viewUrl } = props
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Row | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const [version, setVersion] = useState(0)
  const reload = () => setVersion(v => v + 1)

  useEffect(() => {
    let active = true
    supabase.from(table).select('*').order(orderBy.column, { ascending: orderBy.ascending }).then(({ data, error }) => {
      if (!active) return
      if (error) setError(error.message)
      else setRows(data as Row[])
      setLoading(false)
    })
    return () => { active = false }
  }, [table, orderBy.column, orderBy.ascending, version])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q)))
  }, [rows, search, searchKeys])

  const set = (name: string, value: unknown) => {
    setEditing(prev => {
      if (!prev) return prev
      const next = { ...prev, [name]: value }
      if (!prev.id) {
        const slugField = fields.find(f => f.slugFrom === name)
        if (slugField && (!prev[slugField.name] || prev[slugField.name] === slugify(String(prev[name] ?? '')))) {
          next[slugField.name] = slugify(String(value))
        }
      }
      return next
    })
  }

  const handleUpload = async (name: string, file: File) => {
    setUploading(name)
    setError('')
    try {
      set(name, await uploadImage(file))
    } catch (e) {
      setError('Image upload failed: ' + (e as Error).message)
    } finally {
      setUploading(null)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setError('')
    const bad = fields.find(f => f.type === 'image' && !isAllowedImageUrl(String(editing[f.name] ?? '')))
    if (bad) {
      setError(`"${bad.label}": please upload the image using the Upload button (links from other websites are not supported).`)
      return
    }
    setSaving(true)
    const payload = toPayload(editing, fields)
    const { error } = editing.id
      ? await supabase.from(table).update(payload).eq('id', editing.id)
      : await supabase.from(table).insert(payload)
    setSaving(false)
    if (error) {
      setError(error.message.includes('duplicate key') ? 'This slug is already used — please choose a different one.' : error.message)
      return
    }
    await refreshSite()
    setEditing(null)
    flash(`${singular} saved`)
    reload()
  }

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${row[columns[0].key]}"? This cannot be undone.`)) return
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error) {
      flash('Error: ' + error.message)
      return
    }
    await refreshSite()
    flash(`${singular} deleted`)
    reload()
  }

  const renderField = (field: Field) => {
    const v = editing?.[field.name]
    switch (field.type) {
      case 'textarea':
        return <textarea rows={4} className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required} />
      case 'markdown':
        return <textarea rows={18} className={`${inputCls} font-mono text-xs`} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required} />
      case 'list':
        return <textarea rows={4} className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} placeholder="One item per line" />
      case 'number':
        return <input type="number" step={field.step ?? '1'} className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required} />
      case 'date':
        return <input type="date" className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required} />
      case 'select':
        return (
          <select className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required}>
            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )
      case 'multiselect': {
        const selected = Array.isArray(v) ? (v as string[]) : []
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map(o => {
              const on = selected.includes(o)
              return (
                <button
                  type="button"
                  key={o}
                  onClick={() => set(field.name, on ? selected.filter(s => s !== o) : [...selected, o])}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${on ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'}`}
                >
                  {o}
                </button>
              )
            })}
          </div>
        )
      }
      case 'checkbox':
        return (
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={Boolean(v)} onChange={e => set(field.name, e.target.checked)} className="w-4 h-4 accent-blue-600" />
            Yes
          </label>
        )
      case 'image':
        return (
          <div className="flex gap-3 items-start">
            {v ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(v)} alt="" className="w-24 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
            ) : (
              <div className="w-24 h-16 rounded-lg border border-dashed border-gray-300 shrink-0" />
            )}
            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100">
                <Upload className="w-4 h-4" />
                {uploading === field.name ? 'Uploading…' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading !== null}
                  onChange={e => e.target.files?.[0] && handleUpload(field.name, e.target.files[0])}
                />
              </label>
              <input className={`${inputCls} text-xs`} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} placeholder="or image URL" />
            </div>
          </div>
        )
      default:
        return <input type="text" className={inputCls} value={String(v ?? '')} onChange={e => set(field.name, e.target.value)} required={field.required} />
    }
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      {editing ? (
        <form onSubmit={save} className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { setEditing(null); setError('') }} className="p-2 rounded-lg hover:bg-gray-200">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{editing.id ? `Edit ${singular}` : `Add ${singular}`}</h2>
            </div>
            <button type="submit" disabled={saving || uploading !== null} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(field => (
              <div key={field.name} className={field.wide || ['textarea', 'markdown', 'list', 'multiselect', 'image'].includes(field.type) ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}{field.required && <span className="text-red-500"> *</span>}
                </label>
                {renderField(field)}
                {field.help && <p className="text-xs text-gray-400 mt-1">{field.help}</p>}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving || uploading !== null} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-500 text-sm">{rows.length} total</p>
            </div>
            <button
              onClick={() => { setError(''); setEditing(toForm(defaults, fields)) }}
              className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Add {singular}
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className={`${inputCls} pl-9`} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {columns.map(c => (
                      <th key={c.key} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{c.label}</th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={columns.length + 1} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td></tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-400">Nothing found.</td></tr>
                  ) : filtered.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {columns.map((c, i) => {
                        const v = row[c.key]
                        return (
                          <td key={c.key} className={`px-4 py-3 ${i === 0 ? 'font-medium text-gray-800' : 'text-gray-600'} max-w-xs truncate`}>
                            {Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? '✓' : '') : String(v ?? '')}
                          </td>
                        )
                      })}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <a href={viewUrl(row)} target="_blank" rel="noopener noreferrer" title="View on website" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button onClick={() => { setError(''); setEditing(toForm(row, fields)) }} title="Edit" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => remove(row)} title="Delete" className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
