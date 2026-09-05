"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type TransactionCategory = 
  | 'Beli untuk stock / PO' 
  | 'Sample masih bagus' 
  | 'Sample tidak oke' 
  | 'Kiriman PO' 
  | 'Kiriman Sample';

export async function createPartTransaction(data: {
  type: 'IN' | 'OUT';
  product_id: string;
  compartment_id: string;
  quantity: number;
  transaction_category: TransactionCategory;
  sender?: string;
  receiver?: string;
  price?: number;
  transaction_date: string;
  reference_note?: string;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Check current stock if OUTBOUND
  if (data.type === 'OUT') {
    const { data: placement } = await supabase
      .from('stock_placements')
      .select('quantity, id')
      .eq('product_id', data.product_id)
      .eq('compartment_id', data.compartment_id)
      .single();

    if (!placement || placement.quantity < data.quantity) {
      return { success: false, error: "Stok di kompartemen tersebut tidak mencukupi." };
    }

    // Deduct placement
    const newQty = placement.quantity - data.quantity;
    if (newQty > 0) {
      await supabase.from('stock_placements').update({ quantity: newQty }).eq('id', placement.id);
    } else {
      await supabase.from('stock_placements').delete().eq('id', placement.id);
    }

    // Deduct global product stock
    const { data: product } = await supabase.from('products').select('stock').eq('id', data.product_id).single();
    if (product) {
      await supabase.from('products').update({ stock: Math.max(0, (product.stock || 0) - data.quantity) }).eq('id', data.product_id);
    }
  } else {
    // INBOUND
    const { data: placement } = await supabase
      .from('stock_placements')
      .select('quantity, id')
      .eq('product_id', data.product_id)
      .eq('compartment_id', data.compartment_id)
      .single();

    if (placement) {
      await supabase.from('stock_placements').update({ quantity: placement.quantity + data.quantity }).eq('id', placement.id);
    } else {
      await supabase.from('stock_placements').insert([{
        product_id: data.product_id,
        compartment_id: data.compartment_id,
        quantity: data.quantity
      }]);
    }

    // Add to global product stock
    const { data: product } = await supabase.from('products').select('stock').eq('id', data.product_id).single();
    if (product) {
      await supabase.from('products').update({ stock: (product.stock || 0) + data.quantity }).eq('id', data.product_id);
    }
  }

  // 2. Insert into stock_movements (as transaction history)
  const { error: moveError } = await supabase.from('stock_movements').insert([{
    product_id: data.product_id,
    compartment_id: data.compartment_id,
    type: data.type,
    quantity: data.quantity,
    transaction_category: data.transaction_category,
    sender: data.sender || null,
    receiver: data.receiver || null,
    price: data.price || null,
    transaction_date: data.transaction_date,
    reference_note: data.reference_note || null
  }]);

  if (moveError) {
    console.error("Error creating transaction:", moveError);
    return { success: false, error: moveError.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/admin/warehouse');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function getTransactions() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('stock_movements')
    .select(`
      *,
      product:products(id, name, part_number),
      compartment:compartments(id, name, rack:racks(name))
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
  
  return data;
}

