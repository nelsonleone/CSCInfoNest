import { ActivityItem as ActivityItemType } from "@/types";
import { Activity, AlertCircle, Calendar, Clock, FileText, MoreHorizontal } from "lucide-react";

export default function ActivityItem({ activity }: { activity: ActivityItemType }) {
    const getIcon = (type: string) => {
        const iconClass = "w-4 h-4";
        switch (type) {
            case 'event': return <Calendar className={`${iconClass} text-blue-500`} />;
            case 'result': return <FileText className={`${iconClass} text-green-500`} />;
            case 'announcement': return <AlertCircle className={`${iconClass} text-amber-500`} />;
            case 'timetable': return <Clock className={`${iconClass} text-purple-500`} />;
            default: return <Activity className={`${iconClass} text-gray-500`} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-green-50 text-green-700 border-green-200';
            case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'error': return 'bg-red-50 text-red-700 border-red-200';
            case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="group flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(activity.status)}`}>
                        {activity.action}
                    </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.user && (
                        <>
                            <span className="text-xs text-gray-300">•</span>
                            <p className="text-xs text-gray-500">by {activity.user}</p>
                        </>
                    )}
                </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-200 transition-all duration-200">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
        </div>
    );
}
