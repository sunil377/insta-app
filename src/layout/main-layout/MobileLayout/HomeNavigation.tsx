import { AddPostIcon, HeartIcon, InstagramTextIcon } from '@/assets'
import useFileReader from '@/hooks/useFileReader'
import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function SelectPostImage() {
    const router = useRouter()
    const {
        state: { dataURL, error, isloading },
        handleChange,
        handleResetState,
        file,
    } = useFileReader()

    useEffect(() => {
        if (dataURL) {
            router.push('/create/details')
        }
    }, [dataURL, router])

    return (
        <label className="block w-full px-2 py-1 text-left">
            Post
            <input
                type="file"
                accept="image/*"
                className="h-0 w-0 focus:outline-none"
                onChange={handleChange}
            />
        </label>
    )
}

function HomeNavigation() {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-y border-y-gray-300 bg-white px-4">
            <Link href="/" title="Home">
                <InstagramTextIcon />
            </Link>

            <Menu as="div" className="relative ml-auto">
                <Menu.Button className="rounded-full p-1">
                    <AddPostIcon aria-label="New post" />
                </Menu.Button>

                <Menu.Items className="absolute right-1/2 z-10 w-20 translate-x-1/2 divide-y rounded-md border bg-gray-50 text-sm shadow-md">
                    <Menu.Item>
                        <SelectPostImage />
                    </Menu.Item>
                    <Menu.Item>
                        <button className="block w-full px-2 py-1 text-left">
                            Story
                        </button>
                    </Menu.Item>
                </Menu.Items>
            </Menu>

            <button className="ml-4 rounded-full p-1">
                <HeartIcon aria-label="activity" />
            </button>
        </nav>
    )
}
export default HomeNavigation
