"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getAllProductsForDropdown, getAllCompartments, getAllStockPlacements } from "@/app/actions/warehouseActions";
import { createPartTransaction, TransactionCategory } from "@/app/actions/transactionActions";
import SearchableSelect from "@/components/SearchableSelect";

export default function NewTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [category, setCategory] = useState<TransactionCategory>('Beli untuk stock / PO');
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  
  // Item states (only 1 item per transaction as requested)
  const [productId, setProductId] = useState('');
  const [compartmentId, setCompartmentId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Master data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [compartments, setCompartments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [placements, setPlacements] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [prods, comps, places] = await Promise.all([
        getAllProductsForDropdown(),
        getAllCompartments(),
        getAllStockPlacements()
      ]);
      setProducts(prods || []);
      setCompartments(comps || []);
      setPlacements(places || []);
      setIsLoading(false);
    }
    loadData();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !compartmentId || quantity <= 0) {
      alert("Pastikan produk, kompartemen, dan kuantitas valid.");
      return;
    }

    setIsSubmitting(true);
    const res = await createPartTransaction({
      type,
      product_id: productId,
      compartment_id: compartmentId,
      quantity,
      transaction_category: category,
      sender: type === 'IN' ? sender : undefined,
      receiver,
      price: type === 'IN' && price !== '' ? Number(price) : undefined,
      transaction_date: date,
      reference_note: notes
    });

    if (res.success) {
      router.push('/admin/transactions');
    } else {
      alert(res.error || "Gagal mencatat transaksi");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const inboundCategories = ['Beli untuk stock / PO', 'Sample masih bagus', 'Sample tidak oke'];
  const outboundCategories = ['Kiriman PO', 'Kiriman Sample'];
  const activeCategories = type === 'IN' ? inboundCategories : outboundCategories;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/transactions" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catat Keluar/Masuk Part</h1>
          <p className="mt-1 text-sm text-gray-500">
            Catat 1 jenis part untuk setiap kali masuk atau keluar gudang.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          
          <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => {
                setType('IN');
                setCategory('Beli untuk stock / PO');
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${type === 'IN' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Part Masuk (Inbound)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('OUT');
                setCategory('Kiriman PO');
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${type === 'OUT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Part Keluar (Outbound)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
                required
              >
                {activeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Part</label>
            <SearchableSelect
              options={products.map(p => ({ value: p.id, label: `${p.part_number} - ${p.name} (Stok: ${p.stock})` }))}
              value={productId}
              onChange={setProductId}
              placeholder="-- Cari Produk --"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {type === 'IN' ? 'Tujuan Kompartemen (Rak)' : 'Ambil dari Kompartemen'}
              </label>
              <SearchableSelect
                options={(() => {
                  if (type === 'IN') {
                    return compartments.map(c => ({ value: c.id, label: `${c.rack?.name} - ${c.name}` }));
                  } else {
                    if (!productId) return [];
                    const available = placements.filter(p => p.product_id === productId);
                    return available.map(p => {
                      const comp = compartments.find(c => c.id === p.compartment_id);
                      return comp ? { value: comp.id, label: `${comp.rack?.name} - ${comp.name} (Stok: ${p.quantity})` } : null;
                    }).filter((opt): opt is {value: string; label: string} => Boolean(opt));
                  }
                })()}
                value={compartmentId}
                onChange={setCompartmentId}
                placeholder={type === 'OUT' && !productId ? "-- Pilih produk dulu --" : "-- Cari Lokasi --"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">QTY (Jumlah)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-primary"
                required
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === 'IN' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Barang Dari Siapa</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Nama supplier / pengirim"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Barang Untuk Siapa</label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Nama penerima / customer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
              />
            </div>

            {type === 'IN' && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Opsional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Keterangan (Opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary"
            />
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}
