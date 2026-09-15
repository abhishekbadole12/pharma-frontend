'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import Pagination from '@/components/ui/Pagination';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: '',
    prescription_required: '',
    sort: 'newest',
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
    api.get('/products/brands').then(({ data }) => setBrands(data.brands));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params: Record<string, string | number> = { page, per_page: 20, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.prescription_required) params.prescription_required = filters.prescription_required;
      if (searchParams.get('featured')) params.featured = 'true';
      if (searchParams.get('best_seller')) params.best_seller = 'true';

      try {
        const { data } = await api.get('/products', { params });
        setProducts(data.items);
        setPages(data.pages);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [page, filters, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shop</h1>
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input type="text" value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Search..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={filters.category}
                onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select value={filters.brand}
                onChange={(e) => { setFilters({ ...filters, brand: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="newest">Newest</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ProductGrid products={[]} loading /></div>}>
      <ShopContent />
    </Suspense>
  );
}
