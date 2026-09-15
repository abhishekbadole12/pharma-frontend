"use client"
import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import ChartBar from '@/components/admin/ChartBar'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [charts, setCharts] = useState<any>(null)

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats)
      setCharts(data.charts)
    }).catch(() => {})
  }, [])

  if (!stats) return <div className="p-6">Loading dashboard...</div>

  const salesData = (charts?.sales_by_day || []).slice(-12).map((d: any) => ({ label: d._id, value: d.count || 0 }))
  const topProducts = (charts?.top_products || []).slice(0, 10).map((p: any) => ({ label: p.name || p._id, value: p.total_sold || 0 }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">Total Orders<br/><span className="text-xl font-bold">{stats.total_orders}</span></div>
        <div className="bg-white p-4 rounded-lg shadow">Pending Orders<br/><span className="text-xl font-bold">{stats.pending_orders}</span></div>
        <div className="bg-white p-4 rounded-lg shadow">Total Customers<br/><span className="text-xl font-bold">{stats.total_customers}</span></div>
        <div className="bg-white p-4 rounded-lg shadow">Total Products<br/><span className="text-xl font-bold">{stats.total_products}</span></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Sales By Day (last days)</h3>
          {salesData.length ? <ChartBar data={salesData} /> : <div className="text-sm text-gray-600">No recent sales data</div>}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Top Products</h3>
          {topProducts.length ? <ChartBar data={topProducts} /> : <div className="text-sm text-gray-600">No product data</div>}
        </div>
      </div>
    </div>
  )
}
