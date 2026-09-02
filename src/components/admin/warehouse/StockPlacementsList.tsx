"use client";

import { useState, useEffect } from 'react';
import { Package, Trash2, Plus, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { 
  getPlacementsByCompartment, 
  getAllProductsForDropdown, 
  addStockToCompartment, 
  removeStockFromCompartment,
  StockPlacement
} from '@/app/actions/warehouseActions';

export default function StockPlacementsList({ compartmentId, rackId }: { compartmentId: string, rackId: string }) {
  const [placements, setPlacements] = useState<StockPlacement[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; part_number: string; stock: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.part_number.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 50);

  const loadData = async () => {
    try {
      const [placementsData, productsData] = await Promise.all([
        getPlacementsByCompartment(compartmentId),
        getAllProductsForDropdown()
      ]);
      setPlacements(placementsData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compartmentId]);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Pilih produk terlebih dahulu");
    if (parseInt(quantity) <= 0) return alert("Kuantitas harus lebih dari 0");

    setIsSubmitting(true);
    const res = await addStockToCompartment(compartmentId, selectedProductId, parseInt(quantity), rackId);
    
    if (res.success) {
      setSelectedProductId('');
      setSearchQuery('');
      setQuantity('1');
      await loadData();
    } else {
      alert(res.error || "Gagal menambah stok");
    }
    setIsSubmitting(false);
  };

  const handleRemoveStock = async (placementId: string, maxQuantity: number) => {
    const qtyStr = window.prompt(`Keluarkan produk ini dari kompartemen?\n\nBerapa unit yang ingin dikeluarkan? (Maksimal: ${maxQuantity})`, maxQuantity.toString());
    
    if (qtyStr !== null) {
      const qty = parseInt(qtyStr);
      if (isNaN(qty) || qty <= 0 || qty > maxQuantity) {
        alert(`Kuantitas tidak valid. Harap masukkan angka antara 1 dan ${maxQuantity}.`);
        return;
      }
      setIsSubmitting(true);
      const res = await removeStockFromCompartment(placementId, rackId, qty);
      if (res.success) {
        await loadData();
      } else {
        alert(res.error || "Gagal mengeluarkan stok dari kompartemen");
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Package className="w-4 h-4" />
        Isi Kompartemen
      </h4>

      {placements.length === 0 ? (
        <p className="text-sm text-gray-500 italic mb-4">Kompartemen ini kosong.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {placements.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white p-2.5 rounded border border-gray-100 shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{p.product?.name || 'Produk Tidak Ditemukan'}</span>
                <span className="text-xs text-gray-500">SKU: {p.product?.part_number || '-'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-brand-primary">{p.quantity} Unit</span>
                <Link
                  href={`/admin/products/${p.product_id}`}
                  className="p-1.5 text-brand-primary hover:bg-blue-50 rounded"
                  title="Detail Produk"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleRemoveStock(p.id, p.quantity)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  title="Keluarkan Barang"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Stock Form */}
      <form onSubmit={handleAddStock} className="flex gap-2 items-start mt-2 border-t border-gray-200 pt-4">
        <div className="flex-1 relative">
          <div 
            className={`w-full px-3 py-2 border ${isDropdownOpen ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-gray-300'} rounded-lg text-sm bg-white flex items-center transition-all`}
            onClick={() => setIsDropdownOpen(true)}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProductId('');
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => {
                // Delay hiding dropdown so click on item registers
                setTimeout(() => setIsDropdownOpen(false), 200);
              }}
              placeholder="Ketik SKU atau Nama Produk..."
              className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
              required={!selectedProductId}
            />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">Produk tidak ditemukan.</div>
              ) : (
                filteredProducts.map(prod => (
                  <div 
                    key={prod.id} 
                    onMouseDown={(e) => {
                      // Prevent onBlur from firing before click
                      e.preventDefault(); 
                    }}
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setSearchQuery(`${prod.part_number} - ${prod.name}`);
                      setIsDropdownOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm hover:bg-brand-primary/5 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-semibold text-gray-900">{prod.part_number}</span>
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        Total: {prod.stock}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={prod.name}>
                      {prod.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="w-24">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-primary focus:border-brand-primary"
            placeholder="Qty"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !selectedProductId}
          className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Taruh Barang
        </button>
      </form>
    </div>
  );
}
