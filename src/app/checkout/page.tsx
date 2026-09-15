'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { Address } from '@/types';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', phone: '', address: '', apartment: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    fetchCart();
    api.get('/addresses').then(({ data }) => {
      setAddresses(data.addresses);
      const defaultAddr = data.addresses.find((a: Address) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.id!);
    });
  }, [fetchCart]);

  const handleAddAddress = async () => {
    try {
      const { data } = await api.post('/addresses', { ...newAddress, is_default: addresses.length === 0 });
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      toast.success('Address added');
    } catch { toast.error('Failed to add address'); }
  };

  const handleUploadPrescription = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/orders/prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrescriptionId(data.prescription_id);
      toast.success('Prescription uploaded');
    } catch { toast.error('Failed to upload prescription'); }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select an address'); return; }
    if (items.some((item) => item.prescription_required) && !prescriptionId) {
      toast.error('Please upload prescription'); return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        address_id: selectedAddress,
        prescription_id: prescriptionId || undefined,
      });
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.order.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to place order');
    }
    setLoading(false);
  };

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/shop')} className="px-6 py-3 bg-teal-600 text-white rounded-lg">Continue Shopping</button>
      </div>
    );
  }

  const steps = ['Address', 'Review & Place Order'];

  return (
    <div className="max-w-4xl mx-auto px-3 py-5 sm:px-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s!} className={`flex items-center gap-2 ${step > i + 1 ? 'text-teal-600' : step === i + 1 ? 'text-teal-700 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
              step >= i + 1 ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-300'
            }`}>{i + 1}</span>
            <span className="text-sm hidden sm:inline">{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4">
          <h2 className="font-bold text-lg">Delivery Address</h2>
          {addresses.map((addr) => (
            <label key={addr.id} className={`block p-4 border rounded-lg cursor-pointer ${selectedAddress === addr.id ? 'border-teal-600 bg-teal-50' : ''}`}>
              <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id!)} className="mr-3" />
              <strong>{addr.full_name}</strong> - {addr.phone}<br />
              <span className="text-sm text-gray-600">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</span>
            </label>
          ))}

          <details className="mt-4">
            <summary className="text-teal-600 cursor-pointer font-medium">Add New Address</summary>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {Object.entries({ full_name: 'Full Name', phone: 'Phone', address: 'Address', apartment: 'Apartment/Area', city: 'City', state: 'State', pincode: 'Pincode' }).map(([key, label]) => (
                <input key={key} placeholder={label} value={newAddress[key as keyof typeof newAddress]}
                  onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm" />
              ))}
              <button onClick={handleAddAddress} className="sm:col-span-2 py-2 bg-teal-600 text-white rounded-lg text-sm">Save Address</button>
            </div>
          </details>

          <button onClick={() => setStep(2)} disabled={!selectedAddress}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 mt-4">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border p-4 sm:p-6">
          <h2 className="font-bold text-lg mb-4">Review Order</h2>
          {items.some((item) => item.prescription_required) && (
            <div className="mb-6 border-b pb-6">
              <h3 className="font-medium mb-2">Prescription Required</h3>
              <p className="text-sm text-gray-600 mb-4">Some items in your cart require a valid prescription.</p>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleUploadPrescription}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700" />
              {prescriptionId && <p className="text-green-600 text-sm mt-2">Prescription uploaded successfully</p>}
            </div>
          )}
          <div className="space-y-2 text-sm mb-6">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg">Back</button>
            <button onClick={handlePlaceOrder} disabled={loading || Boolean(items.some((item) => item.prescription_required) && !prescriptionId)}
              className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
