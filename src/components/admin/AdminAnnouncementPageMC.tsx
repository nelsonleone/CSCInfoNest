"use client"

import { useState, useEffect, useCallback } from 'react';
import { 
    Megaphone,
    AlertTriangle,
    AlertCircle,
    Info,
    Calendar,
    Users,
    Clock,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    Plus,
    Filter,
    Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Announcement } from '@/types';
import { DPTSharedPageHeader } from '../custom-utils/DPTSharedPageHeader';
import { Pagination } from '../custom-utils/Pagination';
import { EmptyState } from '../custom-utils/EmptyState';
import Link from 'next/link';
import { deleteAnnouncementAction, fetchAnnouncementsAction } from '@/actions/annnouncements.action';

interface AnnouncementCardProps {
    announcement: Announcement;
    onDelete: (announcement: Announcement) => void;
}

function AnnouncementCard({ announcement, onDelete }: AnnouncementCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    color: 'bg-red-500',
                    lightBg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    icon: <AlertTriangle className="w-4 h-4" />,
                    label: 'Urgent'
                };
            case 'medium':
                return {
                    color: 'bg-amber-500',
                    lightBg: 'bg-amber-50',
                    border: 'border-amber-200',
                    text: 'text-amber-700',
                    icon: <AlertCircle className="w-4 h-4" />,
                    label: 'Important'
                };
            default:
                return {
                    color: 'bg-blue-500',
                    lightBg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-700',
                    icon: <Info className="w-4 h-4" />,
                    label: 'General'
                };
        }
    };

    const config = getPriorityConfig(announcement.priority)
    const contentPreview = announcement.content.slice(0, 120)
    const needsExpansion = announcement.content.length > 120;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date()

    const handleDelete = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${announcement.title}"?`)
        if (!confirmed) return;
        onDelete(announcement)
    };

    return (
        <div className={`group bg-white rounded-xl border-l-4 ${config.color.replace('bg-', 'border-')} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isExpired ? 'opacity-60' : ''}`}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className={`${config.lightBg} ${config.text} p-2 rounded-lg flex-shrink-0`}>
                            {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-3 py-1 ${config.lightBg} ${config.text} text-xs font-semibold rounded-full border ${config.border}`}>
                                    {config.label}
                                </span>
                                {!announcement.is_published ? (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-300 flex items-center space-x-1">
                                        <EyeOff className="w-3 h-3" />
                                        <span>Draft</span>
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200 flex items-center space-x-1">
                                        <Eye className="w-3 h-3" />
                                        <span>Published</span>
                                    </span>
                                )}
                                {isExpired && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-300">
                                        Expired
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-[#1A1A40] line-clamp-2 group-hover:text-[#1ABC9C] transition-colors">
                                {announcement.title}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-[#333333] leading-relaxed">
                        {isExpanded ? announcement.content : contentPreview}
                        {!isExpanded && needsExpansion && '...'}
                    </p>
                    {needsExpansion && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 text-[#1ABC9C] hover:text-[#16a085] text-xs font-medium"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Created {formatDate(announcement.created_at)}</span>
                    </div>
                    {announcement.target_audience && (
                        <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{announcement.target_audience}</span>
                        </div>
                    )}
                    {announcement.expires_at && (
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Expires {formatDate(announcement.expires_at)}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleDelete}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center space-x-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

interface AdminAnnouncementsPageProps {
    initialData: Announcement[];
    initialCount: number;
}

export default function AdminAnnouncementsPage({ initialData, initialCount }: AdminAnnouncementsPageProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialData)
    const [totalCount, setTotalCount] = useState(initialCount)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPriority, setSelectedPriority] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    
    const pageSize = 12;
    const totalPages = Math.ceil(totalCount / pageSize)

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)
        
        return () => clearTimeout(timer)
    }, [searchTerm])

    const loadAnnouncements = useCallback(async (page: number = 1) => {
        setLoading(true)
        try {
            const response = await fetchAnnouncementsAction({
                priority: selectedPriority ? selectedPriority as 'low' | 'medium' | 'high' : undefined,
                include_expired: true,
                limit: pageSize,
                offset: (page - 1) * pageSize
            })

            if (response.success && response.data) {
                let filteredData = response.data;
                
                if (debouncedSearchTerm) {
                    const searchLower = debouncedSearchTerm.toLowerCase()
                    filteredData = filteredData.filter(announcement => 
                        announcement.title.toLowerCase().includes(searchLower) ||
                        announcement.content.toLowerCase().includes(searchLower) ||
                        announcement.target_audience?.toLowerCase().includes(searchLower)
                    )
                }
                
                setAnnouncements(filteredData)
                setTotalCount(filteredData.length)
                setCurrentPage(page)
            }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to load announcements')
        } finally {
            setLoading(false)
        }
    }, [selectedPriority, debouncedSearchTerm, pageSize])

    useEffect(() => {
        if (debouncedSearchTerm !== '' || selectedPriority !== '') {
            loadAnnouncements(1)
        }
    }, [selectedPriority, debouncedSearchTerm, loadAnnouncements])

    useEffect(() => {
        if (debouncedSearchTerm === '' && selectedPriority === '') {
            setAnnouncements(initialData)
            setTotalCount(initialCount)
            setCurrentPage(1)
        }
    }, [debouncedSearchTerm, selectedPriority, initialData, initialCount])

    const handleDelete = async (announcement: Announcement) => {
        try {
            const response = await deleteAnnouncementAction(announcement.id)
            
            if (!response.success) {
                toast.error(response.error || 'Failed to delete announcement')
                return;
            }
            
            toast.success('Announcement deleted successfully')
            loadAnnouncements(currentPage)
        } catch {
            toast.error('An error occurred while deleting the announcement')
        }
    };

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedPriority('')
    };

    const handlePageChange = (page: number) => {
        loadAnnouncements(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    };

    const hasActiveFilters = searchTerm || selectedPriority;

    const priorityOptions = [
        { value: 'high', label: 'Urgent' },
        { value: 'medium', label: 'Important' },
        { value: 'low', label: 'General' }
    ];

    const stats = {
        total: totalCount,
        published: announcements.filter(a => a.is_published).length,
        drafts: announcements.filter(a => !a.is_published).length,
        urgent: announcements.filter(a => a.priority === 'high').length
    };

    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            <DPTSharedPageHeader
                icon={<Megaphone className="w-6 h-6 text-white" />}
                title="Manage Announcements"
                description="Create, edit, and manage announcements"
                totalCount={totalCount}
                itemName="announcement"
            />

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto glob-px py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1A1A40]">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                            <div className="text-sm text-gray-600">Published</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
                            <div className="text-sm text-gray-600">Drafts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                            <div className="text-sm text-gray-600">Urgent</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto glob-px py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Link
                        href="/dpt-admin/announcements/create"
                        className="px-6 py-3 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16a085] transition-colors flex items-center space-x-2 font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Announcement</span>
                    </Link>
                </div>

                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-3 border rounded-xl transition-colors flex items-center space-x-2 ${
                                showFilters || hasActiveFilters
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {[searchTerm, selectedPriority].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                                    >
                                        <option value="">All Priorities</option>
                                        {priorityOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="w-8 h-8 text-[#1ABC9C] animate-spin" />
                            <p className="text-[#333333]">Loading announcements...</p>
                        </div>
                    </div>
                ) : announcements.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            {announcements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemName="announcement"
                                totalCount={totalCount}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={<Megaphone className="w-8 h-8 text-gray-400" />}
                        title="No announcements found"
                        description={
                            hasActiveFilters
                                ? "Try adjusting your search terms or filters."
                                : "No announcements have been created yet."
                        }
                        hasActiveFilters={hasActiveFilters ? true : false}
                        onClearFilters={clearFilters}
                    />
                )}
            </div>
        </div>
    )
}