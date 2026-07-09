import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductActions from '@/components/admin/ProductActions';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Katalog Produk</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola data master peralatan industri.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-brand-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">SKU / Part Number</th>
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Merek</th>
                <th className="p-4 text-center">Stok</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {product.part_number}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <div className="relative w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs text-gray-400">
                            No img
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.pdf_datasheet_url && (
                            <a href={product.pdf_datasheet_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                              Lihat Datasheet PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.category}
                      {product.sub_category && (
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {product.sub_category}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.brand}
                    </td>
                    <td className="p-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 
                        product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <ProductActions productId={product.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Belum ada produk. Silakan tambah produk baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
