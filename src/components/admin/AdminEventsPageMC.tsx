"use client"

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar,
  MapPin,
  Eye,
  Clock,
  Loader2,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DPTSharedPageHeader } from '../custom-utils/DPTSharedPageHeader';
import { SearchAndFilters } from '../custom-utils/SearchFilter';
import { Pagination } from '../custom-utils/Pagination';
import { EmptyState } from '../custom-utils/EmptyState';
import Link from 'next/link';
import { Event } from '@/types';
import { deleteEventAction, fetchEventsAction } from '@/actions/fetch_event.action';

interface EventCardProps {
  event: Event;
  onDelete: (event: Event) => void;
}

function EventCard({ event, onDelete }: EventCardProps) {
    const eventDate = new Date(event.date_time);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const handleDelete = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${event.title}"?`);
        if (!confirmed) return;
        onDelete(event);
    };

    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Event Image */}
        {event.image_urls && event.image_urls.length > 0 && (
            <div className="relative h-48 overflow-hidden bg-gray-100">
            <img 
                src={event.image_urls[0]} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {event.category && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#1ABC9C] text-white text-xs font-medium rounded-full">
                {event.category}
                </span>
            )}
            </div>
        )}

        {/* Event Details */}
        <div className="p-5 space-y-4">
            <div>
            <h3 className="font-semibold text-[#1A1A40] text-lg line-clamp-2 group-hover:text-[#1ABC9C] transition-colors mb-2">
                {event.title}
            </h3>
            {event.description && (
                <p className="text-sm text-[#333333] line-clamp-2">
                {event.description}
                </p>
            )}
            </div>

            {/* Date & Location */}
            <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-[#333333]">
                <Calendar className="w-4 h-4 text-[#1ABC9C]" />
                <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[#333333]">
                <MapPin className="w-4 h-4 text-[#1ABC9C]" />
                <span className="line-clamp-1">{event.location}</span>
            </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
                href={`/events/${event.id}`}
                className="flex items-center space-x-1 px-4 py-2 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16a085] transition-colors text-sm font-medium"
            >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
            </Link>
            
            <button
                onClick={handleDelete}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete event"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Created {new Date(event.created_at).toLocaleDateString()}</span>
            </div>
        </div>
        </div>
    )
}

interface EventsViewPageProps {
    initialData: Event[];
    initialCount: number;
}

export default function AdminEventsPage({ initialData, initialCount }: EventsViewPageProps) {
    const [events, setEvents] = useState<Event[]>(initialData);
    const [totalCount, setTotalCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const pageSize = 12;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    
    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadEvents = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
        const response = await fetchEventsAction({
            month: selectedMonth || undefined,
            is_published: true,
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        if (response.success && response.data) {
            // Client-side search filtering
            let filteredData = response.data;
            if (debouncedSearchTerm) {
            const searchLower = debouncedSearchTerm.toLowerCase();
            filteredData = filteredData.filter(event => 
                event.title.toLowerCase().includes(searchLower) ||
                event.description?.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower) ||
                event.category?.toLowerCase().includes(searchLower)
            );
            }
            
            setEvents(filteredData);
            setTotalCount(filteredData.length);
            setCurrentPage(page);
        }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to load events');
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, debouncedSearchTerm, pageSize]);

    useEffect(() => {
        if (debouncedSearchTerm !== '' || selectedMonth !== '') {
        loadEvents(1);
        }
    }, [selectedMonth, debouncedSearchTerm, loadEvents]);

    useEffect(() => {
        if (debouncedSearchTerm === '' && selectedMonth === '') {
        setEvents(initialData);
        setTotalCount(initialCount);
        setCurrentPage(1);
        }
    }, [debouncedSearchTerm, selectedMonth, initialData, initialCount]);

    const handleDelete = async (event: Event) => {
        try {
        const response = await deleteEventAction(event.id)
        
        if (!response.success) {
            toast.error(response.error || 'Failed to delete event');
            return;
        }
        
        toast.success('Event deleted successfully');
        
        loadEvents(currentPage);
        } catch {
        toast.error('An error occurred while deleting the event');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedMonth('');
    };

    const handlePageChange = (page: number) => {
        loadEvents(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = searchTerm || selectedMonth;

    // Generate month options for current year
    const currentYear = new Date().getFullYear();
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        const date = new Date(currentYear, i);
        return {
        value: `${currentYear}-${month}`,
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
    });

    return (
        <div className="min-h-screen">
        <DPTSharedPageHeader
            icon={<Calendar className="w-6 h-6 text-white" />}
            title="Events"
            description="Browse upcoming events and activities"
            totalCount={totalCount}
            itemName="event"
        />

        <div className="max-w-7xl mx-auto glob-px py-8">
            <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters ? true : false}
            searchPlaceholder="Search events by title, description, location..."
            filters={{
                month: {
                value: selectedMonth,
                onChange: setSelectedMonth,
                options: monthOptions,
                label: 'Month'
                }
            }}
            />

            {loading ? (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#1ABC9C] animate-spin" />
                <p className="text-[#333333]">Loading events...</p>
                </div>
            </div>
            ) : events.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.map((event) => (
                    <EventCard
                    key={event.id}
                    event={event}
                    onDelete={handleDelete}
                    />
                ))}
                </div>
                
                {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemName="event"
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
                )}
            </>
            ) : (
            <EmptyState
                icon={<Calendar className="w-8 h-8 text-gray-400" />}
                title="No events found"
                description={
                hasActiveFilters
                    ? "Try adjusting your search terms or filters to find events."
                    : "No events have been published yet."
                }
                hasActiveFilters={hasActiveFilters ? true : false}
                onClearFilters={clearFilters}
            />
            )}
        </div>
        </div>
    )
}