'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { Timetable, Semester, Level } from '@/types';
import { uploadTimetableFile } from './media_upload.action';

interface CreateTimetableResponse {
  success: boolean;
  data?: Timetable;
  error?: string;
}

export async function createTimetable(formData: FormData): Promise<CreateTimetableResponse> {
  try {
    const supabase = await createClient()
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const academic_session = formData.get('academic_session') as string;
    const semester = formData.get('semester') as Semester;
    const level = formData.get('level') as Level;
    const type = formData.get('type') as 'exam' | 'lecture';
    const is_published = formData.get('is_published') === 'true';

    if (!file || !title || !academic_session) {
      return {
        success: false,
        error: 'Missing required fields: file, title, and academic_session are required'
      }
    }

    const { data: existingTimetables, error: duplicateCheckError } = await supabase
      .from('timetables')
      .select('id, title')
      .eq('academic_session', academic_session)
      .eq('semester', semester)
      .eq('level', level)
      .eq('type', type);

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError);
      return {
        success: false,
        error: 'Failed to check for existing timetables'
      }
    }

    if (existingTimetables && existingTimetables.length > 0) {
      const duplicateTitle = existingTimetables[0].title;
      return {
        success: false,
        error: `A ${type} timetable already exists for ${academic_session} - ${semester} semester, ${level} level: "${duplicateTitle}". Please update the existing one or use a different combination.`
      }
    }


    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only PDF and image files are allowed.'
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      }
    }

    const { url: file_url, size: file_size } = await uploadTimetableFile(
      file,
      academic_session,
      semester,
      level,
    )

    const { data: timetable, error: dbError } = await supabase
      .from('timetables')
      .insert({
        title,
        description: description || null,
        academic_session,
        semester,
        level,
        type,
        file_url,
        file_name: file.name,
        file_size,
        is_published
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: `Failed to save timetable: ${dbError.message}`
      }
    }

    revalidatePath('/dpt-admin/timetables')
    revalidatePath('/timetables')

    return {
      success: true,
      data: timetable
    }

  } catch (error) {
    console.error('Create timetable error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateTimetable(
  id: string, 
  formData: FormData
): Promise<CreateTimetableResponse> {
  try {
    const supabase = await createClient()

    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const academic_session = formData.get('academic_session') as string;
    const semester = formData.get('semester') as Semester;
    const level = formData.get('level') as Level;
    const type = formData.get('type') as 'exam' | 'lecture';
    const is_published = formData.get('is_published') === 'true';

    if (!title || !academic_session) {
      return {
        success: false,
        error: 'Missing required fields: title and academic_session are required'
      }
    }

    let updateData: Partial<Timetable> = {
      title,
      description: description || undefined,
      academic_session,
      semester,
      level,
      type,
      is_published,
      updated_at: new Date().toISOString()
    }

    const { data: existingTimetables, error: duplicateCheckError } = await supabase
      .from('timetables')
      .select('id, title')
      .eq('academic_session', academic_session)
      .eq('semester', semester)
      .eq('level', level)
      .eq('type', type)
      .neq('id', id)

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError);
      return {
        success: false,
        error: 'Failed to check for existing timetables'
      }
    }

    if (existingTimetables && existingTimetables.length > 0) {
      const duplicateTitle = existingTimetables[0].title;
      return {
        success: false,
        error: `Another ${type} timetable already exists for ${academic_session} - ${semester} semester, ${level} level: "${duplicateTitle}". Please use a different combination.`
      }
    }


    if (file && file.size > 0) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Invalid file type. Only PDF and image files are allowed.'
        }
      }

      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size must be less than 10MB'
        }
      }

      const { url: file_url, size: file_size } = await uploadTimetableFile(
        file,
        academic_session,
        semester,
        level,
      )

      updateData = {
        ...updateData,
        file_url,
        file_name: file.name,
        file_size
      }
    }

    const { data: timetable, error: dbError } = await supabase
      .from('timetables')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: `Failed to update timetable: ${dbError.message}`
      }
    }

    revalidatePath('/dpt-admin/timetables')
    revalidatePath('/timetables')

    return {
      success: true,
      data: timetable
    }

  } catch (error) {
    console.error('Update timetable error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function deleteTimetable(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error: fetchError } = await supabase
      .from('timetables')
      .select('file_url, title')
      .eq('id', id)
      .single()

    if (fetchError) {
      return {
        success: false,
        error: `Failed to fetch timetable: ${fetchError.message}`
      }
    }

    const { error: deleteError } = await supabase
      .from('timetables')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete timetable: ${deleteError.message}`
      }
    }

    revalidatePath('/dpt-admin/timetables')
    revalidatePath('/timetables')

    return { success: true }

  } catch (error) {
    console.error('Delete timetable error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function toggleTimetablePublishStatus(
  id: string, 
  is_published: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('timetables')
      .update({ 
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return {
        success: false,
        error: `Failed to update publish status: ${error.message}`
      }
    }

    revalidatePath('/dpt-admin/timetables')
    revalidatePath('/timetables')

    return { success: true }

  } catch (error) {
    console.error('Toggle publish status error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function getTimetables(filters?: {
  academic_session?: string;
  semester?: Semester;
  level?: Level;
  type?: 'exam' | 'lecture';
  is_published?: boolean;
  search?: string;
}): Promise<{ data: Timetable[]; error?: string }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('timetables')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.academic_session) {
      query = query.eq('academic_session', filters.academic_session)
    }

    if (filters?.semester) {
      query = query.eq('semester', filters.semester)
    }

    if (filters?.level) {
      query = query.eq('level', filters.level)
    }

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.is_published !== undefined) {
      query = query.eq('is_published', filters.is_published)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: error.message
      }
    }

    return { data: data || [] }

  } catch (error) {
    console.error('Get timetables error:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function getTimetableById(id: string): Promise<{ data: Timetable | null; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return {
        data: null,
        error: error.message
      }
    }

    return { data }

  } catch (error) {
    console.error('Get timetable by ID error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}