import MainLayout from '@/layout/main-layout'
import Link from 'next/link'
import { NextPageWithLayout } from './_app'

const Custom404: NextPageWithLayout = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="space-y-2 text-center text-sm">
                <p>Page Not Found 404</p>
                <Link
                    href="/"
                    className="block rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                    Back To Home
                </Link>
            </div>
        </div>
    )
}

Custom404.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Custom404
