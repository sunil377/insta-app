import { boolean_dispatch } from '@/helpers/types'
import useFileReader from '@/hooks/useFileReader'
import { useCreatePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment } from 'react'
import { HiChevronLeft } from 'react-icons/hi'
import { AlertBadge, Avatar, Spinner } from '../util'
import useCaption from './useCaption'

function CreatePostModalContent({ onClose }: { onClose: boolean_dispatch }) {
    const {
        state: { dataURL },
        handleChange,
        handleResetState,
        file,
    } = useFileReader()
    const isNextStep = !!dataURL
    const {
        data: currentUser,
        isSuccess,
        isLoading,
        isError,
        error,
    } = useUser()
    const [caption, handleCaptionChange] = useCaption()
    const mutation = useCreatePost()

    return (
        <Fragment>
            <header
                className={clsx(
                    'flex border-b px-4 py-2 dark:border-b-slate-700',
                    isNextStep ? 'justify-between' : 'justify-center',
                )}
            >
                {isNextStep ? (
                    <button onClick={handleResetState} title="back">
                        <HiChevronLeft className="text-3xl text-gray-800 dark:text-slate-200" />
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
                        className="px-0.5 text-sm font-semibold text-primary-main transition-colors hover:text-primary-dark"
                        disabled={mutation.isLoading}
                        onClick={async () => {
                            if (!file) return
                            await mutation.mutateAsync({
                                caption,
                                file,
                            })
                            onClose(false)
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
                                {isLoading ? (
                                    <Spinner />
                                ) : isError ? (
                                    <AlertBadge error={error} renderText />
                                ) : (
                                    <>
                                        <Avatar
                                            photo={currentUser.profile.photo}
                                            username={currentUser.username}
                                            size={24}
                                        />
                                        <h4 className="text-sm">
                                            {currentUser?.username}
                                        </h4>
                                    </>
                                )}
                            </div>
                            <div>
                                <textarea
                                    rows={10}
                                    className="w-full bg-gray-100 p-2 placeholder:text-sm dark:bg-slate-950"
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
                <div className="grid place-items-center gap-10 py-40">
                    <Dialog.Description className="text-xl">
                        Drag photos and videos here
                    </Dialog.Description>

                    <label className="rounded-md bg-primary-main px-3 py-1.5 text-sm font-semibold text-white focus-within:ring focus-within:ring-primary-main focus-within:ring-offset-2 dark:ring-offset-slate-900">
                        Select from computer
                        <input
                            type="file"
                            className="h-0 w-0 focus:outline-none"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </label>
                </div>
            )}
        </Fragment>
    )
}

export default CreatePostModalContent
