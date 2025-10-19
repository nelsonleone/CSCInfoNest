"use server"

import { createClient } from "@/utils/supabase/server";

export type TimetableItem = {
  id: string;
  title: string;
  description?: string;
  academic_session: string;
  semester: string;
  level: '100' | '200' | '300' | '400' | '500';
  type: 'exam' | 'lecture';
  file_url: string;
  file_name: string;
  file_size: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type FetchTimetablesParams = {
  level?: string;
  search?: string;
  semester?: string;
  academic_session?: string;
  type?: 'exam' | 'lecture';
  is_published?: boolean;
  limit?: number;
  offset?: number;
}

export type FetchTimetablesResponse = {
  success: boolean;
  data?: TimetableItem[];
  count?: number;
  error?: string;
}

export async function fetchTimetablesAction(params: FetchTimetablesParams = {}): Promise<FetchTimetablesResponse> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('timetables')
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

    if (params.type) {
      query = query.eq('type', params.type)
    }

    if (params.is_published !== undefined) {
      query = query.eq('is_published', params.is_published)
    }

    // Apply search filter
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.trim()
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
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
      console.error('Fetch timetables error:', error)
      return {
        success: false,
        error: `Failed to fetch timetables: ${error.message}`
      }
    }

    return {
      success: true,
      data: data as TimetableItem[],
      count: count || 0
    }

  } catch (error) {
    console.error('Fetch timetables error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export type GroupedTimetable = {
  level: string;
  exam_first_semester?: TimetableItem;
  exam_second_semester?: TimetableItem;
  lecture_first_semester?: TimetableItem;
  lecture_second_semester?: TimetableItem;
}

export type FetchCurrentSessionTimetablesResponse = {
  success: boolean;
  data?: GroupedTimetable[];
  count?: number;
  error?: string;
}

const CURRENT_SESSION = "2024-2025";

export async function fetchCurrentSessionTimetables(): Promise<FetchCurrentSessionTimetablesResponse> {
    try {
        const supabase = await createClient()

        const { data, error, count } = await supabase
        .from('timetables')
        .select('*')
        .eq('academic_session', CURRENT_SESSION)
        .eq('is_published', true)
        .order('level', { ascending: true })
        .order('type', { ascending: true })
        .order('semester', { ascending: true })


        if (error) {
            console.error('Fetch current session timetables error:', error)
            return {
                success: false,
                error: `Failed to fetch current session timetables: ${error.message}`
            }
        }

        // Group timetables by level, type, and semester
        const groupedTimetables = groupTimetablesByLevel(data as TimetableItem[])

        return {
            success: true,
            data: groupedTimetables,
            count: count || 0
        }

    } catch (error) {
        console.error('Fetch current session timetables error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

function groupTimetablesByLevel(timetables: TimetableItem[]): GroupedTimetable[] {
    const levels = ['100', '200', '300', '400', '500'];
    const groupedTimetables: GroupedTimetable[] = [];

    levels.forEach(level => {
        const levelTimetables = timetables.filter(timetable => timetable.level === level)
        
        if (levelTimetables.length > 0) {
            const examFirstSemester = levelTimetables.find(timetable => 
                timetable.type === 'exam' && timetable.semester.toLowerCase() === 'first'
            )
            const examSecondSemester = levelTimetables.find(timetable => 
                timetable.type === 'exam' && timetable.semester.toLowerCase() === 'second'
            )
            const lectureFirstSemester = levelTimetables.find(timetable => 
                timetable.type === 'lecture' && timetable.semester.toLowerCase() === 'first'
            )
            const lectureSecondSemester = levelTimetables.find(timetable => 
                timetable.type === 'lecture' && timetable.semester.toLowerCase() === 'second'
            )

            groupedTimetables.push({
                level,
                exam_first_semester: examFirstSemester,
                exam_second_semester: examSecondSemester,
                lecture_first_semester: lectureFirstSemester,
                lecture_second_semester: lectureSecondSemester
            })
        }
    })

    return groupedTimetables;
}