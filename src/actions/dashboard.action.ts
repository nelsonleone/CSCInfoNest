import { ActivityItem } from "@/types";
import { formatTimeAgo } from "@/utils/helperFns/formatTime";
import { createClient } from "@/utils/supabase/server";


export const dashboardActions = {    

    async fetchDashboardStats() {
        const supabase = await createClient()
        try {
            // Get counts for all content types
            const [eventsData, announcementsData, resultsData, timetablesData] = await Promise.all([
                supabase.from('events').select('id, is_published', { count: 'exact' }),
                supabase.from('announcements').select('id, is_published', { count: 'exact' }),
                supabase.from('results').select('id, is_published', { count: 'exact' }),
                supabase.from('timetables').select('id, is_published', { count: 'exact' })
            ])

            // Calculate published vs total counts
            const stats = {
                totalEvents: eventsData.count || 0,
                totalAnnouncements: announcementsData.count || 0,
                totalResults: resultsData.count || 0,
                totalTimetables: timetablesData.count || 0,
                publishedEvents: eventsData.data?.filter(item => item.is_published).length || 0,
                publishedAnnouncements: announcementsData.data?.filter(item => item.is_published).length || 0,
                publishedResults: resultsData.data?.filter(item => item.is_published).length || 0,
                publishedTimetables: timetablesData.data?.filter(item => item.is_published).length || 0,
                activeSession: '2025/2026',
                recentUploads: 0, // Will calculate below
                totalViews: 0,
                activeUsers: 1,
                pendingApprovals: 0 // Will calculate below
            }

            // Calculate recent uploads (last 7 days)
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            
            const { count: recentUploads } = await supabase
                .from('results')
                .select('id', { count: 'exact' })
                .gte('created_at', sevenDaysAgo.toISOString())

            stats.recentUploads = recentUploads || 0;

            // Calculate pending approvals (unpublished content)
            const pendingEvents = eventsData.data?.filter(item => !item.is_published).length || 0;
            const pendingAnnouncements = announcementsData.data?.filter(item => !item.is_published).length || 0;
            const pendingResults = resultsData.data?.filter(item => !item.is_published).length || 0;
            const pendingTimetables = timetablesData.data?.filter(item => !item.is_published).length || 0;
            
            stats.pendingApprovals = pendingEvents + pendingAnnouncements + pendingResults + pendingTimetables;

            // Mock total views - you'll need to implement proper view tracking
            stats.totalViews = Math.floor(Math.random() * 10000) + 5000;

            return stats;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
            throw error;
        }
    },

    // Fetch recent activity across all content types
    async fetchRecentActivity() {
        try {
            const supabase = await createClient()
            const activities: ActivityItem[] = [];

            // Get recent events
            const { data: recentEvents } = await supabase
                .from('events')
                .select('id, title, created_at, updated_at, is_published')
                .order('updated_at', { ascending: false })
                .limit(5)

            // Get recent results
            const { data: recentResults } = await supabase
                .from('results')
                .select('id, title, created_at, updated_at, is_published, academic_session, level')
                .order('updated_at', { ascending: false })
                .limit(5)

            // Get recent announcements
            const { data: recentAnnouncements } = await supabase
                .from('announcements')
                .select('id, title, created_at, updated_at, is_published')
                .order('updated_at', { ascending: false })
                .limit(5) 

            // Get recent timetables
            const { data: recentTimetables } = await supabase
                .from('timetables')
                .select('id, title, created_at, updated_at, is_published, academic_session, level')
                .order('updated_at', { ascending: false })
                .limit(5)

            // Combine and format activities
            if (recentEvents) {
                recentEvents.forEach(event => {
                    activities.push({
                        id: `event-${event.id}`,
                        type: 'event',
                        title: event.title,
                        action: event.is_published ? 'published' : 'created',
                        time: formatTimeAgo(new Date(event.updated_at)),
                        timestamp: new Date(event.updated_at),
                        user: 'Admin',
                        status: event.is_published ? 'success' : 'warning'
                    })
                })
            }

            if (recentResults) {
                recentResults.forEach(result => {
                    activities.push({
                        id: `result-${result.id}`,
                        type: 'result',
                        title: `${result.title} - ${result.level} Level`,
                        action: result.is_published ? 'published' : 'uploaded',
                        time: formatTimeAgo(new Date(result.updated_at)),
                        timestamp: new Date(result.updated_at),
                        user: 'Admin',
                        status: result.is_published ? 'success' : 'info'
                    })
                })
            }

            if (recentAnnouncements) {
                recentAnnouncements.forEach(announcement => {
                    activities.push({
                        id: `announcement-${announcement.id}`,
                        type: 'announcement',
                        title: announcement.title,
                        action: announcement.is_published ? 'published' : 'created',
                        time: formatTimeAgo(new Date(announcement.updated_at)),
                        timestamp: new Date(announcement.updated_at),
                        user: 'Admin',
                        status: announcement.is_published ? 'success' : 'warning'
                    })
                })
            }

            if (recentTimetables) {
                recentTimetables.forEach(timetable => {
                    activities.push({
                        id: `timetable-${timetable.id}`,
                        type: 'timetable',
                        title: `${timetable.title} - ${timetable.level} Level`,
                        action: timetable.is_published ? 'published' : 'uploaded',
                        time: formatTimeAgo(new Date(timetable.updated_at)),
                        timestamp: new Date(timetable.updated_at),
                        user: 'Admin',
                        status: timetable.is_published ? 'success' : 'info'
                    })
                })
            }

            // Sort by timestamp and return top 20
            return activities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 20)

        } catch (error) {
            console.error('Error fetching recent activity:', error)
            throw error;
        }
    },

    // Fetch analytics data for charts
    async fetchAnalyticsData() {
        try {
            const supabase = await createClient()
            const currentYear = new Date().getFullYear()
            const monthlyData = [];

            for (let month = 0; month < 12; month++) {
                const startDate = new Date(currentYear, month, 1)
                const endDate = new Date(currentYear, month + 1, 0)

                const [eventsCount, resultsCount, announcementsCount, timetablesCount] = await Promise.all([
                    supabase
                        .from('events')
                        .select('id', { count: 'exact' })
                        .gte('created_at', startDate.toISOString())
                        .lte('created_at', endDate.toISOString()),
                    supabase
                        .from('results')
                        .select('id', { count: 'exact' })
                        .gte('created_at', startDate.toISOString())
                        .lte('created_at', endDate.toISOString()),
                    supabase
                        .from('announcements')
                        .select('id', { count: 'exact' })
                        .gte('created_at', startDate.toISOString())
                        .lte('created_at', endDate.toISOString()),
                    supabase
                        .from('timetables')
                        .select('id', { count: 'exact' })
                        .gte('created_at', startDate.toISOString())
                        .lte('created_at', endDate.toISOString())
                ])

                monthlyData.push({
                    name: startDate.toLocaleDateString('en-US', { month: 'short' }),
                    events: eventsCount.count || 0,
                    results: resultsCount.count || 0,
                    announcements: announcementsCount.count || 0,
                    timetables: timetablesCount.count || 0,
                    views: Math.floor(Math.random() * 1000) + 500
                })
            }

            const { data: levelData } = await supabase
                .from('results')
                .select('level')
                .eq('is_published', true)

            const levelCounts: { [key: string]: number } = {};
            const colors = {
                '100': '#3b82f6',
                '200': '#10b981', 
                '300': '#f59e0b',
                '400': '#ef4444',
                '500': '#8b5cf6'
            };

            levelData?.forEach(result => {
                const level = result.level;
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            })

            const totalResults = Object.values(levelCounts).reduce((sum, count) => sum + count, 0);
            
            const levelDistribution = Object.entries(levelCounts).map(([level, count]) => ({
                name: `${level} Level`,
                value: count,
                color: colors[level as keyof typeof colors] || '#6b7280',
                percentage: totalResults > 0 ? Math.round((count / totalResults) * 100) : 0
            }))

            return {
                chartData: monthlyData,
                levelDistribution
            }

        } catch (error) {
            console.error('Error fetching analytics data:', error)
            throw error;
        }
    },

    async fetchQuickMetrics() {
        try {
            const supabase = await createClient()
            const now = new Date();
            
            // Get this month's data
            const [thisMonthResults, thisMonthEvents] = await Promise.all([
                supabase
                    .from('results')
                    .select('id', { count: 'exact' })
                    .gte('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString()),
                supabase
                    .from('events')
                    .select('id', { count: 'exact' })
                    .gte('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
            ]);

            // Get last month's data for comparison
            const [lastMonthResults, lastMonthEvents] = await Promise.all([
                supabase
                    .from('results')
                    .select('id', { count: 'exact' })
                    .gte('created_at', new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString())
                    .lt('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString()),
                supabase
                    .from('events')
                    .select('id', { count: 'exact' })
                    .gte('created_at', new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString())
                    .lt('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
            ]);

            const calculateChange = (current: number, previous: number) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100);
            };

            return [
                {
                    label: 'Monthly Results',
                    value: (thisMonthResults.count || 0).toString(),
                    change: calculateChange(thisMonthResults.count || 0, lastMonthResults.count || 0),
                    trend: (thisMonthResults.count || 0) >= (lastMonthResults.count || 0) ? 'up' : 'down'
                },
                {
                    label: 'Monthly Events',
                    value: (thisMonthEvents.count || 0).toString(),
                    change: calculateChange(thisMonthEvents.count || 0, lastMonthEvents.count || 0),
                    trend: (thisMonthEvents.count || 0) >= (lastMonthEvents.count || 0) ? 'up' : 'down'
                },
                {
                    label: 'Avg. Response Time',
                    value: '2.3s',
                    change: -12,
                    trend: 'up'
                },
                {
                    label: 'System Uptime',
                    value: '99.9%',
                    change: 0,
                    trend: 'neutral'
                }
            ];
        } catch (error) {
            console.error('Error fetching quick metrics:', error);
            return [];
        }
    },

    async fetchContentBySession(academic_session: string) {
        try {
            const supabase = await createClient()
            const [resultsData, timetablesData] = await Promise.all([
                supabase
                    .from('results')
                    .select('*')
                    .eq('academic_session', academic_session)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('timetables')
                    .select('*')
                    .eq('academic_session', academic_session)
                    .order('created_at', { ascending: false })
            ])

            return {
                results: resultsData.data || [],
                timetables: timetablesData.data || []
            }
        } catch (error) {
            console.error('Error fetching content by session:', error)
            throw error;
        }
    },

    async searchContent(query: string) {
        try {
            const supabase = await createClient()
            const [events, announcements, results, timetables] = await Promise.all([
                supabase
                    .from('events')
                    .select('*')
                    .ilike('title', `%${query}%`)
                    .limit(10),
                supabase
                    .from('announcements')
                    .select('*')
                    .ilike('title', `%${query}%`)
                    .limit(10),
                supabase
                    .from('results')
                    .select('*')
                    .or(`title.ilike.%${query}%,course_code.ilike.%${query}%`)
                    .limit(10),
                supabase
                    .from('timetables')
                    .select('*')
                    .ilike('title', `%${query}%`)
                    .limit(10)
            ])

            return {
                events: events.data || [],
                announcements: announcements.data || [],
                results: results.data || [],
                timetables: timetables.data || []
            }
        } catch (error) {
            console.error('Error searching content:', error)
            throw error;
        }
    },

    async bulkPublish(table: string, ids: string[]) {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
                .from(table)
                .update({ is_published: true })
                .in('id', ids)

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error bulk publishing:', error)
            throw error;
        }
    },

    async bulkUnpublish(table: string, ids: string[]) {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
                .from(table)
                .update({ is_published: false })
                .in('id', ids)

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error bulk unpublishing:', error)
            throw error;
        }
    }
}