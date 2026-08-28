"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface RFQFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  urgency: string;
  message: string;
}

interface CartItem {
  id: string;
  quantity: number;
}

export async function submitRFQ(formData: RFQFormData, cartItems: CartItem[]) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Input validation
  const name = formData.name?.trim();
  const company = formData.company?.trim();
  const email = formData.email?.trim().toLowerCase();
  const phone = formData.phone?.trim();
  const urgency = formData.urgency?.trim();
  const message = formData.message?.trim();

  if (!name || name.length < 2 || name.length > 200) {
    return { success: false, error: 'Nama kontak harus antara 2-200 karakter.' };
  }
  if (!company || company.length < 2 || company.length > 200) {
    return { success: false, error: 'Nama perusahaan harus antara 2-200 karakter.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Format email tidak valid.' };
  }
  if (!phone || phone.length < 8 || phone.length > 20) {
    return { success: false, error: 'Nomor telepon harus antara 8-20 karakter.' };
  }
  if (message && message.length > 2000) {
    return { success: false, error: 'Pesan terlalu panjang (maksimal 2000 karakter).' };
  }

  try {
    // Generate UUID manually so we don't need to .select() which is blocked by RLS for public
    const rfqId = crypto.randomUUID();

    // 1. Insert ke database Supabase
    const { error } = await supabase.from('rfq_requests').insert([
      {
        id: rfqId,
        contact_person: name,
        company_name: company,
        email: email,
        phone: phone,
        urgency: urgency,
        message: message || (cartItems.length > 0 ? "Pengajuan dari RFQ Cart" : ""),
        status: 'RFQ_RECEIVED'
      }
    ]);


    if (error) {
      console.error("Gagal mengirim RFQ ke database:", error);
      return { success: false, error: error?.message || 'Terjadi kesalahan saat menyimpan data RFQ.' };
    }

    // 2. Insert RFQ Items
    if (cartItems.length > 0) {
      const rfqItemsData = cartItems.map(item => ({
        rfq_id: rfqId,
        product_id: item.id,
        quantity: item.quantity,
        notes: ''
      }));

      const { error: itemsError } = await supabase.from('rfq_items').insert(rfqItemsData);
      if (itemsError) {
        console.error("Gagal menyimpan item RFQ:", itemsError);
        // Tetap return success karena RFQ request utamanya sudah masuk
      }
    }

    return { success: true, data: { id: rfqId } };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error submitting RFQ:", error);
    return { success: false, error: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}

export async function deleteRFQ(rfqId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Auth guard — hanya admin yang bisa menghapus RFQ
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized — Anda harus login terlebih dahulu.' };
  }

  try {
    const { error } = await supabase.from('rfq_requests').delete().eq('id', rfqId);
    if (error) {
      console.error("Gagal menghapus RFQ:", error);
      return { success: false, error: error.message };
    }
    
    // Refresh Next.js server cache untuk halaman ini
    revalidatePath('/admin/rfq');
    
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error deleting RFQ:", error);
    return { success: false, error: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}
