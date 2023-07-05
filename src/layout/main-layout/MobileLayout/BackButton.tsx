import { useRouter } from 'next/router'
import { HiChevronLeft } from 'react-icons/hi'

function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="absolute left-2 top-2 rounded-full"
        >
            <HiChevronLeft className="text-3xl" aria-label="back" />
        </button>
    )
}
export default BackButton
