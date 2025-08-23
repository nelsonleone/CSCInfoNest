"use client"


interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  totalCount: number;
  itemName: string;
}

export function DPTSharedPageHeader({
  icon,
  title,
  description,
  totalCount,
  itemName
}: PageHeaderProps) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {title}
                        </h1>
                        <p className="text-gray-600 font-medium">{description}</p>
                    </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium">
                    {totalCount} {itemName}{totalCount !== 1 ? 's' : ''}
                    </span>
                </div>
                </div>
            </div>
        </div>
    )
}