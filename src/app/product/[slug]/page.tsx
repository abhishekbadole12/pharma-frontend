'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Heart, Minus, Plus, Shield } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { resolveImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import ProductGrid from '@/components/products/ProductGrid';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse bg-gray-200 h-96 rounded-xl" /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Product not found</div>;

  const handleAddToCart = async () => {
    if (!user || user.status !== 'APPROVED') { toast.error('Please login to shop'); return; }
    try {
      await addItem(product.id, quantity);
      toast.success('Added to cart');
    } catch { toast.error('Failed to add to cart'); }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'composition', label: 'Composition' },
    { id: 'usage', label: 'Usage & Warnings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 sm:py-8">
      <div className="grid md:grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-12">
        <div className="bg-white rounded-xl border aspect-square overflow-hidden">
          {product.thumbnail ? (
            <img src={resolveImageUrl(product.thumbnail)} alt={product.name}
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
              className="block w-full h-full object-cover" />
          ) : (
            <div className="text-8xl">💊</div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-4">SKU: {product.sku}</p>

          {product.average_rating ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.average_rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}</div>
              <span className="text-sm text-gray-600">{product.average_rating} ({product.review_count} reviews)</span>
            </div>
          ) : null}

          {product.prescription_required && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <Shield className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-amber-800">Prescription required for this product</span>
            </div>
          )}

          <p className="text-gray-600 mb-6">{product.short_description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={async () => {
              await handleAddToCart();
              window.location.href = '/checkout';
            }}
              className="flex-1 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50">
              Buy Now
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6 p-3 bg-gray-50 rounded-lg">
            Disclaimer: This application is for informational and e-commerce purposes. 
            Medicines should be used only as directed by a qualified healthcare professional.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border mb-8 sm:mb-12">
        <div className="flex overflow-x-auto border-b">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 sm:px-6 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'description' && <p>{product.description}</p>}
          {activeTab === 'composition' && (
            <div className="space-y-2">
              {product.composition && <p><strong>Composition:</strong> {product.composition}</p>}
              {product.manufacturer && <p><strong>Manufacturer:</strong> {product.manufacturer}</p>}
              {product.dosage && <p><strong>Dosage:</strong> {product.dosage}</p>}
              {product.storage && <p><strong>Storage:</strong> {product.storage}</p>}
              {product.expiry_info && <p><strong>Expiry:</strong> {product.expiry_info}</p>}
            </div>
          )}
          {activeTab === 'usage' && (
            <div className="space-y-2">
              {product.usage && <p><strong>Usage:</strong> {product.usage}</p>}
              {product.warnings && <p><strong>Warnings:</strong> {product.warnings}</p>}
            </div>
          )}
        </div>
      </div>

      {product.related_products && product.related_products.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={product.related_products} />
        </div>
      )}
    </div>
  );
}
