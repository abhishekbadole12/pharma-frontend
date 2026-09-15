import Link from 'next/link';
import { Pill, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Pill className="w-6 h-6 text-teal-400" />
              Dhan Laxmi Pharma 
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted online pharmacy for medicines, healthcare products, and wellness essentials. 
              Quality products delivered to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-teal-400">Shop</Link></li>
              {/* <li><Link href="/about" className="hover:text-teal-400">About Us</Link></li> */}
              {/* <li><Link href="/contact" className="hover:text-teal-400">Contact</Link></li> */}
            </ul>
          </div>

          {/* <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=medicines" className="hover:text-teal-400">Medicines</Link></li>
              <li><Link href="/shop?category=vitamins" className="hover:text-teal-400">Vitamins & Supplements</Link></li>
              <li><Link href="/shop?category=personal-care" className="hover:text-teal-400">Personal Care</Link></li>
              <li><Link href="/shop?category=healthcare-devices" className="hover:text-teal-400">Healthcare Devices</Link></li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-400" /> +91 6232 257 559</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-400" /> dhanlaxmipharmakanker@gmail.com </li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-teal-400 mt-0.5" /> Shitlapara Opposite. Shitla Mata Mandir, kanker</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="mb-2 text-gray-400">
            Disclaimer: This application is for informational and e-commerce purposes. 
            Medicines should be used only as directed by a qualified healthcare professional.
          </p>
          <p>&copy; {new Date().getFullYear()} Dhan Laxmi Pharma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
