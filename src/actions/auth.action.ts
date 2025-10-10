'use server'

import { LoginAccountFormData } from '@/schema/login.schema'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface LoginResponse {
  error?: {
    message: string
    code?: string
  }
  success: boolean
}

export async function login(userData: LoginAccountFormData): Promise<LoginResponse> {
  try {
    const supabase = await createClient()

    const data = {
      email: userData.email,
      password: userData.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      return {
        error: {
          message: error.message || 'Invalid email or password',
          code: error.code
        },
        success: false
      }
    }

    redirect('/dpt-admin')
    
  } catch (error) {
    console.error('Login error:', error)
    return {
      error: {
        message: 'An unexpected error occurred. Please try again.'
      },
      success: false
    }
  }
}