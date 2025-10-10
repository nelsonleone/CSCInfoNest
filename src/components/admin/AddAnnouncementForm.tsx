"use client"

import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Megaphone,
  CheckCircle,
  AlertCircle,
  Save,
  Calendar,
  Users,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Announcement } from '@/types';
import { useRouter } from 'next/navigation';
import { createAnnouncement, updateAnnouncement } from '@/actions/annnouncements.action';

const announcementSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  target_audience: z.string().optional(),
  expires_at: z.string().optional(),
  is_published: z.boolean()
})

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AddAnnouncementFormProps {
  onCancel?: () => void;
  initialData?: Partial<Announcement>;
  mode?: 'create' | 'edit';
  announcementId?: string;
}

const AddAnnouncementForm: React.FC<AddAnnouncementFormProps> = ({ 
  onCancel,
  initialData,
  mode = 'create',
  announcementId
}) => {
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    watch
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      priority: initialData?.priority || 'medium',
      target_audience: initialData?.target_audience || '',
      expires_at: initialData?.expires_at ? new Date(initialData.expires_at).toISOString().slice(0, 16) : '',
      is_published: initialData?.is_published ?? true
    }
  })

  const watchedData = watch()

  const clearSubmitMessage = () => {
    setSubmitMessage(null)
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const onSubmit: SubmitHandler<AnnouncementFormData> = async (data) => {
    setSubmitMessage(null)

    try {
      const formattedData = {
        ...data,
        expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : undefined
      };

      let response: {
        success: boolean;
        data?: Announcement;
        error?: string;
      };
      
      if (mode === 'edit' && announcementId) {
        response = await updateAnnouncement(announcementId, formattedData)
      } else {
        response = await createAnnouncement(formattedData)
      }

      if (response.success) {
        setSubmitMessage({
          type: 'success',
          text: mode === 'edit' ? 'Announcement updated successfully!' : 'Announcement created successfully!'
        })
        
        if (mode === 'create') {
          reset()
        }

        toast.success(mode === 'edit' ? 'Announcement updated!' : 'Announcement created!')
        router.push("/dpt-admin/announcements")
        
      } else {
        const errorMessage = response.error || 'An error occurred';
        setSubmitMessage({
          type: 'error',
          text: errorMessage
        })
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Submit error:', error)
      const errorMessage = 'An unexpected error occurred';
      setSubmitMessage({
        type: 'error',
        text: errorMessage
      })
      toast.error(errorMessage)
    }
  };

  return (
    <div className="h-full pt-5 bg-[#f4f4f4]">
      <div className="bg-white border-b border-gray-200 top-0 z-50">
        <div className="max-w-5xl mx-auto glob-px">
          <div className="py-4 sm:py-6">
            <div className="flex flex-wrap flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1ABC9C] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A1A40] truncate">
                    {mode === 'edit' ? 'Edit Announcement' : 'Create Announcement'}
                  </h1>
                  <p className="text-[#333333] mt-1 text-sm sm:text-base hidden sm:block">Share important updates with students</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-2 sm:px-4 text-[#333333] hover:text-[#1ABC9C] hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="">{showPreview ? 'Hide' : 'Preview'}</span>
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-3 py-2 sm:px-4 text-[#333333] hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto glob-px py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#1A1A40]">Basic Information</h2>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                      Announcement Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="e.g., Important: Class Schedule Change"
                      onChange={() => {
                        clearSubmitMessage()
                        clearErrors('title')
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition-colors ${
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
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                      Content *
                    </label>
                    <textarea
                      {...register('content')}
                      placeholder="Write your announcement message here..."
                      rows={8}
                      onChange={() => {
                        clearSubmitMessage()
                        clearErrors('content')
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] resize-none ${
                        errors.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.content.message}</span>
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {watchedData.content?.length || 0} / 5000 characters
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#1A1A40]">Settings</h2>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                      Priority Level *
                    </label>
                    <select
                      {...register('priority')}
                      onChange={() => {
                        clearSubmitMessage()
                        clearErrors('priority')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                    >
                      <option value="low">Low - General information</option>
                      <option value="medium">Medium - Important update</option>
                      <option value="high">High - Urgent notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Target Audience
                    </label>
                    <input
                      {...register('target_audience')}
                      type="text"
                      placeholder="e.g., All Students, 400 Level Students, etc."
                      onChange={() => clearSubmitMessage()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to target all students
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Expires On (Optional)
                    </label>
                    <input
                      {...register('expires_at')}
                      type="datetime-local"
                      onChange={() => clearSubmitMessage()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Announcement will be hidden after this date
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-[#333333] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16a085] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{mode === 'edit' ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{mode === 'edit' ? 'Update Announcement' : 'Create Announcement'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-[#1A1A40] uppercase tracking-wide">
                    Preview
                  </h3>
                </div>
                
                <div className="p-6">
                  {watchedData.title || watchedData.content ? (
                    <div className="space-y-4">
                      {watchedData.priority && (
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(watchedData.priority)}`}>
                          {getPriorityIcon(watchedData.priority)}
                          <span className="capitalize">{watchedData.priority} Priority</span>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-bold text-[#1A1A40]">
                        {watchedData.title || 'Announcement Title'}
                      </h3>
                      
                      <p className="text-sm text-[#333333] whitespace-pre-wrap">
                        {watchedData.content || 'Your announcement content will appear here...'}
                      </p>
                      
                      <div className="pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-500">
                        {watchedData.target_audience && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{watchedData.target_audience}</span>
                          </div>
                        )}
                        {watchedData.expires_at && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Expires: {new Date(watchedData.expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Start typing to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default AddAnnouncementForm;