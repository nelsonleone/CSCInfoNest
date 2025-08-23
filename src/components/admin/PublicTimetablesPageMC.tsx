"use client"

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  Timer,
  Users,
  CalendarDays,
  GraduationCap,
  BookOpen,
  FileText,
  ChevronRight
} from 'lucide-react';
import { formatFileSize } from '@/utils/helperFns/formatFile';
import Link from 'next/link';
import { GroupedTimetable, TimetableItem } from '@/actions/fetch_timetable.action';

interface PublicTimetablesPageMCProps {
  timetables: GroupedTimetable[];
}

function TimetableCard({ 
    timetable, 
    type, 
    semester 
}: { 
    timetable: TimetableItem; 
    type: 'exam' | 'lecture';
    semester: 'first' | 'second';
}) {
    const handlePreview = () => {
        window.open(timetable.file_url, '_blank')
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = timetable.file_url;
        link.download = timetable.file_name;
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getTypeColor = (scheduleType: string) => {
        return scheduleType === 'exam' 
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }

    const getSemesterColor = (sem: string) => {
        return sem === 'first' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-teal-50 text-teal-700 border-teal-200';
    }

    const getTypeIcon = (scheduleType: string) => {
        return scheduleType === 'exam' 
              ? <Timer className="w-4 h-4" />
              : <Users className="w-4 h-4" />;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex flex-col space-y-3">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-1 text-sm">
                            {timetable.title}
                        </h4>
                        {timetable.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {timetable.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(type)}`}>
                        <span className="flex items-center space-x-1">
                            {getTypeIcon(type)}
                            <span>{type === 'exam' ? 'Exam' : 'Lecture'}</span>
                        </span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSemesterColor(semester)}`}>
                        {semester} Sem
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-600">
                        <span className="font-medium">{formatFileSize(timetable.file_size)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreview}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            title="Preview"
                        >
                            <Eye className="w-3 h-3" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            title="Download"
                        >
                            <Download className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LevelSection({ groupedTimetable }: { groupedTimetable: GroupedTimetable }) {
    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            '100': 'from-blue-500 to-blue-600',
            '200': 'from-green-500 to-green-600',
            '300': 'from-purple-500 to-purple-600',
            '400': 'from-blue-500 to-blue-600',
            '500': 'from-red-500 to-red-600'
        };
        return colors[level] || 'from-gray-500 to-gray-600';
    }

    const hasTimetables = groupedTimetable.exam_first_semester || 
                         groupedTimetable.exam_second_semester || 
                         groupedTimetable.lecture_first_semester || 
                         groupedTimetable.lecture_second_semester;

    if (!hasTimetables) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${getLevelColor(groupedTimetable.level)} px-6 py-4`}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {groupedTimetable.level} Level
                        </h2>
                        <p className="text-white/80 text-sm">Academic Session 2025-2026</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Semester */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <CalendarDays className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">First Semester</h3>
                        </div>
                        
                        <div className="space-y-3">
                            {groupedTimetable.exam_first_semester && (
                                <TimetableCard 
                                    timetable={groupedTimetable.exam_first_semester} 
                                    type="exam"
                                    semester="first"
                                />
                            )}
                            {groupedTimetable.lecture_first_semester && (
                                <TimetableCard 
                                    timetable={groupedTimetable.lecture_first_semester} 
                                    type="lecture"
                                    semester="first"
                                />
                            )}
                            
                            {!groupedTimetable.exam_first_semester && !groupedTimetable.lecture_first_semester && (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No timetables available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Second Semester */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <CalendarDays className="w-5 h-5 text-teal-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Second Semester</h3>
                        </div>
                        
                        <div className="space-y-3">
                            {groupedTimetable.exam_second_semester && (
                                <TimetableCard 
                                    timetable={groupedTimetable.exam_second_semester} 
                                    type="exam"
                                    semester="second"
                                />
                            )}
                            {groupedTimetable.lecture_second_semester && (
                                <TimetableCard 
                                    timetable={groupedTimetable.lecture_second_semester} 
                                    type="lecture"
                                    semester="second"
                                />
                            )}
                            
                            {!groupedTimetable.exam_second_semester && !groupedTimetable.lecture_second_semester && (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No timetables available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PublicTimetablesPageMC({ timetables }: PublicTimetablesPageMCProps) {
    const hasAnyTimetables = timetables?.some(group => 
        group.exam_first_semester || 
        group.exam_second_semester || 
        group.lecture_first_semester || 
        group.lecture_second_semester
    );

    return (
        <div className="min-h-screen pt-28 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
            <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        Current Session Timetables
                                    </h1>
                                    <p className="text-gray-600 font-medium md:text-lg">
                                        Academic Session 2025-2026 Schedules
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {hasAnyTimetables ? (
                    <div className="space-y-8">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-2">
                                    <Timer className="w-5 h-5 text-rose-500" />
                                    <span className="text-sm font-medium text-gray-700">Exam Schedules</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {timetables.filter(g => g.exam_first_semester || g.exam_second_semester).length}
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm font-medium text-gray-700">Lecture Schedules</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {timetables.filter(g => g.lecture_first_semester || g.lecture_second_semester).length}
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-2">
                                    <GraduationCap className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Active Levels</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {timetables.length}
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-700">Session</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    2025-26
                                </p>
                            </div>
                        </div>

                        {/* Level Sections */}
                        <div className="space-y-8">
                            {timetables.map((groupedTimetable) => (
                                <LevelSection 
                                    key={groupedTimetable.level} 
                                    groupedTimetable={groupedTimetable} 
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-10 h-10 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No Current Timetables</h3>
                                <p className="text-gray-600 max-w-md">
                                    No timetables have been published for the current academic session yet. 
                                    Check back soon for updates.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}