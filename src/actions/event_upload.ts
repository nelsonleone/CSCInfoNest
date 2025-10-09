'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { Event } from '@/types';
import { uploadEventImage } from './media_upload.action';

interface CreateEventResponse {
  success: boolean;
  data?: Event;
  error?: string;
}

export async function createEvent(formData: FormData): Promise<CreateEventResponse> {
  try {
    const supabase = await createClient()

    // Extract form data
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date_time = formData.get('date_time') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const is_published = formData.get('is_published') === 'true';

    if (!title || !date_time || !location) {
      return {
        success: false,
        error: 'Missing required fields: title, date/time, and location are required'
      }
    }

    const eventDate = new Date(date_time)
    const now = new Date()
    if (eventDate < now) {
      return {
        success: false,
        error: 'Event date cannot be in the past'
      }
    }

    const { data: exactDuplicates, error: duplicateCheckError } = await supabase
      .from('events')
      .select('id, title')
      .eq('title', title)
      .eq('date_time', date_time)
      .eq('location', location)

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError)
      return {
        success: false,
        error: 'Failed to check for existing events'
      }
    }

    if (exactDuplicates && exactDuplicates.length > 0) {
      return {
        success: false,
        error: `An identical event already exists: "${exactDuplicates[0].title}" at the same time and location`
      }
    }

    let image_urls: string[] = [];

    if (image && image.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; 

      if (!allowedTypes.includes(image.type)) {
        return {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
        }
      }

      if (image.size > maxSize) {
        return {
          success: false,
          error: 'Image size must be less than 5MB'
        }
      }

      try {
        const uploadResult = await uploadEventImage(image)
        image_urls = [uploadResult.url];
      } catch (uploadError) {
        return {
          success: false,
          error: `Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`
        }
      }
    }

    const { data: event, error: dbError } = await supabase
      .from('events')
      .insert({
        title,
        description: description || null,
        date_time,
        location,
        category: category || null,
        image_urls,
        is_published
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: `Failed to save event: ${dbError.message}`
      }
    }

    revalidatePath('/dpt-admin/events')
    revalidatePath('/events')

    return {
      success: true,
      data: event
    }

  } catch (error) {
    console.error('Create event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<CreateEventResponse> {
  try {
    const supabase = await createClient()

    // Extract form data
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date_time = formData.get('date_time') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const is_published = formData.get('is_published') === 'true';
    const keep_existing_image = formData.get('keep_existing_image') === 'true';

    if (!title || !date_time || !location) {
      return {
        success: false,
        error: 'Missing required fields: title, date/time, and location are required'
      };
    }

    const eventDate = new Date(date_time)
    const now = new Date()
    if (eventDate < now) {
      return {
        success: false,
        error: 'Event date cannot be in the past'
      };
    }

    const { data: exactDuplicates, error: duplicateCheckError } = await supabase
      .from('events')
      .select('id, title')
      .eq('title', title)
      .eq('date_time', date_time)
      .eq('location', location)
      .neq('id', id)

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError)
      return {
        success: false,
        error: 'Failed to check for existing events'
      };
    }

    if (exactDuplicates && exactDuplicates.length > 0) {
      return {
        success: false,
        error: `An identical event already exists: "${exactDuplicates[0].title}" at the same time and location`
      };
    }

    let updateData: any = {
      title,
      description: description || null,
      date_time,
      location,
      category: category || null,
      is_published,
      updated_at: new Date().toISOString()
    };

    if (image && image.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(image.type)) {
        return {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
        };
      }

      if (image.size > maxSize) {
        return {
          success: false,
          error: 'Image size must be less than 5MB'
        };
      }

      try {
        const uploadResult = await uploadEventImage(image)
        updateData.image_urls = [uploadResult.url];
      } catch (uploadError) {
        return {
          success: false,
          error: `Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`
        };
      }
    } else if (!keep_existing_image) {
      updateData.image_urls = [];
    }

    const { data: event, error: dbError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: `Failed to update event: ${dbError.message}`
      };
    }

    revalidatePath('/dpt-admin/events')
    revalidatePath('/events')

    return {
      success: true,
      data: event
    }

  } catch (error) {
    console.error('Update event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('title, image_urls')
      .eq('id', id)
      .single()

    if (fetchError) {
      return {
        success: false,
        error: `Failed to fetch event: ${fetchError.message}`
      }
    }

    // Delete the event record
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete event: ${deleteError.message}`
      }
    }

    revalidatePath('/dpt-admin/events')
    revalidatePath('/events')

    return { success: true }

  } catch (error) {
    console.error('Delete event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}