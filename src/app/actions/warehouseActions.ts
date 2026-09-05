"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Types
export type Rack = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Compartment = {
  id: string;
  rack_id: string;
  name: string;
  max_capacity: number | null;
  created_at: string;
};

export type StockPlacement = {
  id: string;
  product_id: string;
  compartment_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    part_number: string;
    stock: number;
    image_url: string | null;
  } | null;
};

// --- RACKS ---

export async function getRacks() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('racks')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching racks:", error);
    return [];
  }

  return data as Rack[];
}

export async function getRackById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('racks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching rack:", error);
    return null;
  }

  return data as Rack;
}

export async function createRack(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) return { success: false, error: 'Nama rak wajib diisi' };

  const { error } = await supabase
    .from('racks')
    .insert([{ name, description }]);

  if (error) {
    console.error("Error creating rack:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/warehouse');
  return { success: true };
}

export async function updateRack(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) return { success: false, error: 'Nama rak wajib diisi' };

  const { error } = await supabase
    .from('racks')
    .update({ name, description })
    .eq('id', id);

  if (error) {
    console.error("Error updating rack:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/warehouse');
  return { success: true };
}

export async function deleteRack(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('racks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting rack:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/warehouse');
  return { success: true };
}

// --- COMPARTMENTS ---

export async function getCompartmentsByRackId(rackId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('compartments')
    .select('*')
    .eq('rack_id', rackId)
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching compartments:", error);
    return [];
  }

  return data as Compartment[];
}

export async function getAllCompartments() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('compartments')
    .select('id, name, rack:racks(name)')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching compartments:", error);
    return [];
  }

  return data;
}

export async function getAllStockPlacements() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('stock_placements')
    .select('id, product_id, compartment_id, quantity')
    .gt('quantity', 0);

  if (error) {
    console.error("Error fetching placements:", error);
    return [];
  }

  return data;
}

export async function getUnallocatedStock() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [productsRes, placementsRes] = await Promise.all([
    supabase.from('products').select('id, name, part_number, stock'),
    supabase.from('stock_placements').select('product_id, quantity')
  ]);

  if (productsRes.error || placementsRes.error) {
    console.error("Error fetching for unallocated stock");
    return [];
  }

  const placements = placementsRes.data || [];
  const products = productsRes.data || [];

  const unallocated = [];

  for (const p of products) {
    const totalInRacks = placements
      .filter(pl => pl.product_id === p.id)
      .reduce((sum, pl) => sum + pl.quantity, 0);
    
    if ((p.stock || 0) > totalInRacks) {
      unallocated.push({
        ...p,
        allocated: totalInRacks,
        unallocated: (p.stock || 0) - totalInRacks
      });
    }
  }

  return unallocated;
}

export async function createCompartment(rackId: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const name = formData.get('name') as string;
  const max_capacity_str = formData.get('max_capacity') as string;
  const max_capacity = max_capacity_str ? parseInt(max_capacity_str) : null;

  if (!name) return { success: false, error: 'Nama kompartemen wajib diisi' };

  const { error } = await supabase
    .from('compartments')
    .insert([{ rack_id: rackId, name, max_capacity }]);

  if (error) {
    console.error("Error creating compartment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

export async function updateCompartment(id: string, rackId: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const name = formData.get('name') as string;
  const max_capacity_str = formData.get('max_capacity') as string;
  const max_capacity = max_capacity_str ? parseInt(max_capacity_str) : null;

  if (!name) return { success: false, error: 'Nama kompartemen wajib diisi' };

  const { error } = await supabase
    .from('compartments')
    .update({ name, max_capacity })
    .eq('id', id);

  if (error) {
    console.error("Error updating compartment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

export async function deleteCompartment(id: string, rackId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('compartments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting compartment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

// --- STOCK PLACEMENTS ---

export async function getPlacementsByCompartment(compartmentId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('stock_placements')
    .select(`
      *,
      product:products ( id, name, part_number, stock, image_url )
    `)
    .eq('compartment_id', compartmentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching stock placements:", error);
    return [];
  }

  return data as StockPlacement[];
}

export async function addStockToCompartment(compartmentId: string, productId: string, quantity: number, rackId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!productId || quantity <= 0) return { success: false, error: 'Produk dan kuantitas (minimal 1) wajib diisi' };

  // Check if placement already exists
  const { data: existing } = await supabase
    .from('stock_placements')
    .select('id, quantity')
    .eq('compartment_id', compartmentId)
    .eq('product_id', productId)
    .single();

  let error;
  if (existing) {
    // Update existing quantity
    const { error: updateError } = await supabase
      .from('stock_placements')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
    error = updateError;
  } else {
    // Insert new placement
    const { error: insertError } = await supabase
      .from('stock_placements')
      .insert([{ compartment_id: compartmentId, product_id: productId, quantity }]);
    error = insertError;
  }

  if (error) {
    console.error("Error adding stock:", error);
    return { success: false, error: error.message };
  }

  // Log movement
  await supabase.from('stock_movements').insert([{
    product_id: productId,
    compartment_id: compartmentId,
    type: 'IN',
    quantity: quantity,
    reference_note: 'Goods-In (Added via Web UI)'
  }]);

  // Update main catalog stock
  const { data: product } = await supabase.from('products').select('stock').eq('id', productId).single();
  if (product) {
    await supabase.from('products').update({ stock: (product.stock || 0) + quantity }).eq('id', productId);
  }

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

export async function allocateUnallocatedStock(productId: string, compartmentId: string, quantity: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!productId || !compartmentId || quantity <= 0) {
    return { success: false, error: 'Produk, kompartemen, dan kuantitas wajib diisi' };
  }

  // Check if placement already exists
  const { data: existing } = await supabase
    .from('stock_placements')
    .select('id, quantity')
    .eq('compartment_id', compartmentId)
    .eq('product_id', productId)
    .single();

  let error;
  if (existing) {
    // Update existing quantity
    const { error: updateError } = await supabase
      .from('stock_placements')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
    error = updateError;
  } else {
    // Insert new placement
    const { error: insertError } = await supabase
      .from('stock_placements')
      .insert([{ compartment_id: compartmentId, product_id: productId, quantity }]);
    error = insertError;
  }

  if (error) {
    console.error("Error allocating stock:", error);
    return { success: false, error: error.message };
  }

  // Log movement
  await supabase.from('stock_movements').insert([{
    product_id: productId,
    compartment_id: compartmentId,
    type: 'IN', // Still an IN movement for the compartment
    quantity: quantity,
    reference_note: 'Allocation (from floating stock)'
  }]);

  // Notice: We deliberately do NOT update the main products.stock here,
  // because the stock is already in the catalog (it was just floating).

  revalidatePath(`/admin/warehouse`);
  return { success: true };
}

export async function removeStockFromCompartment(placementId: string, rackId: string, quantityToRemove?: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch placement first to know product_id, compartment_id, and current quantity
  const { data: placement, error: fetchError } = await supabase
    .from('stock_placements')
    .select('*')
    .eq('id', placementId)
    .single();

  if (fetchError || !placement) {
    console.error("Error fetching placement:", fetchError);
    return { success: false, error: 'Data penempatan tidak ditemukan' };
  }

  let error;
  let finalQtyToRemove = quantityToRemove ?? placement.quantity;

  if (quantityToRemove && quantityToRemove > 0 && quantityToRemove < placement.quantity) {
    // Partial removal
    const { error: updateError } = await supabase
      .from('stock_placements')
      .update({ quantity: placement.quantity - quantityToRemove })
      .eq('id', placementId);
    error = updateError;
  } else {
    // Full removal
    finalQtyToRemove = placement.quantity; // We are removing all of it
    const { error: deleteError } = await supabase
      .from('stock_placements')
      .delete()
      .eq('id', placementId);
    error = deleteError;
  }

  if (error) {
    console.error("Error removing stock placement:", error);
    return { success: false, error: error.message };
  }

  // Log movement
  await supabase.from('stock_movements').insert([{
    product_id: placement.product_id,
    compartment_id: placement.compartment_id,
    type: 'OUT',
    quantity: finalQtyToRemove,
    reference_note: 'Goods-Out (Removed via Web UI)'
  }]);

  // Update main catalog stock
  const { data: product } = await supabase.from('products').select('stock').eq('id', placement.product_id).single();
  if (product) {
    await supabase.from('products').update({ stock: Math.max(0, (product.stock || 0) - finalQtyToRemove) }).eq('id', placement.product_id);
  }

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

export async function getAllProductsForDropdown() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, part_number, stock')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

// --- STOCK MOVEMENTS ---
export type StockMovement = {
  id: string;
  product_id: string;
  compartment_id: string | null;
  type: 'IN' | 'OUT';
  quantity: number;
  reference_note: string | null;
  transaction_category?: string;
  sender?: string;
  receiver?: string;
  price?: number;
  transaction_date?: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    part_number: string;
  } | null;
  compartment?: {
    id: string;
    name: string;
    rack?: {
      name: string;
    } | null;
  } | null;
};

export async function getStockMovements() {
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
    .limit(100);

  if (error) {
    console.error("Error fetching stock movements:", error);
    return [];
  }
  
  return data as StockMovement[];
}


export async function searchWarehouseItems(query: string, rackIdFilter?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let queryBuilder = supabase
    .from('stock_placements')
    .select(`
      id, quantity, updated_at,
      product:products!inner (id, name, part_number, image_url, category),
      compartment:compartments!inner (id, name, rack_id, rack:racks (id, name))
    `);

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,part_number.ilike.%${query}%`, { referencedTable: 'products' });
  }

  const { data, error } = await queryBuilder.order('updated_at', { ascending: false });

  if (error) {
    console.error("Error searching warehouse items:", error);
    return [];
  }

  // Filter in memory for rackId 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results = data as any[];
  if (rackIdFilter) {
    results = results.filter(item => item.compartment?.rack_id === rackIdFilter);
  }

  return results;
}