"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemName: string;
  accentColor?: 'blue' | 'orange';
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  itemName,
  accentColor = 'blue'
}: PaginationProps) {
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

    const colorClasses = {
        blue: {
            active: 'bg-blue-600 text-white border-blue-600',
            hover: 'hover:bg-gray-50'
        },
        orange: {
            active: 'bg-orange-600 text-white border-orange-600',
            hover: 'hover:bg-orange-50'
        }
    };

    const colors = colorClasses[accentColor];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalCount} {itemName}
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border border-gray-200 bg-white ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                        ? colors.active
                        : `bg-white text-gray-700 border-gray-200 ${colors.hover}`
                    }`}
                >
                    {page}
                </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border border-gray-200 bg-white ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}