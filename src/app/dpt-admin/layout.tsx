import BackHomeButton from '@/components/admin/BackHomeBtn';

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BackHomeButton size='sm' />
            {children}
        </>
    )
}