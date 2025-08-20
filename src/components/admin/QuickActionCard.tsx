export default function QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
  badge?: string;
}> = ({ title, description, icon: Icon, color, onClick, badge }) => (
    <button
        onClick={onClick}
        className="group relative p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-left w-full overflow-hidden hover:-translate-y-0.5"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        <div className="relative">
        <div className="flex items-start justify-between">
            <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl shadow-lg shadow-${color}-500/25 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
            </div>
            {badge && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {badge}
            </span>
            )}
        </div>
        <div className="mt-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
            <span>Get started</span>
            <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </div>
        </div>
    </button>
)