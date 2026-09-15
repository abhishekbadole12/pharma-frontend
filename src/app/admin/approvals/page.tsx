"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import ApprovalsTable from '@/components/admin/ApprovalsTable'
import toast from 'react-hot-toast'

export default function ApprovalsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/approvals?status=PENDING')
      setItems(data.items)
    } catch (e) { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    try {
      await api.post(`/admin/approvals/${id}/approve`)
      toast.success('Client approved')
      load()
    } catch { toast.error('Failed to approve') }
  }

  const reject = async (id: string) => {
    const reason = prompt('Rejection reason (optional)') || ''
    try {
      await api.post(`/admin/approvals/${id}/reject`, { reason })
      toast.success('Client rejected')
      load()
    } catch { toast.error('Failed to reject') }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Approvals</h1>
      {loading ? <div>Loading...</div> : <ApprovalsTable items={items} onApprove={approve} onReject={reject} />}
    </div>
  )
}
