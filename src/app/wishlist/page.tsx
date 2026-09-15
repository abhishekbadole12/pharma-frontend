'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist').then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: string) => {
    await api.delete(`/wishlist/${productId}`);
    setItems(items.filter(i => i.id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = async (productId: string) => {
    await api.post(`/wishlist/${productId}/move-to-cart`);
    setItems(items.filter(i => i.id !== productId));
    toast.success('Moved to cart');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse bg-gray-200 h-64 rounded-xl" /></div>;

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <Link href="/shop" className="inline-block mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleMoveToCart(product.id)} className="flex-1 py-2 bg-teal-600 text-white text-xs rounded-lg">Move to Cart</button>
              <button onClick={() => handleRemove(product.id)} className="px-3 py-2 border text-red-500 text-xs rounded-lg">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
