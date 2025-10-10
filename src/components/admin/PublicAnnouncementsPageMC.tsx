"use client"

import { useState } from 'react';
import { 
    Megaphone, 
    AlertTriangle, 
    AlertCircle, 
    Info,
    Calendar,
    Users,
    Clock,
    ChevronDown,
    Filter,
    Search,
    Bell
} from 'lucide-react';

interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
    target_audience?: string;
    expires_at?: string;
    created_at: string;
    is_published: boolean;
}

export default function PublicAnnouncementsPageMC({ data }: { data: Announcement[] }) {
    const [announcements] = useState<Announcement[]>(data)
    const [selectedPriority, setSelectedPriority] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    color: 'bg-red-500',
                    lightBg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    icon: <AlertTriangle className="w-5 h-5" />,
                    label: 'Urgent'
                }
            case 'medium':
                return {
                    color: 'bg-amber-500',
                    lightBg: 'bg-amber-50',
                    border: 'border-amber-200',
                    text: 'text-amber-700',
                    icon: <AlertCircle className="w-5 h-5" />,
                    label: 'Important'
                }
            default:
                return {
                    color: 'bg-blue-500',
                    lightBg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-700',
                    icon: <Info className="w-5 h-5" />,
                    label: 'General'
                }
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })
        }
    }

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
        const matchesSearch = 
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesPriority && matchesSearch;
    })

    const priorityCounts = {
        high: announcements.filter(a => a.priority === 'high').length,
        medium: announcements.filter(a => a.priority === 'medium').length,
        low: announcements.filter(a => a.priority === 'low').length
    }

    return (
        <div className="min-h-screen bg-[#F4F4F4] pt-24">
            <div className="bg-gradient-to-r from-[#1A1A40] to-[#2a2a60] text-white">
                <div className="max-w-7xl mx-auto glob-px py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center shadow-lg">
                                <Bell className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Announcements</h1>
                                <p className="text-gray-300 text-lg">Stay updated with important notices and updates</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <span className="text-sm text-gray-300">Urgent</span>
                            </div>
                            <div className="text-3xl font-bold">{priorityCounts.high}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                <span className="text-sm text-gray-300">Important</span>
                            </div>
                            <div className="text-3xl font-bold">{priorityCounts.medium}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-gray-300">General</span>
                            </div>
                            <div className="text-3xl font-bold">{priorityCounts.low}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto glob-px py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] bg-white"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">Urgent Only</option>
                                <option value="medium">Important Only</option>
                                <option value="low">General Only</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto glob-px py-8">
                {filteredAnnouncements.length === 0 ? (
                    <div className="text-center py-16">
                        <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No announcements found</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedPriority !== 'all' 
                                ? 'Try adjusting your filters' 
                                : 'Check back later for updates'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAnnouncements.map((announcement) => {
                            const config = getPriorityConfig(announcement.priority)
                            const isExpanded = expandedIds.has(announcement.id)
                            const contentPreview = announcement.content.slice(0, 150)
                            const needsExpansion = announcement.content.length > 150;

                            return (
                                <div
                                    key={announcement.id}
                                    className={`bg-white rounded-xl border-l-4 ${config.color.replace('bg-', 'border-')} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start space-x-3 flex-1">
                                                <div className={`${config.lightBg} ${config.text} p-2 rounded-lg`}>
                                                    {config.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`px-3 py-1 ${config.lightBg} ${config.text} text-xs font-semibold rounded-full border ${config.border}`}>
                                                            {config.label}
                                                        </span>
                                                        {announcement.target_audience && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200 flex items-center space-x-1">
                                                                <Users className="w-3 h-3" />
                                                                <span>{announcement.target_audience}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-[#1A1A40] mb-2 leading-tight">
                                                        {announcement.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
                                                {isExpanded ? announcement.content : contentPreview}
                                                {!isExpanded && needsExpansion && '...'}
                                            </p>
                                            {needsExpansion && (
                                                <button
                                                    onClick={() => toggleExpanded(announcement.id)}
                                                    className="mt-3 text-[#1ABC9C] hover:text-[#16a085] font-medium text-sm flex items-center space-x-1 transition-colors"
                                                >
                                                    <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(announcement.created_at)}</span>
                                                </div>
                                                {announcement.expires_at && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Expires {new Date(announcement.expires_at).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}