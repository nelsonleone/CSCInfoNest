"use server"

import { createClient } from "@/utils/supabase/server";
import type { Event } from "@/types";
import { revalidatePath } from "next/cache";

export type FetchEventsParams = {
  month?: string;
  is_published?: boolean;
  limit?: number;
  offset?: number;
}

export type FetchEventsResponse = {
  success: boolean;
  data?: Event[];
  count?: number;
  error?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export async function fetchEventsAction(params: FetchEventsParams = {}): Promise<FetchEventsResponse> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('date_time', { ascending: true })

    const startOfYear = `${CURRENT_YEAR}-01-01T00:00:00.000Z`;
    const endOfYear = `${CURRENT_YEAR}-12-31T23:59:59.999Z`;
    
    query = query
      .gte('date_time', startOfYear)
      .lte('date_time', endOfYear)

    if (params.month && params.month.trim()) {
      const monthValue = params.month.trim()
      
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(monthValue)) {
        return {
          success: false,
          error: 'Invalid month format. Use YYYY-MM format (e.g., 2025-01)'
        }
      }

      const [year, month] = monthValue.split('-')
      
      if (parseInt(year) !== CURRENT_YEAR) {
        return {
          success: false,
          error: `Only events from ${CURRENT_YEAR} can be fetched`
        }
      }

      const startOfMonth = `${year}-${month}-01T00:00:00.000Z`;
      const nextMonth = parseInt(month) === 12 ? '01' : String(parseInt(month) + 1).padStart(2, '0');
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endOfMonth = `${nextYear}-${nextMonth}-01T00:00:00.000Z`;

      query = query
        .gte('date_time', startOfMonth)
        .lt('date_time', endOfMonth)
    }

    if (params.is_published !== undefined) {
      query = query.eq('is_published', params.is_published)
    } else {
      query = query.eq('is_published', true)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Fetch events error:', error)
      return {
        success: false,
        error: `Failed to fetch events: ${error.message}`
      }
    }

    return {
      success: true,
      data: data as Event[],
      count: count || 0
    }

  } catch (error) {
    console.error('Fetch events error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}




export type FetchSingleEventResponse = {
  success: boolean;
  data?: Event;
  error?: string;
}

export async function fetchSingleEventAction(eventId: string): Promise<FetchSingleEventResponse> {
  try {
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      return {
        success: false,
        error: 'Invalid event ID provided'
      }
    }

    const supabase = await createClient()
   
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId.trim())
      .single()

    if (error) {
      console.error('[FetchSingleEvent] Database error:', error)
      
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'Event not found'
        }
      }
      
      return {
        success: false,
        error: `Failed to fetch event: ${error.message}`
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Event not found'
      }
    }

    return {
      success: true,
      data: data as Event
    }
    
  } catch (error) {
    console.error('[FetchSingleEvent] Unexpected error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      eventId
    })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while fetching the event'
    }
  }
}



export async function getAvailableMonths(): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const supabase = await createClient()
    
    const startOfYear = `${CURRENT_YEAR}-01-01T00:00:00.000Z`;
    const endOfYear = `${CURRENT_YEAR}-12-31T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('events')
      .select('date_time')
      .eq('is_published', true)
      .gte('date_time', startOfYear)
      .lte('date_time', endOfYear)
      .order('date_time', { ascending: true })

    if (error) {
      console.error('Get available months error:', error)
      return {
        success: false,
        error: `Failed to get available months: ${error.message}`
      }
    }

    const months = new Set<string>()
    data?.forEach(event => {
      const eventDate = new Date(event.date_time);
      const month = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
      months.add(month)
    })

    return {
      success: true,
      data: Array.from(months).sort()
    }

  } catch (error) {
    console.error('Get available months error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}




type DeleteEventResponse = {
  success: boolean;
  error?: string;
}

export async function deleteEventAction(eventId: string): Promise<DeleteEventResponse> {
  try {
    // Validate event ID
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      return {
        success: false,
        error: 'Invalid event ID provided'
      };
    }

    const supabase = await createClient();

    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', eventId.trim())
      .single();

    if (fetchError) {
      console.error('Fetch event error:', fetchError);
      
      if (fetchError.code === 'PGRST116') {
        return {
          success: false,
          error: 'Event not found'
        };
      }
      
      return {
        success: false,
        error: `Failed to verify event: ${fetchError.message}`
      };
    }

    if (!existingEvent) {
      return {
        success: false,
        error: 'Event not found'
      };
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId.trim());

    if (deleteError) {
      console.error('Delete event error:', deleteError);
      return {
        success: false,
        error: `Failed to delete event: ${deleteError.message}`
      };
    }

    revalidatePath('/events');
    revalidatePath('/dpt-admin/events');

    return {
      success: true
    };
    
  } catch (error) {
    console.error('Delete event error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the event'
    };
  }
}