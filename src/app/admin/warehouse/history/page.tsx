"use client";

import { useEffect, useState } from "react";
import { getStockMovements, StockMovement } from "@/app/actions/warehouseActions";
import { Loader2, ArrowUpRight, ArrowDownRight, Package, Download } from "lucide-react";
import Link from "next/link";
import { downloadCSV } from "@/utils/exportCsv";

export default function TransactionHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getStockMovements();
        setMovements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    const columns = ['Tanggal', 'Produk', 'Part Number', 'Rak', 'Kompartemen', 'Tipe Mutasi', 'Kuantitas', 'Catatan'];
    const rows: (string | number)[][] = [];

    movements.forEach(m => {
      const date = new Date(m.created_at).toLocaleString('id-ID');
      const productName = m.product?.name || 'Produk dihapus';
      const partNumber = m.product?.part_number || '-';
      const rackName = m.compartment?.rack?.name || '-';
      const compartmentName = m.compartment?.name || '-';
      const type = m.type === 'IN' ? 'Masuk (In)' : 'Keluar (Out)';
      const qty = m.quantity;
      const note = m.reference_note || '-';

      rows.push([date, productName, partNumber, rackName, compartmentName, type, qty, note]);
    });

    const filename = `mutasi_stok_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi Stok</h1>
          <p className="mt-1 text-sm text-gray-500">
            Catatan mutasi barang masuk (Goods-In) dan barang keluar (Goods-Out) dari rak gudang.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Unduh CSV
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Lokasi / Rak</th>
                <th className="px-6 py-4 text-center">Tipe Mutasi</th>
                <th className="px-6 py-4 text-right">Kuantitas</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    Belum ada riwayat transaksi
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {m.product ? (
                        <div className="flex flex-col">
                          <Link href={`/admin/products/${m.product.id}`} className="font-medium text-gray-900 hover:text-brand-primary">
                            {m.product.name}
                          </Link>
                          <span className="text-xs text-gray-500">{m.product.part_number}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Produk dihapus</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {m.compartment ? (
                        <div className="flex flex-col">
                          <span className="text-gray-900">{m.compartment.rack?.name || "Rak Tidak Diketahui"}</span>
                          <span className="text-xs text-gray-500">{m.compartment.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Lokasi dihapus</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {m.type === 'IN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Keluar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-gray-900">
                      {m.type === 'IN' ? '+' : '-'}{m.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {m.reference_note || '-'}
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
