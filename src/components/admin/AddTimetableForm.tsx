"use client"


import { useState, useRef, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Layout,
  GraduationCap,
  FileSpreadsheet,
  Download,
  Sparkles
} from 'lucide-react';
import type { Timetable, Semester, Level } from '@/types';
import { createTimetable, updateTimetable } from '@/actions/timetable_upload.action';
import { useRouter } from 'next/navigation';
import { TimetableFormData, timetableSchema } from '@/schema/timetable.schema';
import { formatFileSize } from '@/utils/helperFns/formatFile';


interface AddTimetableFormProps {
  onCancel?: () => void;
  initialData?: Partial<Timetable>;
  mode?: 'create' | 'edit';
  timetableId?: string;
}

interface FilePreview {
  file: File;
  url: string;
  type: 'pdf' | 'image' | 'other';
}


export default function AddTimetableForm({ 
  initialData,
  mode = 'create',
  timetableId
}: AddTimetableFormProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const [dragOver, setDragOver] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<TimetableFormData>({
        resolver: zodResolver(timetableSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            academic_session: initialData?.academic_session || '',
            semester: (initialData?.semester || 'first') as Semester,
            level: (initialData?.level || '100') as Level,
            type: (initialData?.type || 'lecture') as 'exam' | 'lecture',
            is_published: initialData?.is_published ?? true
        }
    });

    const watchType = watch('type');

    useEffect(() => {
        setMounted(true);
    }, []);

    const clearSubmitMessage = () => {
        setSubmitMessage(null);
    }

    const validateFile = (file: File): string | null => {
        if (file.size > 10 * 1024 * 1024) { 
            return 'File size must be less than 10MB';
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only PDF and image files are allowed';
        }

        return null;
    }

    const handleFileSelect = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setFileError(error);
            return;
        }

        const url = URL.createObjectURL(file);
        const type = file.type === 'application/pdf' ? 'pdf' : 
                    file.type.startsWith('image/') ? 'image' : 'other';

        setFilePreview({ file, url, type });
        setFileError('');
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }

    const removeFile = () => {
        if (filePreview) {
            URL.revokeObjectURL(filePreview.url);
            setFilePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFileError('');
    }

    const onSubmit: SubmitHandler<TimetableFormData> = async (data) => {
        if (mode === 'create' && !filePreview) {
            setFileError('Please select a file to upload');
            return;
        }

        setSubmitMessage(null);

        try {
            const formData = new FormData();
            
            if (filePreview) {
                formData.append('file', filePreview.file);
            }

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            let response: {
                success: boolean;
                data?: Timetable;
                error?: string;
            }
            
            if (mode === 'edit' && timetableId) {
                response = await updateTimetable(timetableId, formData);
            } else {
                response = await createTimetable(formData);
            }

            if (response.success) {
                    setSubmitMessage({
                    type: 'success',
                    text: mode === 'edit' ? 'Timetable updated successfully!' : 'Timetable uploaded successfully!'
                });
                
                if (mode === 'create') {
                reset();
                removeFile();
                }

                toast.success(mode === 'edit' ? 'Timetable updated successfully!' : 'Timetable uploaded successfully!');
                
                setTimeout(() => {
                router.push('/dpt-admin/timetables');
                }, 1500);
                
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
    }

    const typeConfig = {
        exam: {
            icon: FileSpreadsheet,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            gradientFrom: 'from-red-500',
            gradientTo: 'to-pink-500'
        },
        lecture: {
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-indigo-500'
        }
    }

    const currentTypeConfig = typeConfig[watchType];
    const TypeIcon = currentTypeConfig.icon;

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
            <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto glob-px">
                <div className="py-6">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">                        
                        <div className="flex items-center space-x-4">
                        <div className={`relative w-14 h-14 bg-gradient-to-br ${currentTypeConfig.gradientFrom} ${currentTypeConfig.gradientTo} rounded-xl flex items-center justify-center shadow-lg group`}>
                            <TypeIcon className="w-7 h-7 text-white" />
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                            {mode === 'edit' ? 'Edit Timetable' : 'Upload New Timetable'}
                            </h1>
                            <p className="text-gray-600 mt-1 flex items-center space-x-1">
                            <Sparkles className="w-4 h-4" />
                            <span>Organize academic schedules efficiently</span>
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto glob-px py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {submitMessage && (
                    <div className={`p-4 rounded-2xl border-2 ${
                    submitMessage.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    } shadow-sm`}>
                    <div className="flex items-center space-x-3">
                        {submitMessage.type === 'success' ? (
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        ) : (
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                        )}
                        <span className="font-medium">{submitMessage.text}</span>
                    </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                            <div className={`p-2 ${currentTypeConfig.bgColor} rounded-xl`}>
                            <Layout className={`w-5 h-5 ${currentTypeConfig.color}`} />
                            </div>
                            <span>Timetable Information</span>
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 ml-11">Provide details about the timetable</p>
                        </div>

                        <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Timetable Title *
                            </label>
                            <input
                            {...register('title')}
                            type="text"
                            placeholder="e.g., First Semester Examination Timetable 2023/2024"
                            onChange={clearSubmitMessage}
                            className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                                errors.title ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            />
                            {errors.title && (
                            <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.title.message}</span>
                            </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Description
                            </label>
                            <textarea
                            {...register('description')}
                            placeholder="Optional description about the timetable..."
                            rows={4}
                            onChange={clearSubmitMessage}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                            />
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Timetable Type *
                            </label>
                            <div className="flex flex-wrap gap-4">
                            {(['lecture', 'exam'] as const).map((type) => {
                                const config = typeConfig[type];
                                const Icon = config.icon;
                                const isSelected = watchType === type;
                                
                                return (
                                <label
                                    key={type}
                                    className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    isSelected
                                        ? `${config.borderColor} ${config.bgColor} shadow-md`
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        {...register('type')}
                                        type="radio"
                                        value={type}
                                        className="sr-only"
                                    />
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                    isSelected ? config.bgColor : 'bg-gray-100'
                                    }`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? config.color : 'text-gray-500'}`} />
                                    </div>
                                    <div className="ml-3">
                                    <div className={`font-medium ${isSelected ? config.color : 'text-gray-900'}`}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {type === 'lecture' ? 'Class schedules' : 'Exam schedules'}
                                    </div>
                                    </div>
                                </label>
                                );
                            })}
                            </div>
                        </div>

                        {/* Academic Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Academic Session */}
                            <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Academic Session *
                            </label>
                            <input
                                {...register('academic_session')}
                                type="text"
                                placeholder="e.g., 2023-2024"
                                onChange={clearSubmitMessage}
                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                                errors.academic_session ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                            {errors.academic_session && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.academic_session.message}</span>
                                </p>
                            )}
                            </div>

                            {/* Semester */}
                            <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Semester *
                            </label>
                            <select
                                {...register('semester')}
                                onChange={clearSubmitMessage}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-gray-900 hover:border-gray-300"
                            >
                                <option value="first">First Semester</option>
                                <option value="second">Second Semester</option>
                            </select>
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                            <GraduationCap className="w-4 h-4 inline mr-2" />
                            Academic Level *
                            </label>
                            <select
                            {...register('level')}
                            onChange={clearSubmitMessage}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-gray-900 hover:border-gray-300"
                            >
                            <option value="100">100 Level</option>
                            <option value="200">200 Level</option>
                            <option value="300">300 Level</option>
                            <option value="400">400 Level</option>
                            <option value="500">500 Level</option>
                            </select>
                        </div>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    {mode === 'create' || !initialData?.file_url ? (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <Upload className="w-5 h-5 text-purple-600" />
                            </div>
                            <span>Upload Timetable File</span>
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 ml-11">Upload the timetable document (PDF or images)</p>
                        </div>

                        <div className="p-8">
                            {!filePreview ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                                dragOver 
                                    ? 'border-blue-400 bg-blue-50/50 scale-105' 
                                    : fileError 
                                    ? 'border-red-300 bg-red-50/50'
                                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                dragOver ? 'bg-blue-100 scale-110' : fileError ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-purple-100 group-hover:scale-105'
                                }`}>
                                <Upload className={`w-10 h-10 transition-colors ${
                                    dragOver ? 'text-blue-500' : fileError ? 'text-red-400' : 'text-gray-400 group-hover:text-purple-500'
                                }`} />
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {dragOver ? 'Drop your file here' : 'Upload timetable file'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                Drag and drop your file here, or click to browse
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4" />
                                    <span>PDF</span>
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center space-x-1">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Images</span>
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Max 5MB</span>
                                </div>
                                
                                <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                                />
                            </div>
                            ) : (
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border-2 border-blue-100">
                                <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm">
                                    {filePreview.type === 'pdf' ? (
                                    <FileText className="w-8 h-8 text-red-500" />
                                    ) : (
                                    <ImageIcon className="w-8 h-8 text-blue-500" />
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                                    {filePreview.file.name}
                                    </h4>
                                    <div className="flex items-center space-x-4 mt-2">
                                    <p className="text-sm text-gray-600">
                                        {formatFileSize(filePreview.file.size)}
                                    </p>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <p className="text-sm text-blue-600 font-medium">
                                        {filePreview.file.type}
                                    </p>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                </div>
                                
                                {filePreview.type === 'image' && (
                                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100">
                                    <img
                                    src={filePreview.url}
                                    alt="Preview"
                                    className="w-full h-80 object-contain bg-gradient-to-br from-gray-50 to-blue-50/30"
                                    />
                                </div>
                                )}
                            </div>
                            )}
                            
                            {fileError && (
                            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                                <p className="text-sm text-red-600 flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{fileError}</span>
                                </p>
                            </div>
                            )}
                        </div>
                        </div>
                    ) : (
                        /* Show existing file info for edit mode */
                        initialData.file_url && (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-xl">
                                <FileCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <span>Current File</span>
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 ml-11">The existing file for this timetable</p>
                            </div>
                            
                            <div className="p-8">
                            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50/50 to-blue-50/30 rounded-2xl border-2 border-green-100">
                                <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm">
                                <FileText className="w-8 h-8 text-green-500" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {initialData.file_name || 'Timetable file'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {initialData.file_size ? formatFileSize(initialData.file_size) : 'Unknown size'}
                                </p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => window.open(initialData.file_url, '_blank')}
                                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = initialData.file_url!;
                                    link.download = initialData.file_name || 'timetable-file';
                                    link.click();
                                    }}
                                    className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Replace with new file (optional)
                                </label>
                                <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300"
                                >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm text-gray-600">Click to select a new file</p>
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
                    </div>

                    <div className="p-6 space-y-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-6 py-4 bg-gradient-to-r ${currentTypeConfig.gradientFrom} ${currentTypeConfig.gradientTo} text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold`}
                        >
                            {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{mode === 'edit' ? 'Updating...' : 'Uploading...'}</span>
                            </>
                            ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>{mode === 'edit' ? 'Update Timetable' : 'Upload Timetable'}</span>
                            </>
                            )}
                        </button>
                    </div>
                </div>
                </form>
            </div>
        </div>
        </div>
    )
}