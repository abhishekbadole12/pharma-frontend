import React from 'react'

export default function ChartBar({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="w-28 text-xs text-gray-600">{d.label}</div>
          <div className="flex-1 bg-gray-100 rounded overflow-hidden h-4">
            <div style={{ width: `${(d.value / max) * 100}%` }} className="h-4 bg-teal-600" />
          </div>
          <div className="w-20 text-right text-sm">{d.value}</div>
        </div>
      ))}
    </div>
  )
}
