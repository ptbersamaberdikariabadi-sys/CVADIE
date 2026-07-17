import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { id } = await params;
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch categories from CMS
  const { data: cmsData } = await supabase.from('cms_content').select('content_data').eq('section_key', 'services').single();
  const services = cmsData?.content_data?.items || [];
  const cmsCategories = services.map((s: any) => s.title);

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
          <h2 className="text-xl font-bold text-gray-900">Edit Produk</h2>
        </div>
      </div>
      
      <ProductForm initialData={product} cmsCategories={cmsCategories} />
    </div>
  );
}
