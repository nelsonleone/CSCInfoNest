'use server'

import { LoginAccountFormData } from '@/schema/login.schema'
import { createClient } from '@/utils/supabase/server'

export async function login(userData: LoginAccountFormData) {
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

  else {
    return { success: true }
  }
}