"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminPrescriptionsPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() }, [])

  const load = async () => {
    setLoading(true)
    try { const { data } = await api.get('/orders/admin/prescriptions'); setItems(data.items || []) } catch (e) { console.error(e) }
    setLoading(false)
  }

  const update = async (id: string, status: string) => {
    try { await api.put(`/orders/admin/prescriptions/${id}/status`, { status }); toast.success('Updated'); load() } catch (e) { toast.error('Update failed') }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th>User</th><th>File</th><th>Status</th><th>Uploaded</th><th></th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{p.user?.first_name} {p.user?.last_name} ({p.user?.email})</td>
                  <td className="p-2"><a href={p.file_url} target="_blank" rel="noreferrer" className="text-blue-600">View</a></td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2">{p.created_at}</td>
                  <td className="p-2 text-right">
                    <button className="btn btn-sm mr-2" onClick={()=>update(p._id, 'APPROVED')}>Approve</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>update(p._id, 'REJECTED')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
