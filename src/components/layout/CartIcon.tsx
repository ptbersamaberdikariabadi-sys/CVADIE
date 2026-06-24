"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Link href="/rfq" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Cart">
      <ShoppingCart className="w-5 h-5 text-gray-600" />
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-primary rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
