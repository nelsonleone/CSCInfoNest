"use client"

import { useState, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { 
  Upload,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Tag,
  Clock,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import type { Event } from '@/types';
import { useRouter } from 'next/navigation';
import { formatFileSize } from '@/utils/helperFns/formatFile';
import { EventFormData, eventSchema } from '@/schema/event.schema';
import { createEvent, updateEvent } from '@/actions/event_upload';


interface AddEventFormProps {
  onCancel?: () => void;
  initialData?: Partial<Event>;
  mode?: 'create' | 'edit';
  eventId?: string;
}

interface ImagePreview {
  file: File;
  url: string;
  name: string;
  size: number;
}

const EVENT_CATEGORIES = [
  'Academic',
  'Social',
  'Sports',
  'Cultural',
  'Workshop',
  'Seminar',
  'Conference',
  'Competition',
  'Ceremony',
  'Meeting',
  'Other'
];

function AddEventForm ({ 
  onCancel,
  initialData,
  mode = 'create',
  eventId
}: AddEventFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
    const [imageError, setImageError] = useState<string>('');
    const [dragOver, setDragOver] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
    const [keepExistingImage, setKeepExistingImage] = useState(true);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        clearErrors,
        watch
    } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
        title: initialData?.title || '',
        description: initialData?.description || '',
        date_time: initialData?.date_time ? new Date(initialData.date_time).toISOString().slice(0, 16) : '',
        location: initialData?.location || '',
        category: initialData?.category || '',
        is_published: initialData?.is_published ?? true
        }
    });

    const clearSubmitMessage = () => {
        setSubmitMessage(null);
    };

    const validateImage = (file: File): string | null => {
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (file.size > maxSize) {
        return 'Image is too large. Maximum size is 5MB.';
        }

        if (!allowedTypes.includes(file.type)) {
        return 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.';
        }

        return null;
    };

    const handleImageSelect = (file: File) => {
        const error = validateImage(file);
        if (error) {
        setImageError(error);
        return;
        }

        const preview: ImagePreview = {
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
        };

        setImagePreview(preview);
        setImageError('');
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        handleImageSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
        handleImageSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const removeImage = () => {
        if (imagePreview) {
        URL.revokeObjectURL(imagePreview.url);
        setImagePreview(null);
        }
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
        setImageError('');
    };

    const onSubmit: SubmitHandler<EventFormData> = async (data) => {
        setSubmitMessage(null);

        try {
        const formData = new FormData();
        
        if (imagePreview) {
            formData.append('image', imagePreview.file);
        }

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
            }
        });

        if (mode === 'edit') {
            formData.append('keep_existing_image', keepExistingImage.toString())
        }

        let response: {
            success: boolean;
            data?: Event;
            error?: string;
        };

        if (mode === 'edit' && eventId) {
            response = await updateEvent(eventId, formData)
        } else {
            response = await createEvent(formData)
        }

        if (response.success) {
            setSubmitMessage({
            type: 'success',
            text: mode === 'edit' ? 'Event updated successfully!' : 'Event created successfully!'
            });
            
            if (mode === 'create') {
            reset();
            removeImage();
            }

            toast.success(mode === 'edit' ? 'Event updated successfully!' : 'Event created successfully!');
            router.push("/dpt-admin");
            
        } else {
            const errorMessage = response.error || 'An error occurred';
            setSubmitMessage({
            type: 'error',
            text: errorMessage
            });
            toast.error(errorMessage);
        }
        } catch (error) {
        console.error('Submit error:', error);
        const errorMessage = 'An unexpected error occurred';
        setSubmitMessage({
            type: 'error',
            text: errorMessage
        });
        toast.error(errorMessage);
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
        });
    };

    return (
        <div className="min-h-screen pt-5 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto glob-px">
            <div className="py-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
                    </h1>
                    <p className="text-gray-600 mt-1">Add upcoming events for students and faculty</p>
                    </div>
                </div>
                
                {onCancel && (
                    <button
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                    Cancel
                    </button>
                )}
                </div>
            </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto glob-px py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {submitMessage && (
                <div className={`p-4 rounded-xl border ${
                submitMessage.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                <div className="flex items-center space-x-2">
                    {submitMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                    ) : (
                    <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{submitMessage.text}</span>
                </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <span>Event Details</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Provide information about the event</p>
                </div>

                <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                    </label>
                    <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g., Annual Tech Conference 2024"
                    onChange={() => {
                        clearSubmitMessage();
                        clearErrors('title');
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    />
                    {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title.message}</span>
                    </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    {...register('description')}
                    placeholder="Describe the event, agenda, and other relevant information..."
                    rows={4}
                    onChange={() => {
                        clearSubmitMessage();
                        clearErrors('description');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    />
                    {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description.message}</span>
                    </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date & Time */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Date & Time *
                    </label>
                    <input
                        {...register('date_time')}
                        type="datetime-local"
                        onChange={() => {
                        clearSubmitMessage();
                        clearErrors('date_time');
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                        errors.date_time ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.date_time && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.date_time.message}</span>
                        </p>
                    )}
                    {/* Preview formatted date */}
                    {watch('date_time') && (
                        <p className="mt-1 text-xs text-gray-500">
                        Preview: {formatDateTime(watch('date_time'))}
                        </p>
                    )}
                    </div>

                    {/* Location */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location *
                    </label>
                    <input
                        {...register('location')}
                        type="text"
                        placeholder="e.g., Main Auditorium, University Campus"
                        onChange={() => {
                        clearSubmitMessage();
                        clearErrors('location');
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.location && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.location.message}</span>
                        </p>
                    )}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Category
                    </label>
                    <select
                    {...register('category')}
                    onChange={() => {
                        clearSubmitMessage();
                        clearErrors('category');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="">Select a category (optional)</option>
                    {EVENT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    </select>
                    {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.category.message}</span>
                    </p>
                    )}
                </div>
                </div>
            </div>

            {/* Image Upload Section */}
            {mode === 'create' || !initialData?.image_urls || initialData.image_urls.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-pink-500" />
                    <span>Event Image</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Upload an image to represent the event (optional)</p>
                </div>

                <div className="p-8">
                    {!imagePreview ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                        dragOver 
                            ? 'border-purple-400 bg-purple-50' 
                            : imageError 
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className={`w-12 h-12 mx-auto mb-4 ${
                        dragOver ? 'text-purple-500' : imageError ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {dragOver ? 'Drop image here' : 'Upload event image'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                        Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                        JPEG, PNG, GIF, or WebP (max 5MB)
                        </p>
                        
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                        />
                    </div>
                    ) : (
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                            <ImageIcon className="w-8 h-8 text-purple-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                            {imagePreview.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(imagePreview.size)} • {imagePreview.file.type}
                            </p>
                        </div>
                        
                        <button
                            type="button"
                            onClick={removeImage}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                        
                        {/* Image Preview */}
                        <div className="relative">
                        <img
                            src={imagePreview.url}
                            alt="Event preview"
                            className="w-full h-64 object-cover bg-gray-100 rounded-xl"
                        />
                        </div>
                    </div>
                    )}
                    
                    {imageError && (
                    <p className="mt-3 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{imageError}</span>
                    </p>
                    )}
                </div>
                </div>
            ) : (
                /* Show existing image info for edit mode */
                initialData.image_urls && initialData.image_urls.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <ImageIcon className="w-5 h-5 text-green-500" />
                        <span>Current Image</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">The existing image for this event</p>
                    </div>
                    
                    <div className="p-8">
                    <div className="space-y-4">
                        <img
                        src={initialData.image_urls[0]}
                        alt="Current event image"
                        className="w-full h-64 object-cover bg-gray-100 rounded-xl"
                        />
                        
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                            Current event image
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                            Click to view full size
                            </p>
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => window.open(initialData.image_urls![0], '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </button>
                        </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        {/* Keep existing image option */}
                        <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="keep_existing_image"
                            checked={keepExistingImage}
                            onChange={(e) => setKeepExistingImage(e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label htmlFor="keep_existing_image" className="text-sm font-medium text-gray-700">
                            Keep current image
                        </label>
                        </div>
                        
                        {/* Replace image option */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Replace with new image (optional)
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Click to select a new image</p>
                            <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileInputChange}
                            className="hidden"
                            />
                        </div>
                        
                        {imagePreview && (
                            <div className="mt-4 space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                                <ImageIcon className="w-8 h-8 text-blue-500" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                    New: {imagePreview.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatFileSize(imagePreview.size)} • {imagePreview.file.type}
                                </p>
                                </div>
                                
                                <button
                                type="button"
                                onClick={removeImage}
                                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* New Image Preview */}
                            <div className="relative">
                                <img
                                src={imagePreview.url}
                                alt="New event preview"
                                className="w-full h-64 object-cover bg-gray-100 rounded-xl border-2 border-blue-200"
                                />
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                New Image
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                </div>
                )
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6">
                {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                )}
                
                <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{mode === 'edit' ? 'Updating...' : 'Creating...'}</span>
                    </>
                ) : (
                    <>
                    <Save className="w-5 h-5" />
                    <span>{mode === 'edit' ? 'Update Event' : 'Create Event'}</span>
                    </>
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    )
}

export default AddEventForm;