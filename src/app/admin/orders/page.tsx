"use client"
import React, { useCallback, useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { CalendarDays } from 'lucide-react'
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

export default function AdminOrdersPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  // const [dateFrom, setDateFrom] = useState('')
  // const [dateTo, setDateTo] = useState('')
  // 
  const getYesterday = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date.toISOString().split('T')[0]
  }

  const [dateFrom, setDateFrom] = useState(getYesterday())
  const [dateTo, setDateTo] = useState(getYesterday())

  const [dateFilter, setDateFilter] = useState('yesterday')
  const [showCalendar, setShowCalendar] = useState(false)

  // const load = async () => {
  //   setLoading(true)
  //   try {
  //     const { data } = await api.get('/orders/admin', { params: { page, status: status || undefined, search: search || undefined, date_from: dateFrom || undefined, date_to: dateTo || undefined } })
  //     setItems(data.items)
  //     setPages(data.pages || 1)
  //   } catch (e) { console.error(e) }
  //   setLoading(false)
  // }
  const load = useCallback(async () => {
    setLoading(true)

    try {
      const { data } = await api.get('/orders/admin', {
        params: {
          page,
          status: status || undefined,
          search: search || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        },
      })

      setItems(data.items || [])
      setPages(data.pages || 1)
    } catch (e) {
      console.error(e)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [page, status, search, dateFrom, dateTo])

  useEffect(() => {
    load()
  }, [load])

  const selectDateFilter = (filter: string) => {
    const today = new Date()
    const yesterday = new Date()

    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0]

    setDateFilter(filter)
    setPage(1)

    if (filter === 'yesterday') {
      setDateFrom(formatDate(yesterday))
      setDateTo(formatDate(yesterday))
    } else if (filter === 'today') {
      setDateFrom(formatDate(today))
      setDateTo(formatDate(today))
    } else if (filter === 'all') {
      setDateFrom('')
      setDateTo('')
    }
  }

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
    const headers = ['order_number', 'customer', 'status', 'created_at']
    const rows = items.map(o => [o.order_number, o.customer?.name || '', o.status, o.created_at])
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const applyFilters = () => { setPage(1); load() }

  function formatDateTime(dateString: string) {
    if (!dateString) return '-'

    const date = new Date(dateString)

    if (isNaN(date.getTime())) return '-'

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Yesterday */}
          <button
            onClick={() => selectDateFilter('yesterday')}
            className={`px-4 py-2 text-sm rounded-lg border transition ${dateFilter === 'yesterday'
              ? 'bg-teal-600 text-white border-teal-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Yesterday
          </button>

          {/* Today */}
          <button
            onClick={() => selectDateFilter('today')}
            className={`px-4 py-2 text-sm rounded-lg border transition ${dateFilter === 'today'
              ? 'bg-teal-600 text-white border-teal-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Today
          </button>

          {/* All Time */}
          <button
            onClick={() => selectDateFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg border transition ${dateFilter === 'all'
              ? 'bg-teal-600 text-white border-teal-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
          >
            All Time
          </button>

          {/* Calendar */}
          <div className="relative">

            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`p-2.5 rounded-lg border transition ${showCalendar
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              title="Custom date filter"
            >
              <CalendarDays size={19} />
            </button>

            {showCalendar && (
              <div className="absolute right-0 top-12 z-50 bg-white border rounded-xl shadow-lg p-4 w-72">

                <h3 className="font-semibold text-gray-800 mb-3">
                  Custom Date Range
                </h3>

                <div className="space-y-3">

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      From
                    </label>

                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value)
                        setDateFilter('custom')
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      To
                    </label>

                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(e) => {
                        setDateTo(e.target.value)
                        setDateFilter('custom')
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPage(1)
                      setShowCalendar(false)
                    }}
                    className="w-full bg-teal-600 text-white rounded-lg py-2 text-sm hover:bg-teal-700"
                  >
                    Apply Filter
                  </button>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Order #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date & Time</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.order_number}</td>
                  <td className="p-3">{o.customer?.name || '-'}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">{formatDateTime(o.created_at)}</td>
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
                {['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={updateStatus} className="px-4 py-2 bg-teal-600 text-white rounded">Update Status</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
        <div>Page {page} / {pages}</div>
        <button className="btn" onClick={() => setPage(p => Math.min(p + 1, pages))} disabled={page >= pages}>Next</button>
      </div>
    </div>
  )
}

