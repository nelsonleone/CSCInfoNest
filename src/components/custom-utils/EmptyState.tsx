"use client"


interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  hasActiveFilters,
  onClearFilters
}: EmptyStateProps) {
  return (
        <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
                </div>
                <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 max-w-md">{description}</p>
                </div>
                {hasActiveFilters && onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Clear Filters
                </button>
                )}
            </div>
        </div>
    )
}