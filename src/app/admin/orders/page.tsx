"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

function formatAddress(address: any) {
  if (!address) return '-'
  if (typeof address === 'string') return address
  return [
    address.address || address.street,
    address.apartment,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ') || '-'
}

export default function AdminOrdersPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/orders/admin', { params: { page, status: status || undefined, search: search || undefined, date_from: dateFrom || undefined, date_to: dateTo || undefined } })
      setItems(data.items)
      setPages(data.pages || 1)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => { load() }, [page])

  const view = async (id: string) => {
    try {
      const { data } = await api.get(`/orders/admin/${id}`)
      setSelected(data)
      setStatus(data.status)
    } catch { toast.error('Failed to load order') }
  }

  const updateStatus = async () => {
    if (!selected) return
    try {
      await api.put(`/admin/orders/${selected.id}/status`, { status })
      toast.success('Status updated')
      setSelected(null)
      load()
    } catch (e) { toast.error('Update failed') }
  }

  const exportCSV = () => {
    if (!items || items.length === 0) return toast('No items to export')
    const headers = ['order_number','customer','status','created_at']
    const rows = items.map(o => [o.order_number, o.customer?.name || '', o.status, o.created_at])
    const csv = [headers.join(','), ...rows.map(r => r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const applyFilters = () => { setPage(1); load() }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {/* <div className="mb-4 flex gap-2 items-center">
        <input placeholder="Search" value={search} onChange={(e)=>setSearch(e.target.value)} className="input" />
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="input">
          <option value="">Any status</option>
          {['PLACED','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="input" />
        <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="input" />
        <button className="btn" onClick={applyFilters}>Apply</button>
        <button className="btn" onClick={()=>{ setSearch(''); setStatus(''); setDateFrom(''); setDateTo(''); setPage(1); load(); }}>Clear</button>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </div> */}
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Order #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.order_number}</td>
                  <td className="p-3">{o.customer?.name || '-'}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">{o.created_at}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => view(o.id)} className="px-3 py-1 bg-teal-600 text-white rounded">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-2">Order {selected.order_number}</h2>
            <div className="mb-4 rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
              <h3 className="mb-3 font-semibold text-gray-900">Customer details</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <div><span className="font-medium">Name:</span> {selected.customer?.first_name || selected.customer?.last_name
                  ? `${selected.customer?.first_name || ''} ${selected.customer?.last_name || ''}`.trim()
                  : selected.customer?.name || '-'}</div>
                <div><span className="font-medium">Email:</span> {selected.customer?.email || '-'}</div>
                <div><span className="font-medium">Phone:</span> {selected.customer?.phone || '-'}</div>
                <div><span className="font-medium">GST number:</span> {selected.customer?.business?.gst_number || selected.customer?.gst_number || 'Not provided'}</div>
              </div>
              <div className="mt-2"><span className="font-medium">Customer address:</span> {formatAddress(selected.customer?.address)}</div>
              <div className="mt-2"><span className="font-medium">Shipping address:</span> {formatAddress(selected.shipping_address)}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Items</h3>
              <div className="space-y-2 mt-2 text-sm">
                {selected.items.map((it: any) => (
                  <div key={it.product_id}><span>{it.name} x {it.quantity}</span></div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-center mb-4">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded">
                {['PLACED','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={updateStatus} className="px-4 py-2 bg-teal-600 text-white rounded">Update Status</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
        <div className="mt-4 flex items-center gap-2">
          <button className="btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1}>Prev</button>
          <div>Page {page} / {pages}</div>
          <button className="btn" onClick={() => setPage(p => Math.min(p+1, pages))} disabled={page>=pages}>Next</button>
        </div>
    </div>
  )
}

