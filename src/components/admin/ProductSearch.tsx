"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        router.push(`/admin/products?query=${encodeURIComponent(query)}`);
      } else {
        router.push(`/admin/products`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        placeholder="Cari part number atau nama produk..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
