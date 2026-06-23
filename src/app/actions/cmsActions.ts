"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateCMSSection(sectionKey: string, contentData: any) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Update or insert CMS data
  const { error } = await supabase
    .from('cms_content')
    .upsert({
      section_key: sectionKey,
      content_data: contentData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'section_key'
    });

  if (error) {
    console.error("Error updating CMS:", error);
    throw new Error('Gagal menyimpan data konten.');
  }

  // Revalidate public homepage cache so changes reflect instantly
  revalidatePath('/');
  return { success: true };
}
