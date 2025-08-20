'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { Result, Semester, Level } from '@/types';
import { uploadResultFile } from './media_upload.action';



interface CreateResultResponse {
  success: boolean;
  data?: Result;
  error?: string;
}

export async function createResult(formData: FormData): Promise<CreateResultResponse> {
  try {
    const supabase = await createClient();

    // Extract form data
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const academic_session = formData.get('academic_session') as string;
    const semester = formData.get('semester') as Semester;
    const level = formData.get('level') as Level;
    const course_code = formData.get('course_code') as string;
    const is_published = formData.get('is_published') === 'true';

    // Validate required fields
    if (!file || !title || !academic_session) {
      return {
        success: false,
        error: 'Missing required fields: file, title, and academic_session are required'
      }
    }

    // Validate file type and size
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
        error: 'File size must be less than 5MB'
      }
    }

    // Upload file to Supabase Storage
    const { url: file_url, size: file_size } = await uploadResultFile(
      file,
      academic_session,
      semester,
      level
    )

    // Create result record in database
    const { data: result, error: dbError } = await supabase
      .from('results')
      .insert({
        title,
        description: description || null,
        academic_session,
        semester,
        level,
        course_code: course_code || null,
        file_url,
        file_name: file.name,
        file_size,
        is_published
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        success: false,
        error: `Failed to save result: ${dbError.message}`
      }
    }

    revalidatePath('/dpt-admin/results')

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Create result error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateResult(
  id: string, 
  formData: FormData
): Promise<CreateResultResponse> {
  try {
    const supabase = await createClient();

    // Extract form data
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const academic_session = formData.get('academic_session') as string;
    const semester = formData.get('semester') as Semester;
    const level = formData.get('level') as Level;
    const course_code = formData.get('course_code') as string;
    const is_published = formData.get('is_published') === 'true';

    // Validate required fields
    if (!title || !academic_session) {
      return {
        success: false,
        error: 'Missing required fields: title and academic_session are required'
      }
    }

    // Prepare update data
    let updateData: any = {
      title,
      description: description || null,
      academic_session,
      semester,
      level,
      course_code: course_code || null,
      is_published,
      updated_at: new Date().toISOString()
    }

    // Handle file upload if new file is provided
    if (file && file.size > 0) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Invalid file type. Only PDF and image files are allowed.'
        }
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return {
          success: false,
          error: 'File size must be less than 10MB'
        }
      }

      // Upload new file
      const { url: file_url, size: file_size } = await uploadResultFile(
        file,
        academic_session,
        semester,
        level
      );

      updateData = {
        ...updateData,
        file_url,
        file_name: file.name,
        file_size
      }
    }

    // Update result record in database
    const { data: result, error: dbError } = await supabase
      .from('results')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        success: false,
        error: `Failed to update result: ${dbError.message}`
      }
    }

    // Revalidate relevant paths
    revalidatePath('/admin/results');
    revalidatePath('/results');

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Update result error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function deleteResult(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error: fetchError } = await supabase
      .from('results')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: `Failed to fetch result: ${fetchError.message}`
      }
    }

    // Delete the result record
    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete result: ${deleteError.message}`
      }
    }

    revalidatePath('/dpt-admin/results')

    return { success: true }

  } catch (error) {
    console.error('Delete result error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function toggleResultPublishStatus(
  id: string, 
  is_published: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
        .from('results')
        .update({ 
            is_published,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

        if (error) {
        return {
            success: false,
            error: `Failed to update publish status: ${error.message}`
        }
        }

        // Revalidate relevant paths
        revalidatePath('/admin/results');
        revalidatePath('/results');

        return { success: true }

    } catch (error) {
        console.error('Toggle publish status error:', error);
        return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
    }

    export async function getResults(filters?: {
    academic_session?: string;
    semester?: Semester;
    level?: Level;
    is_published?: boolean;
    search?: string;
    }): Promise<{ data: Result[]; error?: string }> {
    try {
        const supabase = await createClient();

        let query = supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });

        // Apply filters
        if (filters?.academic_session) {
        query = query.eq('academic_session', filters.academic_session);
        }

        if (filters?.semester) {
        query = query.eq('semester', filters.semester);
        }

        if (filters?.level) {
        query = query.eq('level', filters.level);
        }

        if (filters?.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
        }

        if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,course_code.ilike.%${filters.search}%`);
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
        console.error('Get results error:', error);
        return {
        data: [],
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
    }

    export async function getResultById(id: string): Promise<{ data: Result | null; error?: string }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('id', id)
        .single();

        if (error) {
        return {
            data: null,
            error: error.message
        }
        }

        return { data }

    } catch (error) {
        console.error('Get result by ID error:', error);
        return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}