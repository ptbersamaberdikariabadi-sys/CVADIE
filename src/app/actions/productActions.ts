"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized — Anda harus login terlebih dahulu.' };
  }

  // Validate input
  if (!productId || typeof productId !== 'string') {
    return { success: false, error: 'ID produk tidak valid.' };
  }

  try {
    // Fetch product first to clean up storage files
    const { data: product } = await supabase
      .from('products')
      .select('image_url, pdf_datasheet_url')
      .eq('id', productId)
      .single();

    // Delete storage files if they exist
    if (product?.image_url) {
      const imagePath = product.image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage.from('product-images').remove([imagePath]);
      }
    }
    if (product?.pdf_datasheet_url) {
      const pdfPath = product.pdf_datasheet_url.split('/').pop();
      if (pdfPath) {
        await supabase.storage.from('pdf-datasheets').remove([pdfPath]);
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error("Gagal menghapus produk:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting product:", error);
    return { success: false, error: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}

export async function getProductWithPlacements(productId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError) {
    console.error("Error fetching product:", productError);
    return null;
  }

  // Fetch placements
  const { data: placements, error: placementsError } = await supabase
    .from('stock_placements')
    .select(`
      id, quantity, created_at, updated_at,
      compartment:compartments(id, name, rack_id, 
        rack:racks(id, name)
      )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (placementsError) {
    console.error("Error fetching product placements:", placementsError);
    // Still return product even if placements fail
  }

  return {
    ...product,
    placements: placements || []
  };
}
