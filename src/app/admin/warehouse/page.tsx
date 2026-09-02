import { getRacks } from '@/app/actions/warehouseActions';
import Link from 'next/link';
import { Plus, Warehouse, Edit } from 'lucide-react';
import DeleteRackButton from '@/components/admin/warehouse/DeleteRackButton';

export const metadata = {
  title: 'Manajemen Rak Gudang - ADIE ERP',
};

export default async function WarehousePage() {
  const racks = await getRacks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lokasi Gudang</h1>
          <p className="text-gray-500 mt-1">Kelola daftar rak dan kompartemen penyimpanan Anda.</p>
        </div>
        <Link 
          href="/admin/warehouse/racks/new"
          className="bg-brand-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Rak
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {racks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Warehouse className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada Rak</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Anda belum menambahkan rak penyimpanan. Tambahkan rak pertama Anda untuk mulai mengatur lokasi barang.
            </p>
            <Link 
              href="/admin/warehouse/racks/new"
              className="mt-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Rak
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Nama Rak</th>
                  <th scope="col" className="px-6 py-4 font-medium">Deskripsi</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {racks.map((rack) => (
                  <tr key={rack.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/warehouse/racks/${rack.id}`} className="font-semibold text-gray-900 hover:text-brand-primary">
                        {rack.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {rack.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/warehouse/racks/${rack.id}`}
                          className="px-3 py-1.5 text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-md text-xs font-medium transition-colors"
                        >
                          Lihat Kompartemen
                        </Link>
                        <Link 
                          href={`/admin/warehouse/racks/${rack.id}/edit`}
                          className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                          title="Edit Rak"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteRackButton id={rack.id} />
                      </div>
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
