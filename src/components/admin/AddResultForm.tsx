"use client"

import { useState, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Upload,
  FileText, 
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  Calendar,
  BookOpen,
  FileCheck,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import type { Result, Semester, Level } from '@/types';
import { createResult, updateResult } from '@/actions/result_upload.action';
import { useRouter } from 'next/navigation';
import { formatFileSize } from '@/utils/helperFns/formatFile';

const resultSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  academic_session: z.string()
  .min(1, 'Academic session is required')
  .regex(
    /^\d{4}-\d{4}$/, 
    'Academic session must be in format YYYY-YYYY (e.g., 2022-2023)'
  )
  .refine(
    (val) => {
      const [startYear, endYear] = val.split('-').map(Number);
      return endYear === startYear + 1;
    },
    'End year must be exactly one year after start year'
  ),
  semester: z.enum(['first', 'second']),
  level: z.string().min(1, 'Level is required'),
  is_published: z.boolean()
})

type ResultFormData = z.infer<typeof resultSchema>;

interface AddResultFormProps {
  onCancel?: () => void;
  initialData?: Partial<Result>;
  mode?: 'create' | 'edit';
  resultId?: string;
}

interface FilePreview {
  file: File;
  url: string;
  type: 'pdf' | 'image' | 'other';
}

const AddResultForm: React.FC<AddResultFormProps> = ({ 
  onCancel,
  initialData,
  mode = 'create',
  resultId
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
    const [fileError, setFileError] = useState<string>('')
    const [dragOver, setDragOver] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        clearErrors
    } = useForm<ResultFormData>({
            resolver: zodResolver(resultSchema),
            defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            academic_session: initialData?.academic_session || '',
            semester: (initialData?.semester || 'first') as Semester,
            level: (initialData?.level || '100') as Level,
            is_published: initialData?.is_published ?? true
        }
    })

    const clearSubmitMessage = () => {
        setSubmitMessage(null)
    }

    const validateFile = (file: File): string | null => {
        if (file.size > 5 * 1024 * 1024) { 
            return 'File size must be less than 5MB';
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
            return 'Only PDF and image files are allowed';
        }

        return null;
    }

    const handleFileSelect = (file: File) => {
        const error = validateFile(file)
        if (error) {
        setFileError(error)
        return;
        }

        const url = URL.createObjectURL(file)
        const type = file.type === 'application/pdf' ? 'pdf' : 
                    file.type.startsWith('image/') ? 'image' : 'other';

        setFilePreview({ file, url, type })
        setFileError('')
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const removeFile = () => {
        if (filePreview) {
        URL.revokeObjectURL(filePreview.url)
        setFilePreview(null)
        }
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
        setFileError('')
    }

    const onSubmit : SubmitHandler<ResultFormData> = async (data) => {
        if (mode === 'create' && !filePreview) {
            setFileError('Please select a file to upload')
            return;
        }

        setSubmitMessage(null)

        try {
            const formData = new FormData()
            
            if (filePreview) {
                formData.append('file', filePreview.file)
            }

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString())
            })

            
            let response : {
              success: boolean;
              data?: Result;
              error?: string;
            }
            
            if (mode === 'edit' && resultId) {
                response = await updateResult(resultId, formData)
            } else {
                response = await createResult(formData)
            }

            if (response.success) {
                setSubmitMessage({
                    type: 'success',
                    text: mode === 'edit' ? 'Result updated successfully!' : 'Result uploaded successfully!'
                })
                
                if (mode === 'create') {
                    reset()
                    removeFile()
                }

                toast.success(mode === 'edit' ? 'Result updated successfully!' : 'Result uploaded successfully!')
                router.push("/dpt-admin/results")
                
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
    }

    return (
        <div className="min-h-screen pt-5 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto glob-px">
                <div className="py-6">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            {mode === 'edit' ? 'Edit Result' : 'Upload New Result'}
                        </h1>
                        <p className="text-gray-600 mt-1">Add academic results for students to access</p>
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
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span>Result Details</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Provide information about the result</p>
                    </div>

                    <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Result Title *
                        </label>
                        <input
                        {...register('title')}
                        type="text"
                        placeholder="e.g., First Semester Examination Results 2023/2024"
                        onChange={() => {
                            clearSubmitMessage()
                            clearErrors('title')
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                        </label>
                        <textarea
                        {...register('description')}
                        placeholder="Optional description about the result"
                        rows={4}
                        onChange={() => {
                            clearSubmitMessage()
                            clearErrors('description')
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.description.message}</span>
                        </p>
                        )}
                    </div>

                    {/* Grid for Academic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Academic Session */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Academic Session *
                        </label>
                        <input
                            {...register('academic_session')}
                            type="text"
                            placeholder="e.g., 2023/2024"
                            onChange={() => {
                                clearSubmitMessage()
                                clearErrors('academic_session')
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.academic_session ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.academic_session && (
                            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.academic_session.message}</span>
                            </p>
                        )}
                        </div>

                        {/* Semester */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            Semester *
                        </label>
                        <select
                            {...register('semester')}
                            onChange={() => {
                                clearSubmitMessage()
                                clearErrors('semester')
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.semester ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="first">First Semester</option>
                            <option value="second">Second Semester</option>
                        </select>
                        {errors.semester && (
                            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.semester.message}</span>
                            </p>
                        )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Level */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Level *
                        </label>
                        <select
                            {...register('level')}
                            onChange={() => {
                                clearSubmitMessage()
                                clearErrors('level')
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.level ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="100">100 Level</option>
                            <option value="200">200 Level</option>
                            <option value="300">300 Level</option>
                            <option value="400">400 Level</option>
                            <option value="500">500 Level</option>
                        </select>
                        {errors.level && (
                            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.level.message}</span>
                            </p>
                        )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* File Upload Section */}
                {mode === 'create' || !initialData?.file_url ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-purple-500" />
                        <span>Upload File</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Upload the result file (PDF or images)</p>
                    </div>

                    <div className="p-8">
                        {!filePreview ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                            dragOver 
                                ? 'border-blue-400 bg-blue-50' 
                                : fileError 
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${
                            dragOver ? 'text-blue-500' : fileError ? 'text-red-400' : 'text-gray-400'
                            }`} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {dragOver ? 'Drop file here' : 'Upload result file'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                            Drag and drop your file here, or click to browse
                            </p>
                            <p className="text-xs text-gray-400">
                            PDF, JPG, PNG, GIF, or WebP (max 10MB)
                            </p>
                            
                            <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileInputChange}
                            className="hidden"
                            />
                        </div>
                        ) : (
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                                {filePreview.type === 'pdf' ? (
                                <FileText className="w-8 h-8 text-red-500" />
                                ) : (
                                <ImageIcon className="w-8 h-8 text-blue-500" />
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                {filePreview.file.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                {formatFileSize(filePreview.file.size)} • {filePreview.file.type}
                                </p>
                            </div>
                            
                            <button
                                type="button"
                                onClick={removeFile}
                                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            </div>
                            
                            {filePreview.type === 'image' && (
                            <div className="relative">
                                <img
                                src={filePreview.url}
                                alt="Preview"
                                className="w-full h-64 object-contain bg-gray-100 rounded-xl"
                                />
                            </div>
                            )}
                        </div>
                        )}
                        
                        {fileError && (
                        <p className="mt-3 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{fileError}</span>
                        </p>
                        )}
                    </div>
                    </div>
                ) : (
                    /* Show existing file info for edit mode */
                    initialData.file_url && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                            <FileCheck className="w-5 h-5 text-green-500" />
                            <span>Current File</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">The existing file for this result</p>
                        </div>
                        
                        <div className="p-8">
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                            <FileText className="w-8 h-8 text-blue-500" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                                {initialData.file_name || 'Result file'}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {initialData.file_size ? formatFileSize(initialData.file_size) : 'Unknown size'}
                            </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => window.open(initialData.file_url, '_blank')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                const link = document.createElement('a')
                                link.href = initialData.file_url!;
                                link.download = initialData.file_name || 'result-file';
                                link.click()
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Replace with new file (optional)
                            </label>
                            <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Click to select a new file</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                            </div>
                        </div>
                        </div>
                    </div>
                    )
                )}

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
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{mode === 'edit' ? 'Updating...' : 'Uploading...'}</span>
                            </>
                        ) : (
                            <>
                            <Save className="w-5 h-5" />
                            <span>{mode === 'edit' ? 'Update Result' : 'Upload Result'}</span>
                            </>
                        )}
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default AddResultForm;