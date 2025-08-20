export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: string;
    subtitle?: string;
}) {
    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
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
                </div>
            </div>
        </div>
    );
}
