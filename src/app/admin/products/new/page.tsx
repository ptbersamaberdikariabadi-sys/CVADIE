import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch categories from CMS
  const { data: cmsData } = await supabase.from('cms_content').select('content_data').eq('section_key', 'services').single();
  const services = cmsData?.content_data?.items || [];
  const cmsCategories = services.map((s: { title: string }) => s.title);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tambah Produk</h2>
        </div>
      </div>
      
      <Suspense fallback={<div className="p-4 text-center text-gray-500">Memuat formulir...</div>}>
        <ProductForm cmsCategories={cmsCategories} />
      </Suspense>
    </div>
  );
}
