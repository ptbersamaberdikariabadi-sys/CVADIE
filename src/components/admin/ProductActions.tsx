"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini? Data tidak dapat dikembalikan.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Gagal menghapus produk.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link 
        href={`/admin/products/${productId}/edit`}
        className="p-2 text-gray-400 hover:text-brand-primary bg-gray-50 hover:bg-brand-primary/10 rounded-lg transition-colors inline-flex items-center" 
        title="Edit Produk"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center disabled:opacity-50" 
        title="Hapus Produk"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
