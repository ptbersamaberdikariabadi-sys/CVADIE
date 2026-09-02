"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type ShipmentItemInput = {
  product_id: string;
  compartment_id: string;
  quantity: number;
  packing_quantity: number;
  notes: string;
};

export async function createShipment(data: {
  type: 'INBOUND' | 'OUTBOUND';
  partner_name: string;
  reference_number: string;
  notes: string;
  date: string;
  partner_address?: string;
  attention_person?: string;
  driver_name?: string;
  vehicle_number?: string;
  quotation_number?: string;
  po_code?: string;
  po_date?: string;
  items: ShipmentItemInput[];
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!data.partner_name || data.items.length === 0) {
    return { success: false, error: 'Nama partner dan minimal 1 item wajib diisi' };
  }

  // 1. Create Shipment
  const { data: shipment, error: shipmentError } = await supabase
    .from('shipments')
    .insert([{
      type: data.type,
      partner_name: data.partner_name,
      reference_number: data.reference_number,
      notes: data.notes,
      date: data.date || new Date().toISOString(),
      partner_address: data.partner_address,
      attention_person: data.attention_person,
      driver_name: data.driver_name,
      vehicle_number: data.vehicle_number,
      quotation_number: data.quotation_number,
      po_code: data.po_code,
      po_date: data.po_date
    }])
    .select('id')
    .single();

  if (shipmentError || !shipment) {
    console.error("Error creating shipment:", shipmentError);
    return { success: false, error: shipmentError?.message || 'Gagal membuat dokumen' };
  }

  // 2. Insert Items & Update Stocks
  for (const item of data.items) {
    // Insert shipment item
    await supabase.from('shipment_items').insert([{
      shipment_id: shipment.id,
      product_id: item.product_id,
      compartment_id: item.compartment_id,
      quantity: item.quantity,
      packing_quantity: item.packing_quantity,
      notes: item.notes
    }]);

    // Check existing placement
    const { data: existingPlacement } = await supabase
      .from('stock_placements')
      .select('id, quantity')
      .eq('compartment_id', item.compartment_id)
      .eq('product_id', item.product_id)
      .single();

    if (data.type === 'INBOUND') {
      // INBOUND Logic
      if (existingPlacement) {
        await supabase.from('stock_placements').update({ quantity: existingPlacement.quantity + item.quantity }).eq('id', existingPlacement.id);
      } else {
        await supabase.from('stock_placements').insert([{
          compartment_id: item.compartment_id,
          product_id: item.product_id,
          quantity: item.quantity
        }]);
      }
      // Update Catalog Stock
      const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
      if (product) {
        await supabase.from('products').update({ stock: (product.stock || 0) + item.quantity }).eq('id', item.product_id);
      }
      // Log Movement
      await supabase.from('stock_movements').insert([{
        product_id: item.product_id,
        compartment_id: item.compartment_id,
        type: 'IN',
        quantity: item.quantity,
        reference_note: `Terima Barang: ${data.reference_number || data.partner_name}`
      }]);

    } else {
      // OUTBOUND Logic
      if (!existingPlacement || existingPlacement.quantity < item.quantity) {
        // Warning: Outbound quantity exceeds what's in the compartment. We'll still allow it but it might go negative if we don't protect it, but the DB might have checks or we enforce it here.
        // For safety, cap it or throw error? Let's throw error to prevent invalid stock.
        return { success: false, error: `Stok tidak cukup di kompartemen untuk produk tertentu.` };
      }
      
      const newQty = existingPlacement.quantity - item.quantity;
      if (newQty === 0) {
        await supabase.from('stock_placements').delete().eq('id', existingPlacement.id);
      } else {
        await supabase.from('stock_placements').update({ quantity: newQty }).eq('id', existingPlacement.id);
      }
      
      // Update Catalog Stock
      const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
      if (product) {
        await supabase.from('products').update({ stock: Math.max(0, (product.stock || 0) - item.quantity) }).eq('id', item.product_id);
      }
      // Log Movement
      await supabase.from('stock_movements').insert([{
        product_id: item.product_id,
        compartment_id: item.compartment_id,
        type: 'OUT',
        quantity: item.quantity,
        reference_note: `Kirim Barang: ${data.reference_number || data.partner_name}`
      }]);
    }
  }

  revalidatePath('/admin/shipments');
  revalidatePath('/admin/warehouse');
  revalidatePath('/admin/warehouse/history');
  return { success: true, id: shipment.id };
}

export async function getShipments() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('shipments')
    .select(`
      *,
      shipment_items(id, quantity, product:products(name, part_number))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
  return data;
}

export async function getShipmentById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('shipments')
    .select(`
      *,
      shipment_items(
        id, 
        quantity, 
        packing_quantity,
        notes,
        product:products(name, part_number),
        compartment:compartments(name, rack:racks(name))
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching shipment:", error);
    return null;
  }
  return data;
}
