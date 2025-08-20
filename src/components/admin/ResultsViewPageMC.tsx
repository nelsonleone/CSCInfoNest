"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Image, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  File,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchResultsAction, ResultItem } from '@/actions/fetch_results.action';
import { formatFileSize } from '@/utils/helperFns/formatFile';


const getFileType = (fileName: string): 'pdf' | 'image' | 'other' => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  if (extension === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
  return 'other';
}



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

    function getLevelColor(level: string) {
        const colors: Record<string, string> = {
            '100': 'bg-blue-50 text-blue-700 border-blue-200',
            '200': 'bg-green-50 text-green-700 border-green-200',
            '300': 'bg-purple-50 text-purple-700 border-purple-200',
            '400': 'bg-orange-50 text-orange-700 border-orange-200',
            '500': 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
    }

    function getSemesterColor(semester: string) {
        return semester === 'FIRST' 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
            : 'bg-teal-50 text-teal-700 border-teal-200';
    }

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
                <div className="flex items-center space-x-2">
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

function Pagination({
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    onPageChange
}: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            const end = Math.min(totalPages, start + maxVisible - 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalCount} results
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                            currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
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
  };

  const hasActiveFilters = searchTerm || selectedLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Academic Results
                  </h1>
                  <p className="text-gray-600 font-medium">Browse and download examination results</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">
                {totalCount} result{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or course code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {[searchTerm, selectedLevel].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-600">Loading results...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 max-w-md">
                  {hasActiveFilters
                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                    : 'No academic results have been uploaded yet.'}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsViewPage;