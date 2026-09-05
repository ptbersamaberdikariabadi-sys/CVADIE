"use client";

import { Download } from "lucide-react";
import { downloadCSV } from "@/utils/exportCsv";
import { StockMovement } from "@/app/actions/warehouseActions";

export default function ExportTransactionsButton({ transactions }: { transactions: StockMovement[] }) {
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const columns = [
      "ID",
      "Tipe",
      "Tanggal",
      "Produk",
      "Part Number",
      "Kategori",
      "Dari",
      "Untuk",
      "Qty",
      "Kompartemen",
      "Harga",
      "Keterangan"
    ];

    const data = transactions.map((tx) => [
      tx.id,
      tx.type,
      tx.transaction_date || new Date(tx.created_at).toLocaleDateString('id-ID'),
      tx.product?.name || "-",
      tx.product?.part_number || "-",
      tx.transaction_category || "-",
      tx.sender || "-",
      tx.receiver || "-",
      tx.quantity,
      tx.compartment ? `${tx.compartment.rack?.name} - ${tx.compartment.name}` : "-",
      tx.price || 0,
      tx.reference_note || "-"
    ]);

    downloadCSV("transaksi_part.csv", columns, data);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
