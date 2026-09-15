"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminInventoryPage(){
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [adjust, setAdjust] = useState({ product_id: '', change: 0, reason: '' })

  useEffect(()=>{ fetchLowStock() }, [])

  const fetchLowStock = async () => {
    setLoading(true)
    try { const { data } = await api.get('/inventory/low-stock'); setProducts(data.items || []) } catch (e) { console.error(e) }
    setLoading(false)
  }

  const doAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api.post('/inventory/adjust', adjust); toast.success('Adjusted'); fetchLowStock(); } catch (e) { toast.error('Adjust failed') }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow">
          <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th>Name</th><th></th></tr></thead>
            <tbody>{products.map(p=> <tr key={p._id} className="border-t"><td className="p-2">{p.name}</td><td className="text-right"><button onClick={()=>{navigator.clipboard?.writeText(p._id); alert('Copied id')}} className="btn btn-sm">Copy ID</button></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
