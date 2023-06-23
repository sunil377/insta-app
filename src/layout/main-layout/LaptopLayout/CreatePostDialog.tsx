import { filterImage } from '@/assets'
import { AlertMessage, InlineLoader } from '@/components'
import ConfirmDialog from '@/components/ConfirmDialog'
import UserAvatar from '@/components/UserAvatar'
import { useUser } from '@/context/UserContext'
import useFileReader from '@/hooks/useFileReader'
import { createpost } from '@/services/post'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'

const FILTER_OPTIONS = [
    'Original',
    'Warm',
    'Blur',
    'Low Contrast',
    'Med Contrast',
    'High Contrast',
]

function getFilterClasses(activeFilter: string) {
    switch (activeFilter) {
        case 'Warm':
            return 'sepia'
        case 'Blur':
            return 'blur-sm'
        case 'Low Contrast':
            return 'contrast-50'
        case 'Med Constast':
            return 'constast-125'
        case 'Hight Constrast':
            return 'constrast-150'
        default:
            return ''
    }
}

function CreatePostDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [isConfirmModalOpen, setConfirmModelOpen] = useState(false)
    const [isFilterActive, setFilter] = useState(false)
    const [activeFIlter, setActiveFilter] = useState(FILTER_OPTIONS[0])
    const [isCaptionStepActive, setCaptionStep] = useState(false)
    const [caption, setCaption] = useState('')
    const currentUser = useUser()
    const [err, setErr] = useState('')

    const {
        state: { dataURL, error, isloading },
        handleChange,
        handleResetState,
    } = useFileReader()

    async function handleSubmitPost() {
        try {
            if (!dataURL) return
            await createpost({
                caption,
                userId: currentUser.docId,
                photo: dataURL,
            })
            onClose()
        } catch (err) {
            setErr((err as Error).message)
            console.log(err)
        }
    }

    const content = !dataURL ? (
        <Fragment>
            <Dialog.Title className="border-b py-1.5 text-center text-base font-semibold">
                Create New Post
            </Dialog.Title>
            <div className="grid basis-full place-items-center">
                <div className="text-center">
                    <Dialog.Description className="text-xl">
                        Drag photos and videos here
                    </Dialog.Description>
                    <label className="mt-4 inline-block rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white focus-within:ring focus-within:ring-blue-500 focus-within:ring-offset-2">
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
        </Fragment>
    ) : (
        <Fragment>
            <header className="flex justify-between border-b bg-white px-3 py-1.5">
                <button
                    onClick={() => {
                        isCaptionStepActive
                            ? setCaptionStep(false)
                            : isFilterActive
                            ? setFilter(false)
                            : handleResetState()
                    }}
                >
                    <HiChevronLeft
                        aria-label="back"
                        className="text-2xl text-gray-800"
                    />
                </button>

                <Dialog.Title className="text-base font-semibold">
                    {isCaptionStepActive
                        ? 'Create new Post'
                        : isFilterActive
                        ? 'Edit'
                        : 'Crop'}
                </Dialog.Title>
                <button
                    className="px-0.5 text-sm font-semibold text-blue-500 hover:text-gray-800"
                    onClick={() =>
                        isCaptionStepActive
                            ? handleSubmitPost()
                            : isFilterActive
                            ? setCaptionStep(true)
                            : setFilter(true)
                    }
                >
                    Next
                </button>
            </header>
            <div className="grid basis-full auto-cols-fr grid-flow-col overflow-y-auto">
                <div className="self-center">
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                    <img
                        src={dataURL}
                        className={getFilterClasses(activeFIlter)}
                    />
                </div>

                {!isCaptionStepActive && isFilterActive && (
                    <div className="overflow-y-auto p-4">
                        <div className="grid grid-cols-3 gap-3.5">
                            {FILTER_OPTIONS.map((arg) => (
                                <button
                                    key={arg}
                                    className="flex h-32 flex-col items-center gap-1 rounded-md text-sm"
                                    onClick={() => setActiveFilter(arg)}
                                >
                                    <span className="block w-full basis-full">
                                        <Image
                                            src={filterImage}
                                            alt={arg}
                                            className={clsx(
                                                'mx-auto rounded-md filter',
                                                activeFIlter === arg &&
                                                    'ring-4 ring-blue-500',
                                                getFilterClasses(arg),
                                            )}
                                        />
                                    </span>

                                    <span
                                        className={clsx(
                                            activeFIlter === arg &&
                                                'font-semibold text-blue-500',
                                        )}
                                    >
                                        {arg}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isCaptionStepActive && (
                    <div className="p-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <UserAvatar />
                                <span className="text-sm">
                                    {currentUser.profile.fullname}
                                </span>
                            </div>
                            <div>
                                <textarea
                                    rows={10}
                                    className="w-full bg-gray-100 p-2 placeholder:text-sm"
                                    placeholder="Write a caption..."
                                    maxLength={2000}
                                    value={caption}
                                    onChange={(e) =>
                                        setCaption((prev) =>
                                            e.target.value.length <= 20
                                                ? e.target.value
                                                : prev,
                                        )
                                    }
                                ></textarea>
                                <div className="text-right text-xs">
                                    <span>{caption.length}/2000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    )

    return (
        <Fragment>
            {!!dataURL && (
                <ConfirmDialog
                    isOpen={isConfirmModalOpen}
                    onCancel={() => setConfirmModelOpen(false)}
                    onClose={() => {
                        handleResetState()
                        setConfirmModelOpen(false)
                        onClose()
                    }}
                />
            )}
            {!!error && <div></div>}
            <Transition
                enter="transition duration-300 ease-in"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                show={isOpen}
                as={Fragment}
            >
                <Dialog
                    static
                    onClose={() =>
                        !!dataURL ? setConfirmModelOpen(true) : onClose()
                    }
                    className="fixed inset-0 z-dialog grid place-items-center"
                >
                    <div className="absolute inset-0 bg-overlay" />
                    <Dialog.Panel
                        className={clsx(
                            'absolute flex h-[min(30rem,100vh-2rem)] flex-col overflow-auto rounded-xl border bg-white drop-shadow-xl transition-all duration-500',
                            isFilterActive
                                ? 'w-[min(48rem,100vw-2rem)]'
                                : 'w-[min(28rem,100vw-2rem)]',
                        )}
                    >
                        {isloading ? (
                            <div className="grid h-full w-full place-items-center">
                                <InlineLoader />
                            </div>
                        ) : (
                            content
                        )}
                    </Dialog.Panel>
                </Dialog>
            </Transition>
            <AlertMessage message={error} onReset={handleResetState} />
        </Fragment>
    )
}

export default CreatePostDialog
