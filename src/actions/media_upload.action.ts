"use server"

import { createClient } from "@/utils/supabase/server";

export async function uploadEventImage(file: File): Promise<{ url: string; size: number }> {
  const supabase = await createClient();
  const fileName = file.name;
  const filePath = `${new Date().getFullYear()}/${new Date().toLocaleString('default', { month: 'long' }).toLowerCase()}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('events')
    .upload(filePath, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('events')
    .getPublicUrl(filePath);
  
  return {
    url: publicUrl,
    size: file.size
  }
}


export async function uploadResultFile(file: File, academic_session: string, semester: string, level: string): Promise<{url: string, size: number}> {

    const supabase = await createClient()
    const fileName = file.name;
    const filePath = `${academic_session}/${semester}-semester/${level}-level/${fileName}`;

    const { error } = await supabase.storage
        .from('results')
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('results')
        .getPublicUrl(filePath);

    return {
        url: publicUrl,
        size: file.size
    }
}

export async function uploadTimetableFile(file: File, academic_session: string, semester: string, level: string): Promise<{url: string, size: number}> {

    const supabase = await createClient()
    const fileName = file.name;
    const filePath = `${academic_session}/${semester}-semester/${level}-level/${fileName}`;

    const { error } = await supabase.storage
        .from('timetables')
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('timetables')
        .getPublicUrl(filePath);

    return {
        url: publicUrl,
        size: file.size
    }
}