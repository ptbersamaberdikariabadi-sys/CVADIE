"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, PackageOpen, Loader2 } from "lucide-react";
import { getRacks, searchWarehouseItems, Rack } from "@/app/actions/warehouseActions";
import Link from "next/link";
import Image from "next/image";

export default function SearchWarehousePage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRack, setSelectedRack] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial racks
  useEffect(() => {
    const fetchRacks = async () => {
      const data = await getRacks();
      setRacks(data);
    };
    fetchRacks();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchWarehouseItems(debouncedQuery, selectedRack);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, selectedRack]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cari Barang</h1>
          <p className="text-gray-500 mt-1">Cari stok barang berdasarkan nama, SKU, atau lokasi Rak.</p>
        </div>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama barang atau SKU (Part Number)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedRack}
              onChange={(e) => setSelectedRack(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none bg-white"
            >
              <option value="">Semua Rak</option>
              {racks.map(rack => (
                <option key={rack.id} value={rack.id}>{rack.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-4" />
            <p>Mencari data...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <PackageOpen className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">Tidak ada barang ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter rak Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Barang</th>
                  <th scope="col" className="px-6 py-4 font-medium">SKU / Kategori</th>
                  <th scope="col" className="px-6 py-4 font-medium">Lokasi Penyimpanan</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Kuantitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                          {item.product?.image_url ? (
                            <Image 
                              src={item.product.image_url} 
                              alt={item.product.name} 
                              width={40} 
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <PackageOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <Link href={`/admin/products/${item.product?.id}`} className="font-semibold text-gray-900 hover:text-brand-primary transition-colors">
                          {item.product?.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{item.product?.part_number}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.product?.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                          {item.compartment?.rack?.name || '-'}
                        </div>
                        <div className="text-gray-500 text-xs ml-5 mt-0.5">
                          Kompartemen: {item.compartment?.name || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        {item.quantity} Unit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
