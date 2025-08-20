export default function LoadingComponent(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">Loading Dashboard</h2>
                    <p className="text-gray-600">Fetching latest data...</p>
                </div>
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                </div>
            </div>
        </div>
    )
}