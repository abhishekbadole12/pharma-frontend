'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Truck, Shield, Clock, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import Image from 'next/image';

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
            <span className="inline-flex rounded-full border border-white/35 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
              A little thank-you from us
            </span>
            <h1 className="text-4xl mt-4 md:text-5xl font-bold mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-lg text-teal-100">
              Shop medicines, vitamins, healthcare devices and wellness products from the comfort of your home.
            </p>
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
      {/* <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Get 10% Off Your First Order</h3>
            <p className="text-amber-100">Use code WELCOME10 at checkout. Min order ₹200.</p>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50">
            Shop Now
          </Link>
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 pt-6 sm:py-8" aria-labelledby="promotion-title">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-white shadow-[0_20px_55px_-28px_rgba(194,65,12,0.55)]">
          <div className="grid items-center md:min-h-[300px] md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
              <span className="inline-flex rounded-full border border-white/35 bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
                End soon
              </span>

              {/* Mobile Promotional Card */}
            <div className="my-4 overflow-hidden rounded-2xl border border-orange-100 bg-white p-2 shadow-lg md:hidden">
              <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-orange-50 sm:h-[340px]">
                <Image
                  src="/Assets/promo.jpeg"
                  alt="Daily-OD Gold promotion: Buy two boxes and get 2 kg basmati rice free"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-contain object-center"
                />
                {/* Offer Badge */}
                <div className="absolute right-2 top-2 flex h-[65px] w-[65px] rotate-6 flex-col items-center justify-center rounded-full border border-orange-200 bg-white shadow-lg">
                  <strong className="text-[18px] font-extrabold leading-none text-orange-600">
                    FREE
                  </strong>
                  <span className="mt-1 text-[8px] font-bold uppercase text-orange-700">
                    2 KG RICE
                  </span>
                </div>
              </div>
            </div>
              <h2 id="promotion-title" className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
                Buy 2 medicine boxes, get 2 kg basmati rice free.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/95 sm:text-base">
                Enjoy <strong className="font-bold">10% off</strong> your first order. Use code{' '}
                <span className="rounded bg-white/20 px-1.5 py-0.5 font-semibold tracking-wide">WELCOME10</span>{' '}
                at checkout.

              </p>
              {/* <p className="mt-1.5 text-xs text-white/85 sm:text-sm">On orders of ₹200 or more</p> */}
              <Link
                href="/shop"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-orange-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Shop now <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative hidden min-h-[300px] self-stretch md:block">
              <Image
                src="/Assets/promo.jpeg"
                alt="Vitamins and wellness products for your everyday care"
                fill
                priority
                sizes="(max-width: 1024px) 45vw, 560px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-500/30 to-transparent" />
              <span className="absolute right-7 top-7 flex h-[82px] w-[82px] rotate-6 flex-col items-center justify-center rounded-full border-2 border-white/80 bg-white text-orange-700 shadow-lg">
                <strong className="text-[26px] leading-none">Free</strong>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">2kg Rice</span>
              </span>a
            </div>

            
          </div>
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
      <section className="max-w-7xl mx-auto px-4 py-10">
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
