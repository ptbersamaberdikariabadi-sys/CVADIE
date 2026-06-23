"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, UploadCloud, FileText } from 'lucide-react';

type ProductFormProps = {
  initialData?: any;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    part_number: initialData?.part_number || '',
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    category: initialData?.category || '',
    sub_category: initialData?.sub_category || '',
    description: initialData?.description || '',
    stock: initialData?.stock || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = initialData?.image_url || null;
      let pdfUrl = initialData?.pdf_datasheet_url || null;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'product-images');
      }

      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, 'pdf-datasheets');
      }

      const payload = {
        ...formData,
        stock: parseInt(formData.stock.toString()),
        image_url: imageUrl,
        pdf_datasheet_url: pdfUrl,
      };

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);
        if (insertError) throw insertError;
      }

      router.push('/admin/products');
      router.refresh(); // Refresh server component data
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{initialData ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <p className="text-sm text-gray-500 mt-1">Lengkapi informasi spesifikasi dan dokumen produk.</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">SKU / Part Number *</label>
            <input 
              type="text" 
              name="part_number" 
              required
              value={formData.part_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
              placeholder="Contoh: VLV-1029"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Produk *</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
              placeholder="Contoh: Gate Valve 2 Inch"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Merek *</label>
            <input 
              type="text" 
              name="brand" 
              required
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
              placeholder="Contoh: KITZ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Stok (Tersedia)</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kategori Utama *</label>
            <input 
              type="text" 
              name="category" 
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
              placeholder="Ketik Kategori (Contoh: Valve)"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sub-Kategori</label>
            <input 
              type="text" 
              name="sub_category" 
              value={formData.sub_category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
              placeholder="Ketik Sub-Kategori (Contoh: Gate Valve)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Deskripsi Produk</label>
          <textarea 
            name="description" 
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none resize-none"
            placeholder="Deskripsi singkat mengenai material, tekanan, dll."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Foto Produk</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">{imageFile ? imageFile.name : 'Pilih File Gambar'}</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
            </div>
            {initialData?.image_url && !imageFile && (
              <p className="text-xs text-blue-600">File saat ini: {initialData.image_url.split('/').pop()}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dokumen Datasheet (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">{pdfFile ? pdfFile.name : 'Pilih File Datasheet (PDF)'}</p>
              <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
            </div>
            {initialData?.pdf_datasheet_url && !pdfFile && (
              <p className="text-xs text-blue-600">File saat ini: {initialData.pdf_datasheet_url.split('/').pop()}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Produk</>
          )}
        </button>
      </div>
    </form>
  );
}
