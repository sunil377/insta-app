import { parseUnkownErrorToString } from '@/helpers/util'
import { usePost } from '@/requests/usePost'
import { Tab } from '@headlessui/react'
import MiniPost from '../MiniPost'
import { Spinner } from '../util'

function Post({ postId }: { postId: string }) {
    const { data, error, isLoading, isError } = usePost(postId)

    return (
        <div className="aspect-square rounded-sm border shadow-md dark:border-zinc-700">
            {isLoading ? (
                <div className="flex h-full items-center justify-center">
                    <Spinner />
                </div>
            ) : isError ? (
                <div className="flex h-full items-center justify-center">
                    {parseUnkownErrorToString(error)}
                </div>
            ) : (
                <MiniPost {...data} />
            )}
        </div>
    )
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
