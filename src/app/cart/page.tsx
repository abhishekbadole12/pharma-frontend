'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { resolveImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { items, loading, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse bg-gray-200 h-64 rounded-xl" /></div>;

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link href="/shop" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product_id} className="bg-white rounded-xl border p-3 sm:p-4 flex gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                {item.thumbnail ? (
                  <img src={resolveImageUrl(item.thumbnail)} alt={item.name} className="w-full h-full object-contain p-1" />
                ) : '💊'}
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.slug}`} className="font-medium hover:text-teal-600">{item.name}</Link>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-4 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <p className="text-sm text-gray-500 mb-4">Pricing will be shared with you directly.</p>

          <Link href="/checkout" className="block w-full py-3 bg-teal-600 text-white text-center font-semibold rounded-lg hover:bg-teal-700">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
