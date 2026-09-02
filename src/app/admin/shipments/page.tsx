"use client";

import { useEffect, useState } from "react";
import { getShipments } from "@/app/actions/shipmentActions";
import { Loader2, Plus, ArrowUpRight, ArrowDownRight, Package, Download } from "lucide-react";
import Link from "next/link";
import { downloadCSV } from "@/utils/exportCsv";

export default function ShipmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getShipments();
        setShipments(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    const columns = ['Tanggal', 'Tipe', 'Nomor Ref', 'Partner', 'Part Number', 'Nama Barang', 'Kuantitas'];
    const rows: (string | number)[][] = [];

    shipments.forEach(shipment => {
      const date = new Date(shipment.date || shipment.created_at).toLocaleString('id-ID');
      const type = shipment.type === 'INBOUND' ? 'Masuk' : 'Keluar';
      const ref = shipment.reference_number || '-';
      const partner = shipment.partner_name || '-';

      if (shipment.shipment_items && shipment.shipment_items.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shipment.shipment_items.forEach((item: any) => {
          rows.push([
            date, type, ref, partner, 
            item.product?.part_number || '-', 
            item.product?.name || '-', 
            item.quantity
          ]);
        });
      } else {
        rows.push([date, type, ref, partner, '-', '-', 0]);
      }
    });

    const filename = `surat_jalan_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, columns, rows);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistik / Surat Jalan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola pengiriman (Outbound) dan penerimaan (Inbound) barang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Unduh CSV
          </button>
          <Link
            href="/admin/shipments/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Transaksi Baru
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Partner (Supplier/Pelanggan)</th>
                <th className="px-6 py-4">No. Ref (PO/DO)</th>
                <th className="px-6 py-4 text-center">Total Item</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    Belum ada transaksi logistik
                  </td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(s.date).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {s.type === 'INBOUND' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          Terima Barang
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Kirim Barang
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {s.partner_name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {s.reference_number || '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {s.shipment_items?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/shipments/${s.id}`}
                        className="text-brand-primary hover:text-blue-700 font-medium text-sm"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
