'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const items = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  // { href: '/admin/customers', label: 'Customers' },
  // { href: '/admin/settings', label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      <div className="text-lg font-bold mb-3 sm:mb-4">Admin</div>
      <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1">
        {items.map((it) => {
          const isActive = pathname === it.href || pathname.startsWith(`${it.href}/`)

          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={isActive ? 'page' : undefined}
              className={`block shrink-0 px-3 py-2 rounded whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-teal-100 text-teal-800 font-semibold'
                  : 'text-gray-700 hover:bg-teal-50'
              }`}
            >
              {it.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
