import { usePost } from '@/requests/usePost'
import { Tab } from '@headlessui/react'
import { InlineLoader } from '..'
import MiniPost from '../MiniPost'

function Post({ postId }: { postId: string }) {
    const { data, status } = usePost(postId)

    switch (status) {
        case 'error':
            return (
                <div className="rounded-sm border bg-white shadow-md">
                    <div className="flex h-full items-center justify-center">
                        Something went Wrong
                    </div>
                </div>
            )
        case 'loading':
            return (
                <div className="rounded-sm border bg-white shadow-md">
                    <div className="flex h-full items-center justify-center">
                        <InlineLoader />
                    </div>
                </div>
            )
        case 'success':
            return (
                <div className="aspect-square rounded-sm border shadow-md">
                    <MiniPost {...data} />
                </div>
            )
        default:
            return null
    }
}

function TabPanel({ list, title }: { list: string[]; title: string }) {
    return (
        <Tab.Panel>
            <div className="mt-4 grid grid-cols-3 gap-x-2 px-2 pb-2">
                {list.length === 0 ? (
                    <h3 className="col-span-3 py-5 text-center text-lg">
                        No {title} Found
                    </h3>
                ) : (
                    list.map((id) => <Post key={id} postId={id} />)
                )}
            </div>
        </Tab.Panel>
    )
}
export default TabPanel
