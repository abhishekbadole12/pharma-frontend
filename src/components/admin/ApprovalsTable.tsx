import React from 'react'
import { User } from '@/types'

interface Props {
  items: User[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function ApprovalsTable({ items, onApprove, onReject }: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Registered</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{u.first_name} {u.last_name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.phone}</td>
              <td className="p-3">{u.client_type}</td>
              <td className="p-3">{u.created_at}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={() => onApprove(u.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => onReject(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
