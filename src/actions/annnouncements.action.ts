"use server"

import { createClient } from "@/utils/supabase/server";
import type { Announcement } from "@/types";
import { revalidatePath } from "next/cache";

export type FetchAnnouncementsParams = {
    priority?: 'low' | 'medium' | 'high';
    target_audience?: string;
    is_published?: boolean;
    include_expired?: boolean;
    limit?: number;
    offset?: number;
}

export type FetchAnnouncementsResponse = {
    success: boolean;
    data?: Announcement[];
    count?: number;
    error?: string;
}

export async function fetchAnnouncementsAction(params: FetchAnnouncementsParams = {}): Promise<FetchAnnouncementsResponse> {
    try {
        const supabase = await createClient();
        
        let query = supabase
            .from('announcements')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (params.priority) {
            query = query.eq('priority', params.priority);
        }

        if (params.target_audience) {
            query = query.eq('target_audience', params.target_audience);
        }

        if (params.is_published !== undefined) {
            query = query.eq('is_published', params.is_published);
        } else {
            query = query.eq('is_published', true);
        }

        if (!params.include_expired) {
            const now = new Date().toISOString();
            query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
        }

        if (params.limit) {
            query = query.limit(params.limit);
        }

        if (params.offset) {
            query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Fetch announcements error:', error);
            return {
                success: false,
                error: `Failed to fetch announcements: ${error.message}`
            }
        }

        return {
            success: true,
            data: data as Announcement[],
            count: count || 0
        }

    } catch (error) {
        console.error('Fetch announcements error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export type FetchSingleAnnouncementResponse = {
    success: boolean;
    data?: Announcement;
    error?: string;
}

export async function fetchSingleAnnouncementAction(announcementId: string): Promise<FetchSingleAnnouncementResponse> {
    try {
        if (!announcementId || typeof announcementId !== 'string' || announcementId.trim() === '') {
            return {
                success: false,
                error: 'Invalid announcement ID provided'
            }
        }

        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('id', announcementId.trim())
            .single();

        if (error) {
            console.error('[FetchSingleAnnouncement] Database error:', error);
            
            if (error.code === 'PGRST116') {
                return {
                    success: false,
                    error: 'Announcement not found'
                }
            }
            
            return {
                success: false,
                error: `Failed to fetch announcement: ${error.message}`
            }
        }

        if (!data) {
            return {
                success: false,
                error: 'Announcement not found'
            }
        }

        return {
            success: true,
            data: data as Announcement
        }
        
    } catch (error) {
        console.error('[FetchSingleAnnouncement] Unexpected error:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            announcementId
        });
        
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred while fetching the announcement'
        }
    }
}

export type CreateAnnouncementResponse = {
    success: boolean;
    data?: Announcement;
    error?: string;
}

export async function createAnnouncement(announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<CreateAnnouncementResponse> {
    try {
        if (!announcementData.title || announcementData.title.trim() === '') {
            return {
                success: false,
                error: 'Title is required'
            }
        }

        if (!announcementData.content || announcementData.content.trim() === '') {
            return {
                success: false,
                error: 'Content is required'
            }
        }

        const supabase = await createClient();

        const insertData = {
            title: announcementData.title.trim(),
            content: announcementData.content.trim(),
            priority: announcementData.priority || 'medium',
            target_audience: announcementData.target_audience?.trim() || null,
            expires_at: announcementData.expires_at || null,
            is_published: announcementData.is_published ?? false
        }

        const { data, error } = await supabase
            .from('announcements')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('Create announcement error:', error);
            return {
                success: false,
                error: `Failed to create announcement: ${error.message}`
            }
        }

        revalidatePath('/announcements');
        revalidatePath('/dpt-admin/announcements');

        return {
            success: true,
            data: data as Announcement
        }

    } catch (error) {
        console.error('Create announcement error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export type UpdateAnnouncementResponse = {
    success: boolean;
    data?: Announcement;
    error?: string;
}

export async function updateAnnouncement(announcementId: string, announcementData: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>): Promise<UpdateAnnouncementResponse> {
    try {
        if (!announcementId || typeof announcementId !== 'string' || announcementId.trim() === '') {
            return {
                success: false,
                error: 'Invalid announcement ID provided'
            }
        }

        const supabase = await createClient();

        const { data: existingAnnouncement, error: fetchError } = await supabase
            .from('announcements')
            .select('id')
            .eq('id', announcementId.trim())
            .single();

        if (fetchError || !existingAnnouncement) {
            return {
                success: false,
                error: 'Announcement not found'
            }
        }

        const updateData: any = {}

        if (announcementData.title !== undefined) {
            if (announcementData.title.trim() === '') {
                return {
                    success: false,
                    error: 'Title cannot be empty'
                }
            }
            updateData.title = announcementData.title.trim();
        }

        if (announcementData.content !== undefined) {
            if (announcementData.content.trim() === '') {
                return {
                    success: false,
                    error: 'Content cannot be empty'
                }
            }
            updateData.content = announcementData.content.trim();
        }

        if (announcementData.priority !== undefined) {
            updateData.priority = announcementData.priority;
        }

        if (announcementData.target_audience !== undefined) {
            updateData.target_audience = announcementData.target_audience?.trim() || null;
        }

        if (announcementData.expires_at !== undefined) {
            updateData.expires_at = announcementData.expires_at || null;
        }

        if (announcementData.is_published !== undefined) {
            updateData.is_published = announcementData.is_published;
        }

        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('announcements')
            .update(updateData)
            .eq('id', announcementId.trim())
            .select()
            .single();

        if (error) {
            console.error('Update announcement error:', error);
            return {
                success: false,
                error: `Failed to update announcement: ${error.message}`
            }
        }

        revalidatePath('/announcements');
        revalidatePath('/dpt-admin/announcements');

        return {
            success: true,
            data: data as Announcement
        }

    } catch (error) {
        console.error('Update announcement error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export type DeleteAnnouncementResponse = {
    success: boolean;
    error?: string;
}

export async function deleteAnnouncementAction(announcementId: string): Promise<DeleteAnnouncementResponse> {
    try {
        if (!announcementId || typeof announcementId !== 'string' || announcementId.trim() === '') {
            return {
                success: false,
                error: 'Invalid announcement ID provided'
            }
        }

        const supabase = await createClient();

        const { data: existingAnnouncement, error: fetchError } = await supabase
            .from('announcements')
            .select('id, title')
            .eq('id', announcementId.trim())
            .single();

        if (fetchError) {
            console.error('Fetch announcement error:', fetchError);
            
            if (fetchError.code === 'PGRST116') {
                return {
                    success: false,
                    error: 'Announcement not found'
                }
            }
            
            return {
                success: false,
                error: `Failed to verify announcement: ${fetchError.message}`
            }
        }

        if (!existingAnnouncement) {
            return {
                success: false,
                error: 'Announcement not found'
            }
        }

        const { error: deleteError } = await supabase
            .from('announcements')
            .delete()
            .eq('id', announcementId.trim());

        if (deleteError) {
            console.error('Delete announcement error:', deleteError);
            return {
                success: false,
                error: `Failed to delete announcement: ${deleteError.message}`
            }
        }

        revalidatePath('/announcements');
        revalidatePath('/dpt-admin/announcements');

        return {
            success: true
        }
        
    } catch (error) {
        console.error('Delete announcement error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the announcement'
        }
    }
}