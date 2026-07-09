"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

interface FormData {
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

export async function submitRFQ(formData: FormData, cartItems: CartItem[]) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Insert ke database Supabase
    const { data: rfqData, error } = await supabase.from('rfq_requests').insert([
      {
        contact_person: formData.name,
        company_name: formData.company,
        email: formData.email,
        phone: formData.phone,
        urgency: formData.urgency,
        message: formData.message || (cartItems.length > 0 ? "Pengajuan dari RFQ Cart" : ""),
        status: 'RFQ_RECEIVED'
      }
    ]).select('id').single();

    if (error || !rfqData) {
      console.error("Gagal mengirim RFQ ke database:", error);
      return { success: false, error: 'Terjadi kesalahan saat menyimpan data RFQ.' };
    }

    // 2. Insert RFQ Items
    if (cartItems.length > 0) {
      const rfqItemsData = cartItems.map(item => ({
        rfq_id: rfqData.id,
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

    return { success: true, data: rfqData };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error submitting RFQ:", error);
    return { success: false, error: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}
