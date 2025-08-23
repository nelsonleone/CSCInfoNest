// pages/ResultsViewPage.tsx
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Image, 
  Download, 
  Eye, 
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  File,
  Loader2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchResultsAction, ResultItem } from '@/actions/fetch_results.action';
import { formatFileSize, getFileType, getLevelColor, getSemesterColor } from '@/utils/helperFns/formatFile';
import { deleteResult } from '@/actions/result_upload.action';
import { DPTSharedPageHeader } from '../custom-utils/DPTSharedPageHeader';
import { SearchAndFilters } from '../custom-utils/SearchFilter';
import { Pagination } from '../custom-utils/Pagination';
import { EmptyState } from '../custom-utils/EmptyState';


function ResultCard({ 
  result, 
  onPreview, 
  onDownload 
}: { 
  result: ResultItem; 
  onPreview: (result: ResultItem) => void; 
  onDownload: (result: ResultItem) => void 
}) {
  const fileType = getFileType(result.file_name)
  
  function getFileIcon() {
      switch (fileType) {
          case 'pdf':
              return <FileText className="w-6 h-6 text-red-500" />;
          case 'image':
              return <Image className="w-6 h-6 text-green-500" />;
          default:
              return <File className="w-6 h-6 text-gray-500" />;
      }
  }

  const onDelete = async(result: ResultItem) => {
    const confirmed = window.confirm("Are you sure you want to delete this result?")
    if (!confirmed) return;

    const { success, error } = await deleteResult(result.id)

    if (!success) {
      toast.error(error || 'Failed to delete result')
      return;
    } else {
      toast.success('Result deleted successfully')
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {result.title}
                </h3>
                {result.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {result.description}
                    </p>
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(result.level)}`}>
                {result.level} Level
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSemesterColor(result.semester)}`}>
                {result.semester} Semester
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-700 border-gray-200 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{result.academic_session}</span>
            </span>
            {result.course_code && (
                <span className="px-3 py-1 text-xs font-medium rounded-full border bg-amber-50 text-amber-700 border-amber-200 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{result.course_code}</span>
                </span>
            )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{result.file_name}</span>
              <span>•</span>
              <span>{formatFileSize(result.file_size)}</span>
            </div>
            <div className="flex gap-y-4 flex-wrap items-center space-x-2">
              <button
                onClick={() => onPreview(result)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                title="Preview"
              >
                  <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDownload(result)}
                className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(result)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1"
                title="Delete"
              >
                  <Trash2 className="w-4 h-4" />
              </button>
            </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500 pt-2">
            <Clock className="w-3 h-3" />
            <span>Uploaded {new Date(result.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

interface ResultsViewPageProps {
  initialData: ResultItem[];
  initialCount: number;
}

function ResultsViewPage({ initialData, initialCount }: ResultsViewPageProps) {
  const [results, setResults] = useState<ResultItem[]>(initialData)
  const [totalCount, setTotalCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
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

  const loadResults = useCallback(async (page: number = 1) => {
    setLoading(true)
    try {
      const response = await fetchResultsAction({
        level: selectedLevel || undefined,
        search: debouncedSearchTerm || undefined,
        is_published: true,
        limit: pageSize,
        offset: (page - 1) * pageSize
      })

      if (response.success && response.data) {
        setResults(response.data)
        setTotalCount(response.count || 0)
        setCurrentPage(page)
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }, [selectedLevel, debouncedSearchTerm, pageSize])

  useEffect(() => {
    if (debouncedSearchTerm !== '' || selectedLevel !== '') {
      loadResults(1) 
    }
  }, [selectedLevel, debouncedSearchTerm, loadResults])

  useEffect(() => {
    if (debouncedSearchTerm === '' && selectedLevel === '') {
      setResults(initialData)
      setTotalCount(initialCount)
      setCurrentPage(1)
    }
  }, [debouncedSearchTerm, selectedLevel, initialData, initialCount])

  const handlePreview = useCallback((result: ResultItem) => {
    window.open(result.file_url, '_blank')
  }, [])

  const handleDownload = useCallback((result: ResultItem) => {
    const link = document.createElement('a')
    link.href = result.file_url;
    link.download = result.file_name;
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('')
  };

  const handlePageChange = (page: number) => {
    loadResults(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasActiveFilters = searchTerm || selectedLevel;

  const levelOptions = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <DPTSharedPageHeader
        icon={<GraduationCap className="w-6 h-6 text-white" />}
        title="Academic Results"
        description="Browse and download examination results"
        totalCount={totalCount}
        itemName="result"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters ? true : false}
          searchPlaceholder="Search by title, description, or course code..."
          filters={{
            level: {
              value: selectedLevel,
              onChange: setSelectedLevel,
              options: levelOptions
            }
          }}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-600">Loading results...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemName="result"
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-gray-400" />}
            title="No results found"
            description={
              hasActiveFilters
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No academic results have been uploaded yet."
            }
            hasActiveFilters={hasActiveFilters ? true : false}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  )
}

export default ResultsViewPage;