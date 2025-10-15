"use client"

import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Filter,
  Eye,
  ChevronRight,
  Users,
  Image as ImageIcon,
  CalendarDays,
  RotateCcw
} from 'lucide-react';
import type { Event } from '@/types';
import { fetchEventsAction, getAvailableMonths } from '@/actions/fetch_event.action';
import { useRouter } from 'next/navigation';

interface EventsPageProps {
  initialEvents?: Event[];
  initialMonth?: string;
  initialCount?: number;
}

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    year: date.getFullYear(),
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' })
  }
}

const getMonthDisplayName = (monthValue: string) => {
  if (!monthValue) return 'All Months';
  const [year, month] = monthValue.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const getCategoryColor = (category?: string) => {
  const colors: Record<string, string> = {
    'academic': 'bg-blue-50 text-blue-700 border-blue-200',
    'social': 'bg-purple-50 text-purple-700 border-purple-200',
    'sports': 'bg-green-50 text-green-700 border-green-200',
    'cultural': 'bg-orange-50 text-orange-700 border-orange-200',
    'workshop': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'seminar': 'bg-teal-50 text-teal-700 border-teal-200',
    'conference': 'bg-red-50 text-red-700 border-red-200'
  }
  return colors[category?.toLowerCase() || ''] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export default function EventsPageComponent({ 
  initialEvents = [], 
  initialMonth = '', 
  initialCount 
}: EventsPageProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents)
    const [selectedMonth, setSelectedMonth] = useState(initialMonth)
    const [availableMonths, setAvailableMonths] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(initialCount || initialEvents.length)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        const loadAvailableMonths = async () => {
        const response = await getAvailableMonths()
        if (response.success && response.data) {
            setAvailableMonths(response.data)
        }
        }
        loadAvailableMonths()
    }, [])

    useEffect(() => {
        if (isInitialLoad && initialEvents.length > 0) {
            setEvents(initialEvents)
            setTotalCount(initialCount || initialEvents.length)
            setIsInitialLoad(false)
        }
    }, [initialEvents, initialCount, isInitialLoad])

    const fetchEvents = useCallback(async (month?: string) => {
        if (isInitialLoad && !month) {
            return
        }

        setLoading(true)
        try {
        const response = await fetchEventsAction({
            month: month || undefined,
            is_published: true
        })

        if (response.success && response.data) {
            setEvents(response.data)
            setTotalCount(response.count || response.data.length)
        } else {
            console.error('Failed to fetch events:', response.error)
            setEvents([])
            setTotalCount(0)
        }
        } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
        setTotalCount(0)
        } finally {
        setLoading(false)
        }
    }, [isInitialLoad])

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month)
        setIsInitialLoad(false)
        fetchEvents(month)
    }

    const router = useRouter()

    const handleEventClick = (eventId: string) => {
        router.push(`/events/${eventId}`)
    }

    const currentYear = new Date().getFullYear()

    return (
        <div className="min-h-screen pt-28 pb-40 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto glob-px py-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Department Events
                    </h1>
                    <div className="flex items-center space-x-2 text-gray-600 font-medium">
                        <CalendarDays className="w-4 h-4" />
                        <span>Academic Year {currentYear}</span>
                    </div>
                    </div>
                </div>
                </div>

                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">
                    {totalCount} events
                    </span>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto glob-px py-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
                    </div>
                    
                    <button
                        onClick={() => handleMonthChange('')}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        title="Reset filters"
                        >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                </div>

                <div className="mt-4">
                    <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Month
                    </label>
                    <select
                    id="month-filter"
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                    >
                    <option value="">All Months</option>
                    {availableMonths.map((month) => (
                        <option key={month} value={month}>
                        {getMonthDisplayName(month)}
                        </option>
                    ))}
                    </select>
                </div>
            </div>

            {/* Events Table */}
            {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading events...</span>
                </div>
            </div>
            ) : events.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {selectedMonth ? `Events for ${getMonthDisplayName(selectedMonth)}` : `All events for ${currentYear}`}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Event
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                            Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                            Location
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                            Category
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {events.map((event) => {
                            const dateInfo = formatEventDate(event.date_time)
                            const hasImage = event.image_urls && event.image_urls.length > 0;

                            return (
                            <tr 
                                key={event.id} 
                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                onClick={() => handleEventClick(event.id)}
                            >
                                <td className="px-6 py-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                    {hasImage ? (
                                        <img
                                        src={event.image_urls[0]}
                                        alt={event.title}
                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                                        {event.title}
                                    </h3>
                                    {event.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                        {event.description}
                                        </p>
                                    )}
                                    <div className="md:hidden space-y-1">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{dateInfo.weekday}, {dateInfo.month} {dateInfo.day} at {dateInfo.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </td>

                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
                                            <span className="text-xs font-medium">{dateInfo.month}</span>
                                            <span className="text-lg font-bold leading-none">{dateInfo.day}</span>
                                        </div>
                                        </div>
                                        <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {dateInfo.weekday}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {dateInfo.time}
                                        </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-900 font-medium">
                                        {event.location}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 hidden lg:table-cell">
                                    {event.category ? (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                                        {event.category}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-400">—</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        handleEventClick(event.id)
                                        }}
                                        className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600 max-w-md">
                    {selectedMonth 
                        ? `No events scheduled for ${getMonthDisplayName(selectedMonth)}.`
                        : `No events have been published for ${currentYear} yet.`
                    }
                    </p>
                </div>
                {selectedMonth && (
                    <button
                    onClick={() => handleMonthChange('')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                    <Calendar className="w-4 h-4" />
                    <span>View All Events</span>
                    </button>
                )}
                </div>
            </div>
            )}
        </div>
        </div>
    )
}