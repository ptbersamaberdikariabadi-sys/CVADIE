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

// ─── Helper: Revert the stock effect of a transaction ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function revertTransactionStock(supabase: any, tx: {
  type: string;
  product_id: string;
  compartment_id: string | null;
  quantity: number;
}) {
  // Reverting an IN means we subtract stock; reverting an OUT means we add stock back
  const isReverting_IN = tx.type === 'IN';
  const delta = isReverting_IN ? -tx.quantity : tx.quantity;

  if (tx.compartment_id) {
    const { data: placement } = await supabase
      .from('stock_placements')
      .select('quantity, id')
      .eq('product_id', tx.product_id)
      .eq('compartment_id', tx.compartment_id)
      .single();

    if (isReverting_IN) {
      // Remove stock from placement
      if (placement) {
        const newQty = placement.quantity + delta; // delta is negative
        if (newQty > 0) {
          await supabase.from('stock_placements').update({ quantity: newQty }).eq('id', placement.id);
        } else {
          await supabase.from('stock_placements').delete().eq('id', placement.id);
        }
      }
    } else {
      // Add stock back to placement (reverting an OUT)
      if (placement) {
        await supabase.from('stock_placements').update({ quantity: placement.quantity + tx.quantity }).eq('id', placement.id);
      } else {
        await supabase.from('stock_placements').insert([{
          product_id: tx.product_id,
          compartment_id: tx.compartment_id,
          quantity: tx.quantity
        }]);
      }
    }
  }

  // Update global product stock
  const { data: product } = await supabase.from('products').select('stock').eq('id', tx.product_id).single();
  if (product) {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    await supabase.from('products').update({ stock: newStock }).eq('id', tx.product_id);
  }
}

// ─── Helper: Apply the stock effect of a new/updated transaction ─────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function applyTransactionStock(supabase: any, data: {
  type: 'IN' | 'OUT';
  product_id: string;
  compartment_id: string;
  quantity: number;
}): Promise<{ success: boolean; error?: string }> {
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

    const newQty = placement.quantity - data.quantity;
    if (newQty > 0) {
      await supabase.from('stock_placements').update({ quantity: newQty }).eq('id', placement.id);
    } else {
      await supabase.from('stock_placements').delete().eq('id', placement.id);
    }

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

    const { data: product } = await supabase.from('products').select('stock').eq('id', data.product_id).single();
    if (product) {
      await supabase.from('products').update({ stock: (product.stock || 0) + data.quantity }).eq('id', data.product_id);
    }
  }
  return { success: true };
}

// ─── CREATE ──────────────────────────────────────────────────────────────────
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const stockResult = await applyTransactionStock(supabase, {
    type: data.type,
    product_id: data.product_id,
    compartment_id: data.compartment_id,
    quantity: data.quantity,
  });

  if (!stockResult.success) return stockResult;

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

// ─── UPDATE (Full Edit with stock revert + re-apply) ─────────────────────────
export async function updatePartTransaction(id: string, data: {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Fetch the existing transaction to know what to revert
  const { data: existing, error: fetchErr } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    return { success: false, error: 'Transaksi tidak ditemukan.' };
  }

  // 2. Revert the old stock effect
  await revertTransactionStock(supabase, {
    type: existing.type,
    product_id: existing.product_id,
    compartment_id: existing.compartment_id,
    quantity: existing.quantity,
  });

  // 3. Apply the new stock effect
  const stockResult = await applyTransactionStock(supabase, {
    type: data.type,
    product_id: data.product_id,
    compartment_id: data.compartment_id,
    quantity: data.quantity,
  });

  if (!stockResult.success) {
    // Roll back: re-apply old stock to restore consistency
    await applyTransactionStock(supabase, {
      type: existing.type,
      product_id: existing.product_id,
      compartment_id: existing.compartment_id,
      quantity: existing.quantity,
    });
    return stockResult;
  }

  // 4. Update the movement record
  const { error: updateError } = await supabase
    .from('stock_movements')
    .update({
      product_id: data.product_id,
      compartment_id: data.compartment_id,
      type: data.type,
      quantity: data.quantity,
      transaction_category: data.transaction_category,
      sender: data.sender || null,
      receiver: data.receiver || null,
      price: data.price || null,
      transaction_date: data.transaction_date,
      reference_note: data.reference_note || null,
    })
    .eq('id', id);

  if (updateError) {
    console.error("Error updating transaction:", updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/admin/warehouse');
  revalidatePath('/admin/products');
  return { success: true };
}

// ─── DELETE (with full stock revert) ─────────────────────────────────────────
export async function deletePartTransaction(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Fetch transaction to know what stock to revert
  const { data: existing, error: fetchErr } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    return { success: false, error: 'Transaksi tidak ditemukan.' };
  }

  // 2. Revert stock
  await revertTransactionStock(supabase, {
    type: existing.type,
    product_id: existing.product_id,
    compartment_id: existing.compartment_id,
    quantity: existing.quantity,
  });

  // 3. Delete the record
  const { error: deleteError } = await supabase
    .from('stock_movements')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error("Error deleting transaction:", deleteError);
    return { success: false, error: deleteError.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/admin/warehouse');
  revalidatePath('/admin/products');
  return { success: true };
}

// ─── READ ─────────────────────────────────────────────────────────────────────
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
    .not('transaction_category', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching transactions:", JSON.stringify(error, null, 2), error);
    return [];
  }
  
  return data;
}
