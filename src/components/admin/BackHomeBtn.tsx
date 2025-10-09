"use client"

import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

interface BackHomeButtonProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const BackHomeButton: React.FC<BackHomeButtonProps> = ({ 
  className = '',
  variant = 'default',
  size = 'md'
}) => {

  const pathName = usePathname()
  const router = useRouter()

  const handleClick = () => {
    router.push('/dpt-admin')
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100'
      case 'outline':
        return 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  return (
    (pathName === '/dpt-admin' ||  pathName === '/dpt-admin/auth/login') ? null :
    <button
      onClick={handleClick}
      className={`
        inline-flex mb-5 mx-6 mt-32 items-center space-x-2 
        rounded-lg font-medium
        transition-all duration-200
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back Home</span>
    </button>
  )
}

export default BackHomeButton