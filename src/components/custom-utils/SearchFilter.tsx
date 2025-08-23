"use client"

import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  searchPlaceholder: string;
  filters: {
    level: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
    };
    additionalFilters?: React.ReactNode;
  };
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters,
  searchPlaceholder,
  filters
}: SearchAndFiltersProps) {
    const activeFilterCount = [
        searchTerm,
        filters.level.value,
    ].filter(Boolean).length;

    return (
        <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            </div>

            <button
            onClick={onToggleFilters}
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
                {activeFilterCount}
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
                    value={filters.level.value}
                    onChange={(e) => filters.level.onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Levels</option>
                    {filters.level.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
                
                {filters.additionalFilters}
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end">
                <button
                    onClick={onClearFilters}
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
    )
}
