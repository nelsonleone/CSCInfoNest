// Base types for common fields
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export type Semester = 'first' | 'second';
export type Level = '100' | '200' | '300' | '400' | '500' | string;

export interface Event extends BaseEntity {
  title: string;
  description?: string;
  date_time: string; 
  location: string;
  image_urls: string[];
  is_published: boolean;
  category?: string;
}


export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  is_published: boolean;
  priority: 'low' | 'medium' | 'high';
  expires_at?: string;
  target_audience?: string;
}

// Results
export interface Result extends BaseEntity {
  title: string;
  description?: string;
  academic_session: AcademicSession;
  semester: Semester;
  level: Level;
  file_url: string;
  file_name: string;
  file_size: number;
  is_published: boolean;
  course_code?: string;
}

export interface Timetable extends BaseEntity {
  title: string;
  description?: string;
  academic_session: AcademicSession;
  semester: Semester;
  level: Level;
  file_url: string;
  file_name: string;
  file_size: number;
  is_published: boolean;
  type: 'exam' | 'lecture';
}

export interface FileUpload {
  file: File;
  bucket: 'events' | 'results' | 'timetables';
  path: string;
}


// Query filters
export interface EventFilters {
  date_from?: string;
  date_to?: string;
  category?: string;
  is_published?: boolean;
}

export interface ResultFilters {
  academic_session?: AcademicSession;
  semester?: Semester;
  level?: Level;
  course_code?: string;
  is_published?: boolean;
}

export interface TimetableFilters {
  academic_session?: AcademicSession;
  semester?: Semester;
  level?: Level;
  type?: 'exam' | 'lecture' | 'combined';
  is_published?: boolean;
}



export interface DashboardStats {
  totalEvents: number;
  totalAnnouncements: number;
  totalResults: number;
  totalTimetables: number;
  publishedEvents: number;
  publishedAnnouncements: number;
  publishedResults: number;
  publishedTimetables: number;
  recentUploads: number;
  activeSession: string;
  totalViews: number;
  activeUsers: number;
  pendingApprovals: number;
}

export interface ActivityItem {
  id: string;
  type: 'event' | 'result' | 'announcement' | 'timetable';
  title: string;
  action: 'published' | 'uploaded' | 'created' | 'updated' | 'deleted';
  time: string;
  timestamp: Date;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ChartDataPoint {
  name: string;
  events: number;
  results: number;
  announcements: number;
  timetables: number;
  views: number;
}

export interface LevelDistribution {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface QuickMetric {
  label: string;
  value: string;
  change: number;
  trend: string;
}

export interface AdminDashboardProps {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  chartData: ChartDataPoint[];
  levelDistribution: LevelDistribution[];
  quickMetrics: QuickMetric[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onQuickAction?: (action: string) => void;
  onViewAll?: (type: string) => void;
}

export interface DashboardDataResponse {
  success: true;
  data: {
    stats: DashboardStats;
    recentActivity: ActivityItem[];
    chartData: ChartDataPoint[];
    levelDistribution: LevelDistribution[];
    quickMetrics: QuickMetric[];
  }
}

export interface DashboardErrorResponse {
  success: false;
  error: string;
}

export type DashboardResponse = DashboardDataResponse | DashboardErrorResponse;