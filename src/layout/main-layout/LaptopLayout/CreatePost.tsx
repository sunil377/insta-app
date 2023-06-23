import { AddPostIcon } from '@/assets'
import { InlineLoader } from '@/components'
import clsx from 'clsx'
import { Fragment, Suspense, lazy, useState } from 'react'
import ToolTip from './Tooltip'

const CreatePostDialog = lazy(() => import('./CreatePostDialog'))

function CreatePost({ isDrawerOpen }: { isDrawerOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Fragment>
            <button
                onClick={() => setIsOpen(true)}
                className={clsx(
                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 outline',
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

            <Suspense
                fallback={
                    <div className="left-1/2 top-1/2 z-50 flex">
                        <InlineLoader />
                    </div>
                }
            >
                <CreatePostDialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            </Suspense>
        </Fragment>
    )
}
export default CreatePost
