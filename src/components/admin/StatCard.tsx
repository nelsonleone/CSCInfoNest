import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    href,
    linkText = "View All"
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: string;
    subtitle?: string;
    href: string;
    linkText?: string;
}) {
    return (
        <Link href={href} className="block group">
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 shadow-lg shadow-${color}-500/25`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                                {subtitle && (
                                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                            <span className="font-medium">{linkText}</span>
                            <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                    
                    <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
            </div>
        </Link>
    )
}