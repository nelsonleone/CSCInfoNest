"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RetryButton(){

    const router = useRouter()

    return (
        <button
            onClick={() => router.refresh()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
        >
            <RefreshCw className={`w-4 h-4`} />
            <span>Retry</span>
        </button>
    )
}