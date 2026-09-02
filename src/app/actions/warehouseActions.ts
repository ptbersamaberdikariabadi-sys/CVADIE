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

  revalidatePath(`/admin/warehouse/racks/${rackId}`);
  return { success: true };
}

export async function removeStockFromCompartment(placementId: string, rackId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('stock_placements')
    .delete()
    .eq('id', placementId);

  if (error) {
    console.error("Error removing stock placement:", error);
    return { success: false, error: error.message };
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