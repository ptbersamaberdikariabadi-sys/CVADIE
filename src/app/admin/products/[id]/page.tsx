import { getProductWithPlacements } from '@/app/actions/productActions';
import Link from 'next/link';
import { ArrowLeft, Box, MapPin, Edit } from 'lucide-react';
import Image from 'next/image';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductWithPlacements(id);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Produk tidak ditemukan</h2>
        <Link href="/admin/products" className="text-brand-primary hover:underline mt-4 inline-block">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Calculate total stock in placements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPlaced = product.placements.reduce((sum: number, p: any) => sum + p.quantity, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.part_number}</p>
          </div>
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Product Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square relative bg-gray-50">
              {product.image_url ? (
                <Image 
                  src={product.image_url} 
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Box className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm">Tidak ada gambar</span>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Stok</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total di Sistem:</span>
                  <span className="text-base font-bold text-gray-900">{product.stock} Unit</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-700">Total Dialokasikan (Rak):</span>
                  <span className="text-sm font-semibold text-brand-primary">{totalPlaced} Unit</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategori</h3>
                <p className="text-sm text-gray-900">
                  {product.category || '-'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Merek</h3>
                <p className="text-sm text-gray-900 font-medium">
                  {product.brand || '-'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Harga Dasar (Modal)</h3>
                <p className="text-sm text-gray-900 font-medium">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.base_price || 0)}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Harga Jual</h3>
                <p className="text-sm text-brand-primary font-bold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.selling_price || 0)}
                </p>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Deskripsi</h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Placements */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-primary" />
                Lokasi Penyimpanan
              </h3>
            </div>
            <div className="p-0">
              {product.placements.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>Barang ini belum ditaruh di rak/kompartemen manapun.</p>
                  <Link 
                    href="/admin/warehouse"
                    className="text-brand-primary hover:underline text-sm mt-2 inline-block"
                  >
                    Buka WMS untuk mengalokasikan
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="p-4">Lokasi (Rak & Kompartemen)</th>
                      <th className="p-4">Kuantitas</th>
                      <th className="p-4">Tgl Ditempatkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {product.placements.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Rak {p.compartment?.rack?.name || '?'}</span>
                            <span className="text-sm text-gray-500">Kompartemen: {p.compartment?.name || '?'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-blue-50 text-brand-primary border border-blue-100">
                            {p.quantity} Unit
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(p.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
