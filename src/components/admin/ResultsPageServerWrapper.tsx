import { AlertCircle } from "lucide-react"
import RetryButton from "../custom-utils/RetryButton"
import { fetchResultsAction } from "@/actions/fetch_results.action"
import ResultsViewPage from "./ResultsViewPageMC"

function ErrorComponent({ error }: { error: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Results Page Error</h1>
                <p className="text-gray-600 mb-6">
                    Failed to load results. Please try again.
                </p>
                <div className="text-xs text-gray-400 mb-6 p-3 bg-gray-50 rounded-lg font-mono">
                    Error: {error}
                </div>
                <RetryButton />
            </div>
        </div>
    )
}

export default async function ResultsPageServerWrapper() {
    const { success, data, count, error } = await fetchResultsAction()

    if (!success || error) {
        return <ErrorComponent error={error || 'Unknown error occurred'} />
    }

    return (
        <ResultsViewPage 
            initialData={data || []} 
            initialCount={count || 0} 
        />
    )
}