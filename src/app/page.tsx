'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Truck, Shield, Clock, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [feat, best, newest, cats] = await Promise.all([
          api.get('/products', { params: { featured: 'true', per_page: 8 } }),
          api.get('/products', { params: { best_seller: 'true', per_page: 8 } }),
          api.get('/products', { params: { sort: 'newest', per_page: 8 } }),
          api.get('/categories'),
        ]);
        setFeatured(feat.data.items);
        setBestSellers(best.data.items);
        setNewArrivals(newest.data.items);
        setCategories(cats.data.categories);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const benefits = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500' },
    { icon: Shield, title: '100% Genuine', desc: 'Authentic products guaranteed' },
    { icon: Clock, title: '24/7 Support', desc: 'Expert pharmacist assistance' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-r from-teal-700 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-lg text-teal-100 mb-8">
              Shop medicines, vitamins, healthcare devices and wellness products from the comfort of your home.
            </p>
            {/* <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery) window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
            }} className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search medicines, brands..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white" />
              </div>
              <button type="submit" className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50">
                Search
              </button>
            </form> */}
          </div>
        </div>
      </section>

      {/* Categories */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`}
              className="flex flex-col items-center p-4 bg-white rounded-xl border hover:border-teal-300 hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-2xl mb-2">💊</div>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section> */}

      {/* Featured Products */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/shop?featured=true" className="text-teal-600 flex items-center gap-1 text-sm font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section> */}

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Get 10% Off Your First Order</h3>
            <p className="text-amber-100">Use code WELCOME10 at checkout. Min order ₹200.</p>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Best Sellers</h2>
          <Link href="/shop?best_seller=true" className="text-teal-600 flex items-center gap-1 text-sm font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={bestSellers} loading={loading} />
      </section> */}

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          {/* <h2 className="text-2xl font-bold">New Arrivals</h2> */}
          <h2 className="text-2xl font-bold">Medicines</h2>
          <Link href="/shop?sort=newest" className="text-teal-600 flex items-center gap-1 text-sm font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} />
      </section>

      {/* Why Choose Us */}
      {/* <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose PharmaCare?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center p-6">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-teal-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-teal-100 mb-6">Get updates on new products and health tips.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900" required />
            <button type="submit" className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50">
              Subscribe
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
}
