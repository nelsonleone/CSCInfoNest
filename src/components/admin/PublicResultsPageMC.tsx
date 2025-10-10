"use client"

import { useCallback } from 'react';
import {
  FileText,
  Image,
  Download,
  Eye,
  GraduationCap,
  Calendar,
  BookOpen,
  Clock,
  File,
  XCircle,
  Users
} from 'lucide-react';
import { formatFileSize, getFileType } from '@/utils/helperFns/formatFile';

// Types
type ResultItem = {
  id: string;
  title: string;
  description?: string;
  academic_session: string;
  semester: string;
  level: '100' | '200' | '300' | '400' | '500';
  course_code?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type GroupedResult = {
  level: string;
  first_semester?: ResultItem;
  second_semester?: ResultItem;
};

interface StudentResultsTableProps {
  results: GroupedResult[];
  currentSession: string;
}


const getFileIcon = (fileName: string) => {
  const fileType = getFileType(fileName);
  switch (fileType) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'image':
      return <Image className="w-5 h-5 text-green-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

interface ResultActionProps {
  result: ResultItem;
  onPreview: (result: ResultItem) => void;
  onDownload: (result: ResultItem) => void;
}

const ResultAction = ({ result, onPreview, onDownload }: ResultActionProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {getFileIcon(result.file_name)}
        <span className="font-medium truncate max-w-[150px]" title={result.file_name}>
          {result.file_name}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        {formatFileSize(result.file_size)}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPreview(result)}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
          title="Preview result"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>
        <button
          onClick={() => onDownload(result)}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-sm"
          title="Download result"
        >
          <Download className="w-3 h-3" />
          <span>Download</span>
        </button>
      </div>
      <div className="text-xs text-gray-400">
        <Clock className="w-3 h-3 inline mr-1" />
        {new Date(result.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}

const EmptyState: React.FC<{ semester: 'first' | 'second' }> = ({ semester }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <XCircle className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 font-medium">
        {semester === 'first' ? 'First' : 'Second'} Semester
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Results not uploaded yet
      </p>
    </div>
  )
}



function PublicResultsPageMC({ 
  results,
  currentSession = "2025/2026" 
}:{ results: GroupedResult[], currentSession?: string }) {
  const handlePreview = useCallback((result: ResultItem) => {
    window.open(result.file_url, '_blank');
  }, []);

  const handleDownload = useCallback((result: ResultItem) => {
    const link = document.createElement('a');
    link.href = result.file_url;
    link.download = result.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      '100': 'bg-blue-50 text-blue-700 border-blue-200',
      '200': 'bg-green-50 text-green-700 border-green-200',
      '300': 'bg-purple-50 text-purple-700 border-purple-200',
      '400': 'bg-orange-50 text-orange-700 border-orange-200',
      '500': 'bg-red-50 text-red-700 border-red-200'
    }
    return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
  }

  const totalResults = results.reduce((acc, curr) => {
    return acc + (curr.first_semester ? 1 : 0) + (curr.second_semester ? 1 : 0)
  }, 0)

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 relative">
        <div className="max-w-6xl mx-auto glob-px py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Academic Results
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Academic Session {currentSession}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  {totalResults} results available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto glob-px py-8">
        {results.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Results by Academic Level</h2>
              <p className="text-sm text-gray-600 mt-1">
                View and download examination results for each semester
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      First Semester
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Second Semester
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((levelResult) => (
                    <tr key={levelResult.level} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-6 align-top">
                        <div className="flex flex-col items-start space-y-2">
                          <span className={`px-4 py-2 text-sm font-bold rounded-full border ${getLevelColor(levelResult.level)}`}>
                            {levelResult.level} Level
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 align-top">
                        {levelResult.first_semester ? (
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">
                                {levelResult.first_semester.title}
                              </h3>
                              {levelResult.first_semester.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {levelResult.first_semester.description}
                                </p>
                              )}
                              {levelResult.first_semester.course_code && (
                                <div className="flex items-center space-x-1 mb-2">
                                  <BookOpen className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 font-medium">
                                    {levelResult.first_semester.course_code}
                                  </span>
                                </div>
                              )}
                            </div>
                            <ResultAction
                              result={levelResult.first_semester}
                              onPreview={handlePreview}
                              onDownload={handleDownload}
                            />
                          </div>
                        ) : (
                          <EmptyState semester="first" />
                        )}
                      </td>
                      <td className="px-6 py-6 align-top">
                        {levelResult.second_semester ? (
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">
                                {levelResult.second_semester.title}
                              </h3>
                              {levelResult.second_semester.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {levelResult.second_semester.description}
                                </p>
                              )}
                              {levelResult.second_semester.course_code && (
                                <div className="flex items-center space-x-1 mb-2">
                                  <BookOpen className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 font-medium">
                                    {levelResult.second_semester.course_code}
                                  </span>
                                </div>
                              )}
                            </div>
                            <ResultAction
                              result={levelResult.second_semester}
                              onPreview={handlePreview}
                              onDownload={handleDownload}
                            />
                          </div>
                        ) : (
                          <EmptyState semester="second" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
                <p className="text-gray-600 max-w-md">
                  No examination results have been published for the {currentSession} academic session yet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicResultsPageMC;