"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

function ProductRow({ p, onEdit, onDelete }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{p.name}</td>
      <td className="p-3">{p.sku}</td>
      <td className="p-3">{p.brand}</td>
      <td className="p-3">{p.category?.name || '-'}</td>
      <td className="p-3">
        <div className="flex gap-2">
          <button onClick={() => onEdit(p)} className="px-3 py-1 bg-teal-600 text-white rounded">Edit</button>
          <button onClick={() => onDelete(p)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminProductsPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [categoriesList, setCategoriesList] = useState<any[]>([])

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products', { params: { per_page: 50 } })
      setItems(data.items)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load(); fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategoriesList(data.categories || [])
    } catch (e) { console.error('fetch categories', e) }
  }

  const deleteProduct = async (p: any) => {
    if (!confirm(`Delete product ${p.name}?`)) return
    try {
      await api.delete(`/products/${p.id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const onEdit = (p: any) => { setEditing(p); setShowForm(true) }
  const onCreate = () => { setEditing(null); setShowForm(true) }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div>
          <button onClick={onCreate} className="px-4 py-2 bg-teal-600 text-white rounded">Add Product</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4 bg-white p-4 rounded shadow">
          <ProductForm product={editing} onDone={() => { setShowForm(false); load() }} categoriesList={categoriesList} onCategoryCreated={(c: any) => setCategoriesList((s) => [c, ...s])} />
        </div>
      )}

      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => <ProductRow key={p.id} p={p} onEdit={onEdit} onDelete={deleteProduct} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProductForm({ product, onDone, categoriesList, onCategoryCreated }: any) {
  const initial = product || {
    name: '', sku: '', brand: '', description: '', category_id: '',
  }
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showCatForm, setShowCatForm] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [imagesPreview, setImagesPreview] = useState<any[]>([])
  const [driveImageUrl, setDriveImageUrl] = useState('')

  React.useEffect(() => { setForm(product || initial) }, [product])

  React.useEffect(() => {
    // initialize previews from product images
    if (product && product.images) {
      setImagesPreview(product.images.map((u: string) => ({ url: u, remote: true })))
    } else {
      setImagesPreview([])
    }
  }, [product])

  const save = async () => {
    setError('')
    const requiredFields = [
      ['Product name', form.name],
      ['SKU', form.sku],
      ['Brand', form.brand],
      ['Category', form.category_id],
    ] as const
    const missingField = requiredFields.find(([, value]) => !String(value || '').trim())
    if (missingField) {
      setError(`${missingField[0]} is required`)
      return
    }
    setSaving(true)
    try {
      let savedProduct = product
      if (product) {
        await api.put(`/products/${product.id}`, form)
      } else {
        const { data } = await api.post('/products', form)
        savedProduct = data
      }

      if (driveImageUrl.trim()) {
        await api.post(`/products/${savedProduct.id}/images`, {
          url: driveImageUrl.trim(),
          is_thumbnail: true,
        })
      }
      toast.success('Saved')
      onDone()
    } catch (e: any) {
      console.error(e)
      const message = e?.response?.data?.details
        ? Object.entries(e.response.data.details).map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`).join('; ')
        : e?.response?.data?.error || 'Could not save product or upload its images'
      setError(message)
      toast.error(message)
    }
    setSaving(false)
  }

  const removeImage = async (entry: any) => {
    // if remote image, call backend to remove
    if (entry.remote) {
      if (!product) return
      try {
        await api.delete(`/products/${product.id}/images`, { data: { url: entry.url } })
        setImagesPreview((s) => s.filter((i) => i.url !== entry.url))
        toast.success('Image removed')
      } catch (e) { console.error(e); toast.error('Remove failed') }
    } else {
      // local preview - just remove and revoke URL
      try { URL.revokeObjectURL(entry.url) } catch {}
      setImagesPreview((s) => s.filter((i) => i !== entry))
    }
  }

  const createCategory = async () => {
    if (!newCatName) return toast.error('Category name required')
    try {
      const { data } = await api.post('/categories', { name: newCatName, description: newCatDesc })
      toast.success('Category created')
      onCategoryCreated?.(data)
      setForm({ ...form, category_id: data.id })
      setShowCatForm(false)
      setNewCatName('')
      setNewCatDesc('')
    } catch (e) { console.error(e); toast.error('Create failed') }
  }

  return (
    <div>
        <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm font-medium">Product name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" required />
        </label>
        <label className="text-sm font-medium">SKU
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" required />
        </label>
        <label className="text-sm font-medium">Brand
          <input value={form.brand || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" required />
        </label>
        <label className="text-sm font-medium">Category
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="px-3 py-2 border rounded">
            <option value="">Select category</option>
            {categoriesList.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block mt-3 text-sm font-medium">Description
        <textarea value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded min-h-24" />
      </label>
      {error && <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex gap-2 mt-3">
        <button type="button" onClick={save} disabled={saving} className="px-4 py-2 bg-teal-600 text-white rounded">{saving ? 'Saving...' : 'Save product'}</button>
        <button type="button" onClick={onDone} className="px-4 py-2 border rounded">Close</button>
      </div>
      <label className="block mt-3 text-sm font-medium">Google Drive image share link
        <input
          value={driveImageUrl}
          onChange={(e) => setDriveImageUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
          className="mt-1 w-full px-3 py-2 border rounded"
        />
        <span className="block mt-1 text-xs text-gray-500">Set the Drive file to Anyone with the link and make sure it is an image.</span>
      </label>
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Category</label>
          <button className="px-2 py-1 border rounded text-sm" onClick={() => setShowCatForm((s) => !s)}>{showCatForm ? 'Cancel' : 'New category'}</button>
        </div>
        {showCatForm && (
          <div className="mt-2 grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Category name
              <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" />
            </label>
            <label className="text-sm font-medium">Category description
              <input value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" />
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={createCategory} className="px-3 py-1 bg-teal-600 text-white rounded">Create</button>
              <button type="button" onClick={() => setShowCatForm(false)} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
        {imagesPreview.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Images</h3>
            <div className="grid grid-cols-6 gap-2">
              {imagesPreview.map((img, idx) => (
                <div key={idx} className="relative border rounded overflow-hidden">
                  <img src={img.url} className="w-full h-24 object-cover" />
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button onClick={() => removeImage(img)} className="px-2 py-1 bg-red-600 text-white text-xs">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

