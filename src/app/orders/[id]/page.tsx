'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.post(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Cannot cancel order');
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="animate-pulse bg-gray-200 h-96 rounded-xl" /></div>;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>;

  const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
          <p className="text-gray-500">{formatDate(order.created_at)}</p>
        </div>
        {canCancel && (
          <button onClick={handleCancel} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
            Cancel Order
          </button>
        )}
      </div>

      {/* Timeline */}
      {order.history && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-bold mb-4">Order Timeline</h2>
          <div className="space-y-3">
            {order.history.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-600" />
                <div>
                  <p className="text-sm font-medium">{h.status.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">{formatDate(h.created_at)} {h.note && `- ${h.note}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-bold mb-4">Items</h2>
        {order.items.map((item) => (
          <div key={item.product_id} className="flex justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery address */}
      <div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-3">Delivery Address</h2>
          <p className="text-sm text-gray-700">
            {order.shipping_address.full_name}<br />
            {order.shipping_address.address}<br />
            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
            Phone: {order.shipping_address.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
