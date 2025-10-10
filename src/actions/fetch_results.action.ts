"use server"

import { createClient } from "@/utils/supabase/server";

export type ResultItem = {
  id: string;
  title: string;
  description?: string;
  academic_session: string;
  semester: string,
  level: '100' | '200' | '300' | '400' | '500';
  course_code?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type FetchResultsParams = {
  level?: string;
  search?: string;
  semester?: string;
  academic_session?: string;
  is_published?: boolean;
  limit?: number;
  offset?: number;
}

export type FetchResultsResponse = {
  success: boolean;
  data?: ResultItem[];
  count?: number;
  error?: string;
}

export async function fetchResultsAction(params: FetchResultsParams = {}): Promise<FetchResultsResponse> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('results')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (params.level) {
      query = query.eq('level', params.level)
    }

    if (params.semester) {
      query = query.eq('semester', params.semester)
    }

    if (params.academic_session) {
      query = query.eq('academic_session', params.academic_session)
    }

    if (params.is_published !== undefined) {
      query = query.eq('is_published', params.is_published)
    }

    // Apply search filter
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.trim()
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,course_code.ilike.%${searchTerm}%`)
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
      console.error('Fetch results error:', error)
      return {
        success: false,
        error: `Failed to fetch results: ${error.message}`
      }
    }

    return {
      success: true,
      data: data as ResultItem[],
      count: count || 0
    }

  } catch (error) {
    console.error('Fetch results error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}





export type GroupedResult = {
  level: string;
  first_semester?: ResultItem;
  second_semester?: ResultItem;
}

export type FetchCurrentSessionResultsResponse = {
  success: boolean;
  data?: GroupedResult[];
  count?: number;
  error?: string;
}

const CURRENT_SESSION = "2024-2025";

export async function fetchCurrentSessionResults(): Promise<FetchCurrentSessionResultsResponse> {
    try {
        const supabase = await createClient()

        const { data, error, count } = await supabase
        .from('results')
        .select('*')
        .eq('academic_session', CURRENT_SESSION)
        .eq('is_published', true)
        .order('level', { ascending: true })
        .order('semester', { ascending: true })

        if (error) {
            console.error('Fetch current session results error:', error)
            return {
                success: false,
                error: `Failed to fetch current session results: ${error.message}`
            }
        }

        // Group results by level and semester
        const groupedResults = groupResultsByLevel(data as ResultItem[])

        return {
            success: true,
            data: groupedResults,
            count: count || 0
        }

    } catch (error) {
        console.error('Fetch current session results error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

function groupResultsByLevel(results: ResultItem[]): GroupedResult[] {
    const levels = ['100', '200', '300', '400', '500'];
    const groupedResults: GroupedResult[] = [];

    levels.forEach(level => {
        const levelResults = results.filter(result => result.level === level)
        
        if (levelResults.length > 0) {
            const firstSemester = levelResults.find(result => 
                result.semester.toLowerCase() === 'first'
            )
            const secondSemester = levelResults.find(result => 
                result.semester.toLowerCase() === 'second'
            )

            groupedResults.push({
                level,
                first_semester: firstSemester,
                second_semester: secondSemester
            })
        }
    })

    return groupedResults;
}