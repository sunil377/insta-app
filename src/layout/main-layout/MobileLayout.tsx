import {
    AddPostIcon,
    ExploreIcon,
    HeartIcon,
    HomeIcon,
    InstagramTextIcon,
    MessengerIcon,
    PlaceholderImage,
    ReelsIcon,
    SettingsIcon,
    UserPlusIcon,
} from '@/assets'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode } from 'react'
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi'

function TopNavbar() {
    const router = useRouter()

    switch (router.pathname) {
        case '/':
            return <HomeMobileNav />
        case '/[id]':
            return <ProfileMobileNav />
        case '/accounts/edit':
            return <EditPageMobileNav title="Edit Profile" />
        case '/accounts/password/change':
            return <EditPageMobileNav title="Change Password" />
        default:
            return <HomeMobileNav />
    }
}

function MobileLayout({ children }: { children: ReactNode }) {
    const currentUser = useAuth()

    return (
        <Fragment>
            <TopNavbar />
            <footer className="fixed inset-x-0 bottom-0 z-40 flex h-12 items-center justify-evenly border-y border-y-gray-300 bg-white">
                <Link href="/" className="group rounded-full p-1">
                    <HomeIcon
                        aria-label="Home"
                        className="scale-90 transform group-hover:scale-100"
                    />
                </Link>
                <button className="group rounded-full p-1">
                    <ExploreIcon
                        aria-label="Explore"
                        className="scale-90 transform group-hover:scale-100"
                    />
                </button>
                <button className="group rounded-full p-1">
                    <ReelsIcon
                        aria-label="Reels"
                        className="scale-90 transform group-hover:scale-100"
                    />
                </button>
                <button className="group rounded-full p-1">
                    <AddPostIcon
                        aria-label="New post"
                        className="scale-90 transform group-hover:scale-100"
                    />
                </button>
                <button className="group rounded-full p-1">
                    <MessengerIcon
                        aria-label="Messenger"
                        className="scale-90 transform group-hover:scale-100"
                    />
                </button>

                <Link
                    href={`/${currentUser?.uid ?? ''}`}
                    className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                    <Image
                        src={currentUser?.photoURL ?? PlaceholderImage.src}
                        alt={currentUser?.displayName ?? ''}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                    />
                </Link>
            </footer>

            <div className="mb-12 mt-12 xs:mt-14">{children}</div>
        </Fragment>
    )
}

function HomeMobileNav() {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-10 items-center border-y border-y-gray-300 bg-white px-2 xs:h-14 xs:px-4">
            <Link href="/">
                <InstagramTextIcon />
            </Link>

            <input
                type="text"
                className="ml-auto rounded-md bg-gray-200 py-1 px-3"
            />

            <button className="group ml-4 rounded-full p-1">
                <HeartIcon
                    aria-label="activity"
                    className="scale-90 transform group-hover:scale-100"
                />
            </button>
        </nav>
    )
}

function ProfileMobileNav() {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
            <Link href="/" className="rounded-full p-1">
                <SettingsIcon aria-label="settings" />
            </Link>

            <button className="flex items-center px-2 py-0.5">
                <b>sunil.panwar.ts</b>
                <HiChevronDown className="text-xl" />
            </button>

            <button className="rounded-full p-1">
                <UserPlusIcon
                    aria-label="Discover People"
                    className="scale-90 transform group-hover:scale-100"
                />
            </button>
        </nav>
    )
}

function EditPageMobileNav({ title }: { title: string }) {
    const router = useRouter()

    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
            <button className="rounded-full p-1" onClick={() => router.back()}>
                <HiChevronLeft className="text-2xl" aria-label="back" />
            </button>

            <button className="px-2 py-0.5">
                <b>{title}</b>
            </button>

            <span aria-hidden></span>
        </nav>
    )
}

export default MobileLayout
