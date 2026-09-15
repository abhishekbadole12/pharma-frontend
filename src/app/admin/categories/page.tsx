"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'

type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  status?: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', parent_id: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', parent_id: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/categories', form)
      setCategories((s) => [res.data, ...s])
      setShowForm(false)
      setForm({ name: '', description: '', parent_id: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (c: any) => {
    setEditingId(c._id)
    setEditForm({ name: c.name || '', description: c.description || '', parent_id: c.parent_id || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', description: '', parent_id: '' })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const res = await api.put(`/categories/${editingId}`, editForm)
      setCategories((s) => s.map((c) => c._id === editingId ? res.data : c))
      cancelEdit()
    } catch (err) {
      console.error('update category', err)
      alert('Update failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete category?')) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories((s) => s.filter((c) => c._id !== id))
    } catch (err) {
      console.error(err)
      alert('Unable to delete category')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <button className="btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : 'New Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="input"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
          />
          <button className="btn" type="submit">Create</button>
        </form>
      )}

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Slug</th>
                <th className="text-left">Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-t">
                  <td>
                    {editingId === c._id ? (
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td>{c.slug}</td>
                  <td>{(c as any).product_count ?? 0}</td>
                  <td className="text-right">
                    {editingId === c._id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={handleUpdate} className="btn btn-sm">Save</button>
                        <button onClick={cancelEdit} className="btn btn-sm">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(c)} className="btn btn-sm mr-2">Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
