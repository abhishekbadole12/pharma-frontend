'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, Heart, User, Menu, X, Bell,
  ChevronDown, Pill
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Category } from '@/types';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  // { href: '/about', label: 'About' },
  // { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'CLIENT' && user?.status === 'APPROVED') {
      fetchCart();
    }
    api.get('/categories').then(({ data }) => setCategories(data.categories || []));
  }, [user, fetchCart]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/products/search', { params: { q: searchQuery } });
        setSuggestions(data.suggestions || []);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const count = itemCount();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    router.replace('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-teal-700 font-bold text-lg sm:text-xl min-w-0">
            <Pill className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span className="truncate">{process.env.NEXT_PUBLIC_APP_NAME || 'Dhan Laxmi Pharma'}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-gray-700 hover:text-teal-600 font-medium text-sm transition-colors">
                {link.label}
              </Link>
            ))}
            {/* <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 font-medium text-sm">
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg py-2 mt-1 border">
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/shop?category=${cat.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button aria-label="Search" onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {user?.role === 'CLIENT' && user?.status === 'APPROVED' && (
              <>
                <Link href="/wishlist" className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
                  <Heart className="w-5 h-5 text-gray-600" />
                </Link>
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block border">
                  <p className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                    {user.first_name} {user.last_name}
                  </p>
                  {user.role === 'ADMIN' ? (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-teal-50">Dashboard</Link>
                  ) : (
                    <>
                      <Link href="/account" className="block px-4 py-2 text-sm hover:bg-teal-50">My Account</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-teal-50">My Orders</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                Login
              </Link>
            )}

            <button aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 relative">
            <input
              type="text"
              placeholder="Search medicines, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-lg border mt-1 z-50 max-h-64 overflow-y-auto">
                {suggestions.map((s) => (
                  <Link key={s.id} href={`/product/${s.slug}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-teal-50 border-b last:border-0">
                    <span className="text-sm">{s.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 font-medium">{link.label}</Link>
          ))}
          {user && (
            <>
              <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/account'} onClick={() => setMobileOpen(false)}
                className="block border-t pt-3 text-gray-700 font-medium">{user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Account'}</Link>
              {user.role === 'CLIENT' && <Link href="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">My Orders</Link>}
              <button onClick={handleLogout} className="block w-full py-2 text-left text-red-600 font-medium">Logout</button>
            </>
          )}
          {!user && (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="block py-2 text-teal-600 font-medium">Login / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
}
