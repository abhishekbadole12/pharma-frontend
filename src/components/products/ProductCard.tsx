'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { cn, resolveImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'CLIENT' || user.status !== 'APPROVED') {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addItem(product.id);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }
    try {
      await api.post(`/wishlist/${product.id}`);
      toast.success('Added to wishlist');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <Link href={`/product/${product.slug}`}
      className={cn('group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300', className)}>
      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
        {product.thumbnail ? (
          <img src={resolveImageUrl(product.thumbnail)} alt={product.name}
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
            className="block h-full w-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="text-gray-300 text-6xl">💊</div>
        )}
        {product.prescription_required && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            Rx
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleWishlist} className="p-2 bg-white rounded-full shadow hover:bg-red-50">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={handleAddToCart} className="p-2 bg-teal-600 rounded-full shadow hover:bg-teal-700">
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-teal-600">{product.name}</h3>
        {product.average_rating ? (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-600">{product.average_rating} ({product.review_count})</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
