import { AlertCircle } from "lucide-react";
import RetryButton from "../custom-utils/RetryButton";
import { dashboardActions } from "@/actions/dashboard.action";
import AdminDashboard from "./AdminPanelMC";


function ErrorComponent({ error }:  { error: string }){
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
                <p className="text-gray-600 mb-6">
                    Failed to load dashboard data. Please try again.
                </p>
                <div className="text-xs text-gray-400 mb-6 p-3 bg-gray-50 rounded-lg font-mono">
                    Error: {error}
                </div>
                <RetryButton />
            </div>
        </div>
    )
}

export async function getDashboardData() {
    try {
        const [stats, recentActivity, analyticsData, quickMetrics] = await Promise.all([
            dashboardActions.fetchDashboardStats(),
            dashboardActions.fetchRecentActivity(),
            dashboardActions.fetchAnalyticsData(),
            dashboardActions.fetchQuickMetrics()
        ]);
        

        return {
            success: true,
            data: {
                stats,
                recentActivity,
                chartData: analyticsData.chartData,
                levelDistribution: analyticsData.levelDistribution,
                quickMetrics
            }
        }
    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            data: null
        }
    }
}


export default async function AdminPanelServerWrapper(){

    const { success, data, error } = await getDashboardData()

    if (!success || !data) {
        return <ErrorComponent error={error || 'Unknown error occurred'} />
    }

    return (
        <AdminDashboard
            stats={data.stats}
            recentActivity={data.recentActivity}
            chartData={data.chartData}
            levelDistribution={data.levelDistribution}
            quickMetrics={data.quickMetrics}
        />
    )
}