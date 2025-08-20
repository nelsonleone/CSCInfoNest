"use client"


import { 
  Calendar, 
  FileText, 
  Clock, 
  Eye, 
  Plus,
  Download,
  BarChart3,
  Activity,
  AlertCircle,
  Upload,
  Bell,
  MoreHorizontal,
  PieChart,
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Area, AreaChart, Pie } from 'recharts';
import type { ActivityItem, ChartDataPoint, DashboardStats, LevelDistribution, QuickMetric } from '@/types';
import { useRouter } from 'next/navigation';
import QuickActionCard from './QuickActionCard';
import ActivityItemComponent from './ActivityItem';
import StatCard from './StatCard';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';



export interface AdminDashboardProps {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  chartData: ChartDataPoint[];
  levelDistribution: LevelDistribution[];
  quickMetrics: QuickMetric[];
}



function AdminDashboard({
  stats,
  recentActivity,
  chartData,
  levelDistribution
}: AdminDashboardProps) {

    const router = useRouter()

    const logout = async () => {
        const supabase = await createClient()
        await supabase.auth.signOut()

        toast.success('Logged out successfully')
    }

    return (
        <div className="min-h-screen pt-28 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
                <div className="flex items-center flex-wrap gap-y-4 justify-between">
                <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Admin Dashboard
                        </h1>
                        <p className="text-gray-600 font-medium">Academic Session {stats.activeSession}</p>
                    </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 font-medium">Live</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <span className="text-sm text-gray-600">{stats.activeUsers} active users</span>
                    </div>
                    
                    <button className="relative p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {stats.pendingApprovals > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {stats.pendingApprovals}
                        </span>
                    )}
                    </button>
                    
                    <button
                        onClick={() => {}}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                    <Activity className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Refresh</span>
                    </button>
                    
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    icon={Calendar}
                    color="blue"
                    subtitle={`${stats.publishedEvents} published`}
                    trend="up"
                />
                <StatCard
                    title="Results Uploaded"
                    value={stats.totalResults}
                    icon={FileText}
                    color="green"
                    subtitle={`${stats.publishedResults} published`}
                    trend="up"
                />
                <StatCard
                    title="Announcements"
                    value={stats.totalAnnouncements}
                    icon={AlertCircle}
                    color="green"
                    subtitle={`${stats.publishedAnnouncements} published`}
                    trend="down"
                />
                <StatCard
                    title="Total Views"
                    value={stats.totalViews.toLocaleString()}
                    icon={Eye}
                    color="blue"
                    subtitle="This month"
                    trend="up"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        title="New Event"
                        description="Create and schedule events"
                        icon={Plus}
                        color="blue"
                        onClick={() => {}}
                    />
                    <QuickActionCard
                        title="Upload Results"
                        description="Add new academic results"
                        icon={Upload}
                        color="green"
                        onClick={() => router.push('/dpt-admin/results/upload')}
                    />
                    <QuickActionCard
                        title="Post Announcement"
                        description="Share important notices"
                        icon={AlertCircle}
                        color="blue"
                        onClick={() => {}}
                        badge={stats.pendingApprovals > 0 ? String(stats.pendingApprovals) : undefined}
                    />
                    <QuickActionCard
                        title="Manage Timetables"
                        description="Upload exam/lecture schedules"
                        icon={Clock}
                        color="teal"
                        onClick={() => {}}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Content Upload Trends</h2>
                        <p className="text-sm text-gray-500 mt-1">Monthly overview of content uploads</p>
                    </div>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                        <defs>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResults" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAnnouncements" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                        <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px', 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                        }} 
                        />
                        <Area type="monotone" dataKey="events" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEvents)" strokeWidth={3} />
                        <Area type="monotone" dataKey="results" stroke="#10b981" fillOpacity={1} fill="url(#colorResults)" strokeWidth={3} />
                        <Area type="monotone" dataKey="announcements" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAnnouncements)" strokeWidth={3} />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                        <p className="text-sm text-gray-500">Latest updates and changes</p>
                    </div>
                    <button 
                        onClick={() => {}}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                    </div>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                        {recentActivity.slice(0, 6).map(activity => (
                            <ActivityItemComponent key={activity.id} activity={activity} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Level Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                    <h2 className="text-xl font-bold text-gray-900">Results Distribution by Level</h2>
                    <p className="text-sm text-gray-500 mt-1">Academic content breakdown across levels</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={levelDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            dataKey="value"
                            stroke="none"
                        >
                            {levelDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            </Pie>
                        <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px', 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                        }} 
                        />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col justify-center space-y-6">
                        {levelDistribution.map((level) => (
                            <div key={level.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div 
                                    className="w-4 h-4 rounded-full shadow-sm" 
                                    style={{ backgroundColor: level.color }}
                                    ></div>
                                    <span className="font-medium text-gray-900">{level.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-gray-900">{level.value}</span>
                                    <span className="text-sm text-gray-500 ml-2">({level.percentage}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                <span>Logout</span>
            </button>
        </div>
        </div>
    )
}

export default AdminDashboard;