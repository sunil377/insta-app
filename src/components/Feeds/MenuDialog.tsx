import { ThreeDotIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import Link from 'next/link'
import { useState } from 'react'
import Modal from '../Modal'

function MenuDialog({ postId, userId }: { postId: string; userId: string }) {
    const [isOpen, setOpen] = useState(false)
    const currentUser = useAuth()

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="more info"
                className="ml-auto aspect-square rounded-full p-0.5 text-xl sm:p-2"
            >
                <ThreeDotIcon />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                className="w-full overflow-hidden rounded-lg bg-white shadow-md sm:max-w-sm"
            >
                <div className="divide-y divide-secondary-lighter text-center text-sm text-secondary-dark">
                    {currentUser != userId ? (
                        <UnStyledFollowButton userId={userId}>
                            {(isFollowing, props) =>
                                isFollowing ? (
                                    <button
                                        className="block w-full p-0.5 py-3 font-bold text-red-600 transition-colors hover:text-red-800 focus:outline-none focus-visible:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                                        {...props}
                                    >
                                        Unfollow
                                    </button>
                                ) : null
                            }
                        </UnStyledFollowButton>
                    ) : null}

                    <button className="block w-full py-3 focus:outline-none focus-visible:bg-gray-100">
                        Add to favorites
                    </button>

                    <Link
                        href={`/post/${postId}`}
                        className="block w-full py-3 focus:outline-none focus-visible:bg-gray-100"
                    >
                        Go to post
                    </Link>

                    <button
                        onClick={() => setOpen(false)}
                        className="block w-full py-3 text-center focus:outline-none focus-visible:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}
export default MenuDialog
