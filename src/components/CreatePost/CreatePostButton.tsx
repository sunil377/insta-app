import { AddPostIcon } from '@/assets'
import useFileReader from '@/hooks/useFileReader'
import ToolTip from '@/layout/main-layout/LaptopLayout/Tooltip'
import { useCreatePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'
import Modal from '../Modal'
import { UserAvatar } from '../UserAvatar'
import useCaption from './useCaption'

function Content({ onClose }: { onClose: () => void }) {
    const {
        state: { dataURL, error, isloading },
        handleChange,
        handleResetState,
        file,
    } = useFileReader()
    const isNextStep = !!dataURL
    const { data: currentUser, isSuccess } = useUser()
    const [caption, handleCaptionChange] = useCaption()
    const mutation = useCreatePost()

    return (
        <Fragment>
            <header
                className={clsx(
                    'flex border-b px-4 py-2',
                    isNextStep ? 'justify-between' : 'justify-center',
                )}
            >
                {isNextStep ? (
                    <button onClick={handleResetState} title="back">
                        <HiChevronLeft className="text-2xl text-gray-800" />
                    </button>
                ) : null}

                <Dialog.Title
                    as="h2"
                    className="text-center text-base font-semibold"
                >
                    Create New Post
                </Dialog.Title>

                {isNextStep && isSuccess ? (
                    <button
                        className="px-0.5 text-sm font-semibold text-primary-main hover:text-primary-dark disabled:pointer-events-none disabled:opacity-50"
                        disabled={mutation.isLoading}
                        onClick={async () => {
                            if (!file) return
                            await mutation.mutateAsync({
                                caption,
                                file,
                            })
                            onClose()
                        }}
                    >
                        {mutation.isLoading ? 'Posting...' : 'Share'}
                    </button>
                ) : null}
            </header>
            {isNextStep ? (
                <div className="grid w-full grid-cols-2">
                    <div className="relative aspect-square bg-black">
                        <Image
                            src={dataURL}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <UserAvatar />
                                <span className="text-sm">
                                    {currentUser?.username}
                                </span>
                            </div>
                            <div>
                                <textarea
                                    rows={10}
                                    className="w-full bg-gray-100 p-2 placeholder:text-sm"
                                    placeholder="Write a caption..."
                                    maxLength={2000}
                                    value={caption}
                                    onChange={handleCaptionChange}
                                />
                                <div className="text-right text-xs">
                                    <span>{caption.length}/2000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid place-items-center py-40">
                    <div className="text-center">
                        <Dialog.Description className="text-xl">
                            Drag photos and videos here
                        </Dialog.Description>

                        <label className="mt-4 inline-block rounded-md bg-primary-main px-3 py-1.5 text-sm font-semibold text-white focus-within:ring focus-within:ring-primary-main focus-within:ring-offset-2">
                            Select from computer
                            <input
                                type="file"
                                className="h-0 w-0 focus:outline-none"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

function CreatePost({ isDrawerOpen }: { isDrawerOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Fragment>
            <button
                onClick={() => setIsOpen(true)}
                className={clsx(
                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                    {
                        'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                            !isDrawerOpen,
                    },
                )}
            >
                <AddPostIcon
                    aria-label="Create"
                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                />

                <ToolTip isOpen={isDrawerOpen}>Create</ToolTip>
            </button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-md"
            >
                <Content onClose={() => setIsOpen(false)} />
            </Modal>
        </Fragment>
    )
}
export default CreatePost
