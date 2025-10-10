"use client"

import { Calendar, MapPin, Clock, Share2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';

export default function EventDetailsPage({ event }: { event: Event }) {

  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Event link copied to clipboard!');
    }
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-[#1A1A40] py-6">
        <div className="max-w-7xl mx-auto glob-px">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#1ABC9C] hover:text-white transition-colors mb-4"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Events</span>
            </button>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#1ABC9C]">Events</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-300">{event.category || 'General'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto glob-px py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          {event.image_urls && event.image_urls.length > 0 && (
            <div className="relative h-96 bg-[#333333]">
              <img 
                src={event.image_urls[0]} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Title and Share */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                {event.category && (
                  <span className="inline-block px-3 py-1 bg-[#1ABC9C] text-white text-sm font-medium rounded-full mb-4">
                    {event.category}
                  </span>
                )}
                <h1 className="text-4xl font-bold text-[#1A1A40] mb-2">
                  {event.title}
                </h1>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors rounded-lg"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Date */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="text-[#333333] font-semibold">{formattedDate}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="text-[#333333] font-semibold">{formattedTime}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-[#333333] font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A40] mb-4">
                  About This Event
                </h2>
                <div className="text-[#333333] leading-relaxed space-y-4">
                  {event.description.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            )}

            {event.image_urls && event.image_urls.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A40] mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.image_urls.slice(1).map((url, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                      <img 
                        src={url} 
                        alt={`${event.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8">
              <div className="bg-[#1A1A40] text-white rounded-lg p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2">Interested in Attending?</h3>
                <p className="text-gray-300 mb-6">
                  Join us for this exciting event and be part of our vibrant student community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}