"use client";

import { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { allocateUnallocatedStock } from '@/app/actions/warehouseActions';

export default function UnallocatedWarningTable({ 
  unallocatedStock,
  compartments
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unallocatedStock: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compartments: any[]
}) {
  const [allocatingId, setAllocatingId] = useState<string | null>(null);
  const [selectedCompartment, setSelectedCompartment] = useState<string>('');
  const [allocateQty, setAllocateQty] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStartAllocate = (item: any) => {
    setAllocatingId(item.id);
    setAllocateQty(item.unallocated);
    setSelectedCompartment('');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveAllocation = async (item: any) => {
    if (!selectedCompartment || allocateQty <= 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await allocateUnallocatedStock(item.id, selectedCompartment, allocateQty);
      if (result.success) {
        setAllocatingId(null);
      } else {
        alert(result.error || 'Terjadi kesalahan saat mengalokasikan stok');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (unallocatedStock.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden mb-8">
      <div className="p-4 border-b border-amber-200 bg-amber-100/50 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h2 className="text-sm font-bold text-amber-900">Perhatian: Ada Barang Belum Memiliki Lokasi</h2>
      </div>
      <div className="p-4">
        <p className="text-xs text-amber-700 mb-3">
          Barang-barang di bawah ini tercatat memiliki stok di Katalog Utama, namun **belum dimasukkan ke dalam rak manapun**. Silakan alokasikan untuk menaruhnya ke dalam kompartemen.
        </p>
        <div className="overflow-x-auto rounded-lg border border-amber-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-amber-800 uppercase bg-amber-50 border-b border-amber-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Part Number</th>
                <th scope="col" className="px-4 py-3 font-medium">Nama Produk</th>
                <th scope="col" className="px-4 py-3 font-medium text-center">Mengambang</th>
                <th scope="col" className="px-4 py-3 font-medium text-right w-80">Alokasikan Ke Kompartemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {unallocatedStock.map((item: any) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{item.part_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-center font-bold text-red-600">{item.unallocated}</td>
                  <td className="px-4 py-3 text-right">
                    {allocatingId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min="1"
                          max={item.unallocated}
                          value={allocateQty}
                          onChange={(e) => setAllocateQty(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <select
                          value={selectedCompartment}
                          onChange={(e) => setSelectedCompartment(e.target.value)}
                          className="w-48 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-xs truncate"
                        >
                          <option value="">-- Pilih Lokasi --</option>
                          {compartments.map(c => (
                            <option key={c.id} value={c.id}>{c.rack?.name} - {c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveAllocation(item)}
                          disabled={isSubmitting || !selectedCompartment || allocateQty <= 0}
                          className="px-2 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
                        >
                          {isSubmitting ? '...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => setAllocatingId(null)}
                          className="px-2 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStartAllocate(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Alokasikan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
