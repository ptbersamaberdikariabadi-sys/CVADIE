import { getTransactions } from "@/app/actions/transactionActions";
import { Plus, ArrowDownRight, ArrowUpRight, Calendar, Package } from "lucide-react";
import Link from "next/link";
import ExportTransactionsButton from "@/components/admin/ExportTransactionsButton";
import { StockMovement } from "@/app/actions/warehouseActions";

export default async function TransactionsPage() {
  const transactions = await getTransactions() as StockMovement[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keluar/Masuk Part</h1>
          <p className="mt-1 text-sm text-gray-500">
            Catat dan pantau histori keluar masuk part di gudang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportTransactionsButton transactions={transactions} />
          <Link
            href="/admin/transactions/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Catat Transaksi
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Part / Produk</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Kompartemen</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {tx.type === 'IN' ? (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          IN
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          OUT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString('id-ID') : new Date(tx.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{tx.product?.name}</div>
                          <div className="text-xs text-gray-500">{tx.product?.part_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="font-medium">{tx.transaction_category || '-'}</div>
                      {tx.sender && <div className="text-xs text-gray-500">Dari: {tx.sender}</div>}
                      {tx.receiver && <div className="text-xs text-gray-500">Untuk: {tx.receiver}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{tx.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {tx.compartment ? (
                        `${tx.compartment.rack?.name} - ${tx.compartment.name}`
                      ) : (
                        <span className="text-gray-400 italic">Tanpa lokasi</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                      {tx.price && <div className="font-medium text-gray-900">Rp {tx.price.toLocaleString('id-ID')}</div>}
                      {tx.reference_note}
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
