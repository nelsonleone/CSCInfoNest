import BackHomeButton from '@/components/admin/BackHomeBtn';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        redirect('/dpt-admin/auth/login')
    }

    return (
        <>
            <BackHomeButton size='sm' />
            {children}
        </>
    )
}