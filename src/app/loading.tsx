export default function LoadingComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
            <div className="text-center space-y-8">
                {/* Main Loader */}
                <div className="relative w-24 h-24 mx-auto">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
                    
                    {/* Inner rotating ring - opposite direction */}
                    <div className="absolute inset-2 border-4 border-blue-400 border-t-transparent rounded-full animate-spin-reverse"></div>
                    
                    {/* Center pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Loading
                    </h2>
                    <p className="text-gray-600 text-sm max-w-xs mx-auto">
                        Please wait while we fetch your data
                    </p>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>

                {/* Subtle shimmer bar */}
                <div className="w-48 h-1 mx-auto bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent animate-shimmer"></div>
                </div>
            </div>
        </div>
    )
}