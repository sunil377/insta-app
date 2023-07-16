import { ThreeDotIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import Link from 'next/link'
import { useState } from 'react'
import Modal, { ModalList, ModalListItem } from '../Modal'

function MenuDialog({ postId, userId }: { postId: string; userId: string }) {
    const [isOpen, setOpen] = useState(false)
    const currentUser = useAuth()

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="more info"
                className="ml-auto aspect-square rounded-full p-0.5 text-xl sm:p-2"
            >
                <ThreeDotIcon />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                className="w-full rounded-lg bg-white shadow-md sm:max-w-sm"
            >
                <ModalList>
                    {currentUser != userId ? (
                        <UnStyledFollowButton userId={userId}>
                            {(isFollowing, props) =>
                                isFollowing ? (
                                    <ModalListItem>
                                        <button
                                            className="text-red-600 transition-colors hover:text-red-800"
                                            {...props}
                                        >
                                            <b>Unfollow</b>
                                        </button>
                                    </ModalListItem>
                                ) : null
                            }
                        </UnStyledFollowButton>
                    ) : null}

                    <ModalListItem>
                        <button>Add to favorites</button>
                    </ModalListItem>

                    <ModalListItem>
                        <Link href={`/post/${postId}`}>Go to post</Link>
                    </ModalListItem>

                    <ModalListItem>
                        <button onClick={() => setOpen(false)}>Cancel</button>
                    </ModalListItem>
                </ModalList>
            </Modal>
        </>
    )
}
export default MenuDialog
