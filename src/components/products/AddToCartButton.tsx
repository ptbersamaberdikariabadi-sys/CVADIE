"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    part_number: string;
    name: string;
    category: string;
    image_url: string | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`flex-1 flex justify-center items-center gap-2 font-bold py-3 rounded transition-colors text-sm ${
        added 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-brand-accent hover:bg-amber-600 text-white'
      }`}
    >
      {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      {added ? 'DITAMBAHKAN' : '+ KERANJANG'}
    </button>
  );
}
