"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowLeft, Save, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getAllProductsForDropdown, getAllCompartments, getAllStockPlacements } from "@/app/actions/warehouseActions";
import { createShipment, ShipmentItemInput } from "@/app/actions/shipmentActions";
import SearchableSelect from "@/components/SearchableSelect";

export default function NewShipmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [type, setType] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND');
  const [partnerName, setPartnerName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [partnerAddress, setPartnerAddress] = useState('');
  const [attentionPerson, setAttentionPerson] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [poCode, setPoCode] = useState('');
  const [poDate, setPoDate] = useState('');
  
  const [items, setItems] = useState<ShipmentItemInput[]>([
    { product_id: '', compartment_id: '', quantity: 1, packing_quantity: 1, notes: '' }
  ]);

  // Master data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [compartments, setCompartments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [placements, setPlacements] = useState<any[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    const [prods, comps, places] = await Promise.all([
      getAllProductsForDropdown(),
      getAllCompartments(),
      getAllStockPlacements()
    ]);
    setProducts(prods || []);
    setCompartments(comps || []);
    setPlacements(places || []);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', compartment_id: '', quantity: 1, packing_quantity: 1, notes: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof ShipmentItemInput, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(item => !item.product_id || !item.compartment_id || item.quantity <= 0)) {
      alert("Pastikan semua item memiliki produk, kompartemen, dan kuantitas lebih dari 0.");
      return;
    }

    setIsSubmitting(true);
    const res = await createShipment({
      type,
      partner_name: partnerName,
      reference_number: referenceNumber,
      notes,
      date: new Date(date).toISOString(),
      partner_address: partnerAddress,
      attention_person: attentionPerson,
      driver_name: driverName,
      vehicle_number: vehicleNumber,
      quotation_number: quotationNumber,
      po_code: poCode,
      po_date: poDate ? new Date(poDate).toISOString() : undefined,
      items
    });

    if (res.success) {
      router.push('/admin/shipments');
    } else {
      alert(res.error || "Gagal membuat transaksi");
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/shipments" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Surat Jalan / Transaksi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Catat pengiriman atau penerimaan barang beserta lokasi penyimpanannya di gudang.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Utama */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Informasi Utama</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tipe Transaksi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'INBOUND' | 'OUTBOUND')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
                required
              >
                <option value="INBOUND">Terima Barang (Inbound dari Supplier)</option>
                <option value="OUTBOUND">Kirim Barang (Outbound ke Pelanggan)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {type === 'INBOUND' ? 'Nama Supplier' : 'Nama Pelanggan'}
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={type === 'INBOUND' ? 'Contoh: PT. Sumber Makmur' : 'Contoh: CV. Abadi Jaya'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nomor Surat Jalan (Ref)</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Contoh: 4-02/IX/2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Alamat Partner</label>
              <textarea
                value={partnerAddress}
                onChange={(e) => setPartnerAddress(e.target.value)}
                placeholder="Alamat lengkap partner..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Attn. (Penerima/U.P)</label>
              <input
                type="text"
                value={attentionPerson}
                onChange={(e) => setAttentionPerson(e.target.value)}
                placeholder="Contoh: PAK ADI / PAK DONI"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Dikirim Oleh (Nama Supir)</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Contoh: Fuja"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nomor Polisi Kendaraan</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Contoh: D 1234 ABC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Penawaran Harga Nomor</label>
              <input
                type="text"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                placeholder="Contoh: PH-2026-09-01 atau -"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kode PO</label>
              <input
                type="text"
                value={poCode}
                onChange={(e) => setPoCode(e.target.value)}
                placeholder="Contoh: NPO05869"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal PO</label>
              <input
                type="date"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Daftar Item */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Barang</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                title="Muat ulang data produk jika Anda baru saja menambahkan produk baru"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-primary text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Baris
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1 w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">Produk</label>
                    <Link href="/admin/products" target="_blank" className="text-xs text-brand-primary hover:text-blue-700 hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Produk Baru
                    </Link>
                  </div>
                  <SearchableSelect
                    options={products.map(p => ({ value: p.id, label: `${p.part_number} - ${p.name} (Stok: ${p.stock})` }))}
                    value={item.product_id}
                    onChange={(val) => handleItemChange(index, 'product_id', val)}
                    placeholder="-- Cari Produk --"
                    required
                  />
                </div>
                
                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs font-medium text-gray-500">
                    {type === 'INBOUND' ? 'Tujuan Kompartemen' : 'Ambil dari Kompartemen'}
                  </label>
                  <SearchableSelect
                    options={(() => {
                      if (type === 'INBOUND') {
                        return compartments.map(c => ({ value: c.id, label: `${c.rack?.name} - ${c.name}` }));
                      } else {
                        if (!item.product_id) return [];
                        const available = placements.filter(p => p.product_id === item.product_id);
                        return available.map(p => {
                          const comp = compartments.find(c => c.id === p.compartment_id);
                          return comp ? { value: comp.id, label: `${comp.rack?.name} - ${comp.name} (Stok: ${p.quantity})` } : null;
                        }).filter((opt): opt is {value: string; label: string} => Boolean(opt));
                      }
                    })()}
                    value={item.compartment_id}
                    onChange={(val) => handleItemChange(index, 'compartment_id', val)}
                    placeholder={type === 'OUTBOUND' && !item.product_id ? "-- Pilih produk dulu --" : "-- Cari Lokasi --"}
                    required
                  />
                </div>

                <div className="w-full md:w-24 space-y-1">
                  <label className="text-xs font-medium text-gray-500">Jumlah Packing</label>
                  <input
                    type="number"
                    min="1"
                    value={item.packing_quantity || 1}
                    onChange={(e) => handleItemChange(index, 'packing_quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-primary"
                    required
                  />
                </div>

                <div className="w-full md:w-24 space-y-1">
                  <label className="text-xs font-medium text-gray-500">Jumlah Barang</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-primary"
                    required
                  />
                </div>

                <div className="flex-1 w-full md:w-32 space-y-1">
                  <label className="text-xs font-medium text-gray-500">Keterangan / Satuan</label>
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                    placeholder="Contoh: Roll(s)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
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
