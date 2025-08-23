export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}


export function getFileType(fileName: string): 'pdf' | 'image' | 'other' {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    return 'pdf';
  }
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image';
  }
  
  return 'other';
}



export const getLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    '100': 'bg-blue-50 text-blue-700 border-blue-200',
    '200': 'bg-green-50 text-green-700 border-green-200',
    '300': 'bg-purple-50 text-purple-700 border-purple-200',
    '400': 'bg-orange-50 text-orange-700 border-orange-200',
    '500': 'bg-red-50 text-red-700 border-red-200'
  };
  return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export const getSemesterColor = (semester: string): string => {
  return semester.toLowerCase() === 'first' 
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-teal-50 text-teal-700 border-teal-200';
}