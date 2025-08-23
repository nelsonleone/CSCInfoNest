// pages/TimetablesViewPage.tsx
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Image, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  File,
  Loader2,
  Trash2,
  Building2,
  ClockIcon,
  BookOpenCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchTimetablesAction, TimetableItem } from '@/actions/fetch_timetable.action';
import { deleteTimetable } from '@/actions/timetable_upload.action';
import { formatFileSize, getFileType, getLevelColor, getSemesterColor } from '@/utils/helperFns/formatFile';
import { DPTSharedPageHeader } from '../custom-utils/DPTSharedPageHeader';
import { SearchAndFilters } from '../custom-utils/SearchFilter';
import { Pagination } from '../custom-utils/Pagination';
import { EmptyState } from '../custom-utils/EmptyState';



function TimetableCard({ 
    timetable, 
    onPreview, 
    onDownload 
}: { 
    timetable: TimetableItem; 
    onPreview: (timetable: TimetableItem) => void; 
    onDownload: (timetable: TimetableItem) => void 
}) {
    const fileType = getFileType(timetable.file_name);
    
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

    function getTypeColor(type: string) {
        const colors: Record<string, string> = {
            'weekly': 'bg-blue-50 text-blue-700 border-blue-200',
            'exam': 'bg-red-50 text-red-700 border-red-200',
            'lecture': 'bg-green-50 text-green-700 border-green-200'
        };
        return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
    }

    function getTypeIcon(type: string) {
        switch (type) {
            case 'weekly':
                return <Calendar className="w-3 h-3" />;
            case 'exam':
                return <ClockIcon className="w-3 h-3" />;
            case 'lecture':
                return <BookOpenCheck className="w-3 h-3" />;
            default:
                return <Calendar className="w-3 h-3" />;
        }
    }

    const onDelete = async(timetable: TimetableItem) => {
      const confirmed = window.confirm("Are you sure you want to delete this timetable?");
      if (!confirmed) return;

      const { success, error } = await deleteTimetable(timetable.id);

      if (!success) {
        toast.error(error || 'Failed to delete timetable');
        return;
      } else {
        toast.success('Timetable deleted successfully');
      }
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
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {timetable.title}
                  </h3>
                  {timetable.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {timetable.description}
                      </p>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(timetable.level)}`}>
                  {timetable.level} Level
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSemesterColor(timetable.semester)}`}>
                  {timetable.semester} Semester
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(timetable.type)} flex items-center space-x-1`}>
                  {getTypeIcon(timetable.type)}
                  <span>{timetable.type.charAt(0).toUpperCase() + timetable.type.slice(1)}</span>
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-700 border-gray-200 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{timetable.academic_session}</span>
              </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{timetable.file_name}</span>
                <span>•</span>
                <span>{formatFileSize(timetable.file_size)}</span>
              </div>
              <div className="flex gap-y-4 flex-wrap items-center space-x-2">
                <button
                  onClick={() => onPreview(timetable)}
                  className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center space-x-1"
                  title="Preview"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownload(timetable)}
                  className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(timetable)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1"
                  title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 pt-2">
              <Clock className="w-3 h-3" />
              <span>Uploaded {new Date(timetable.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
}

interface TimetablesViewPageProps {
  initialData: TimetableItem[];
  initialCount: number;
}

function TimetablesViewPageMC({ initialData, initialCount }: TimetablesViewPageProps) {
  const [timetables, setTimetables] = useState<TimetableItem[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
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

  const loadTimetables = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetchTimetablesAction({
        level: selectedLevel || undefined,
        type: selectedType as "lecture" | "exam",
        search: debouncedSearchTerm || undefined,
        is_published: true,
        limit: pageSize,
        offset: (page - 1) * pageSize
      })

      if (response.success && response.data) {
        setTimetables(response.data);
        setTotalCount(response.count || 0);
        setCurrentPage(page);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, selectedType, selectedDepartment, debouncedSearchTerm, pageSize]);

  useEffect(() => {
    if (debouncedSearchTerm !== '' || selectedLevel !== '' || selectedType !== '' || selectedDepartment !== '') {
      loadTimetables(1); 
    }
  }, [selectedLevel, selectedType, selectedDepartment, debouncedSearchTerm, loadTimetables]);

  useEffect(() => {
    if (debouncedSearchTerm === '' && selectedLevel === '' && selectedType === '' && selectedDepartment === '') {
      setTimetables(initialData);
      setTotalCount(initialCount);
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedLevel, selectedType, selectedDepartment, initialData, initialCount]);

  const handlePreview = useCallback((timetable: TimetableItem) => {
    window.open(timetable.file_url, '_blank');
  }, []);

  const handleDownload = useCallback((timetable: TimetableItem) => {
    const link = document.createElement('a');
    link.href = timetable.file_url;
    link.download = timetable.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('');
    setSelectedType('');
    setSelectedDepartment('');
  };

  const handlePageChange = (page: number) => {
    loadTimetables(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = searchTerm || selectedLevel || selectedType || selectedDepartment;

  const levelOptions = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' }
  ]

  const typeOptions = [
    { value: 'exam', label: 'Exam Timetable' },
    { value: 'lecture', label: 'Lecture Schedule' }
  ]


  const additionalFilters = (
    <>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Types</option>
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <DPTSharedPageHeader
        icon={<Calendar className="w-6 h-6 text-white" />}
        title="Academic Timetables"
        description="Browse and download class schedules and exam timetables"
        totalCount={totalCount}
        itemName="timetable"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters ? true : false}
          searchPlaceholder="Search by title, description, or department..."
          filters={{
            level: {
              value: selectedLevel,
              onChange: setSelectedLevel,
              options: levelOptions
            },
            additionalFilters
          }}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-gray-600">Loading timetables...</p>
            </div>
          </div>
        ) : timetables.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {timetables.map((timetable) => (
                <TimetableCard
                  key={timetable.id}
                  timetable={timetable}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemName="timetable"
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              accentColor="orange"
            />
          </>
        ) : (
          <EmptyState
            icon={<Calendar className="w-8 h-8 text-gray-400" />}
            title="No timetables found"
            description={
              hasActiveFilters
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No timetables have been uploaded yet."
            }
            hasActiveFilters={hasActiveFilters ? true : false}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  )
}

export default TimetablesViewPageMC;