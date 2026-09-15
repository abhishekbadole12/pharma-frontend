'use client';

import { useAuthStore } from '@/store/auth';

export default function AccountPage() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-500">Name</label><p className="font-medium">{user.first_name} {user.last_name}</p></div>
          <div><label className="text-sm text-gray-500">Email</label><p className="font-medium">{user.email}</p></div>
          <div><label className="text-sm text-gray-500">Phone</label><p className="font-medium">{user.phone}</p></div>
          <div><label className="text-sm text-gray-500">Account Type</label><p className="font-medium">{user.client_type}</p></div>
          <div><label className="text-sm text-gray-500">Status</label><p className="font-medium">{user.status}</p></div>
        </div>
        {user.address && (
          <div className="pt-4 border-t">
            <label className="text-sm text-gray-500">Address</label>
            <p>{user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}</p>
          </div>
        )}
        {user.business && (
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Business Information</h3>
            <p className="text-sm">Name: {user.business.name}</p>
            <p className="text-sm">GST: {user.business.gst_number}</p>
          </div>
        )}
      </div>
    </div>
  );
}
