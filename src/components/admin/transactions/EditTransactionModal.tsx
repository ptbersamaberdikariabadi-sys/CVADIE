"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { updatePartTransaction, TransactionCategory } from "@/app/actions/transactionActions";
import { getAllProductsForDropdown, getAllCompartments, getAllStockPlacements } from "@/app/actions/warehouseActions";
import SearchableSelect from "@/components/SearchableSelect";

interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  product_id: string;
  compartment_id: string | null;
  quantity: number;
  transaction_category: string;
  sender?: string | null;
  receiver?: string | null;
  price?: number | null;
  transaction_date?: string | null;
  reference_note?: string | null;
  product?: { id: string; name: string; part_number: string } | null;
  compartment?: { id: string; name: string; rack?: { name: string } } | null;
}

interface Props {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: () => void;
}

const inboundCategories = ['Beli untuk stock / PO', 'Sample masih bagus', 'Sample tidak oke'];
const outboundCategories = ['Kiriman PO', 'Kiriman Sample'];

export default function EditTransactionModal({ transaction, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states — pre-filled from existing transaction
  const [type, setType] = useState<'IN' | 'OUT'>(transaction.type);
  const [productId, setProductId] = useState(transaction.product_id);
  const [compartmentId, setCompartmentId] = useState(transaction.compartment_id || '');
  const [quantity, setQuantity] = useState(transaction.quantity);
  const [category, setCategory] = useState<TransactionCategory>(
    (transaction.transaction_category as TransactionCategory) || 'Beli untuk stock / PO'
  );
  const [date, setDate] = useState(
    transaction.transaction_date
      ? transaction.transaction_date.slice(0, 10)
      : new Date().toISOString().split('T')[0]
  );
  const [sender, setSender] = useState(transaction.sender || '');
  const [receiver, setReceiver] = useState(transaction.receiver || '');
  const [price, setPrice] = useState<number | ''>(transaction.price ?? '');
  const [notes, setNotes] = useState(transaction.reference_note || '');

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
        getAllStockPlacements(),
      ]);
      setProducts(prods || []);
      setCompartments(comps || []);
      setPlacements(places || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // When type changes, reset category to valid default
  const handleSetType = (newType: 'IN' | 'OUT') => {
    setType(newType);
    const cats = newType === 'IN' ? inboundCategories : outboundCategories;
    if (!cats.includes(category)) {
      setCategory(cats[0] as TransactionCategory);
    }
  };

  const activeCategories = type === 'IN' ? inboundCategories : outboundCategories;

  const compartmentOptions = (() => {
    if (type === 'IN') {
      return compartments.map(c => ({ value: c.id, label: `${c.rack?.name} - ${c.name}` }));
    } else {
      if (!productId) return [];
      const available = placements.filter(p => p.product_id === productId);
      // Also always include the original compartment so it shows up even for the same product
      const originalCompartment = compartments.find(c => c.id === transaction.compartment_id);
      const opts = available.map(p => {
        const comp = compartments.find(c => c.id === p.compartment_id);
        return comp ? { value: comp.id, label: `${comp.rack?.name} - ${comp.name} (Stok: ${p.quantity})` } : null;
      }).filter((opt): opt is { value: string; label: string } => Boolean(opt));
      // If original compartment is not in the list (because we're editing), add it
      if (originalCompartment && !opts.find(o => o.value === originalCompartment.id)) {
        opts.unshift({ value: originalCompartment.id, label: `${originalCompartment.rack?.name} - ${originalCompartment.name} (Kompartemen Asal)` });
      }
      return opts;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !compartmentId || quantity <= 0) {
      alert("Pastikan produk, kompartemen, dan kuantitas valid.");
      return;
    }

    setIsSubmitting(true);
    const res = await updatePartTransaction(transaction.id, {
      type,
      product_id: productId,
      compartment_id: compartmentId,
      quantity,
      transaction_category: category,
      sender: type === 'IN' ? sender : undefined,
      receiver: receiver || undefined,
      price: type === 'IN' && price !== '' ? Number(price) : undefined,
      transaction_date: date,
      reference_note: notes || undefined,
    });

    if (res.success) {
      onSuccess();
    } else {
      alert(res.error || "Gagal mengubah transaksi");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Transaksi</h2>
            <p className="text-xs text-amber-600 mt-0.5">
              ⚠️ Mengubah Part/Lokasi/Qty akan memutarbalikkan stok lama dan menerapkan yang baru.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Type toggle */}
            <div className="flex gap-3 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => handleSetType('IN')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'IN' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Part Masuk (IN)
              </button>
              <button
                type="button"
                onClick={() => handleSetType('OUT')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'OUT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Part Keluar (OUT)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {activeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Part</label>
              <SearchableSelect
                options={products.map(p => ({ value: p.id, label: `${p.part_number} - ${p.name} (Stok: ${p.stock})` }))}
                value={productId}
                onChange={(val) => {
                  setProductId(val);
                  setCompartmentId(''); // Reset compartment when product changes
                }}
                placeholder="-- Cari Produk --"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Compartment */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {type === 'IN' ? 'Tujuan Kompartemen' : 'Ambil dari Kompartemen'}
                </label>
                <SearchableSelect
                  options={compartmentOptions}
                  value={compartmentId}
                  onChange={setCompartmentId}
                  placeholder={type === 'OUT' && !productId ? '-- Pilih produk dulu --' : '-- Cari Lokasi --'}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">QTY (Jumlah)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'IN' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Dari Siapa</label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Nama supplier / pengirim"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Untuk Siapa</label>
                <input
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="Nama penerima / customer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {type === 'IN' && (
                <div className={`space-y-1.5 ${sender ? '' : 'md:col-start-1'} md:col-span-2`}>
                  <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Opsional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Keterangan</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan tambahan..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
