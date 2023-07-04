import Link from 'next/link'
import { HiChevronLeft } from 'react-icons/hi'

function PostNavigation({ ...props }) {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 h-12 border-y border-y-gray-300 bg-white px-2 xs:px-4">
            <div className="relative flex h-full items-center">
                <Link href=".." className="rounded-full">
                    <HiChevronLeft className="text-3xl" aria-label="back" />
                </Link>
                <h2 className="mx-auto -translate-x-1/2 text-lg font-medium">
                    Post
                </h2>
            </div>
        </nav>
    )
}
export default PostNavigation
