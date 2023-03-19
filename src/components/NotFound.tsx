import Link from 'next/link'

function NotFound({ statusCode }: { statusCode: number }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="space-y-2 text-center text-sm">
                <p>Page Not Found {statusCode}</p>
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
export default NotFound
