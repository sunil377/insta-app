import {
    AddPostIcon,
    ExploreIcon,
    HeartIcon,
    HomeIcon,
    InstagramTextIcon,
    MessengerIcon,
    PlaceholderImage,
    ReelsIcon,
    UserPlusIcon,
} from '@/assets'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode } from 'react'
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi'
import SettingsDialog from './SettingsDialog'

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
                    <HomeIcon aria-label="Home" />
                </Link>
                <button className="group rounded-full p-1">
                    <ExploreIcon aria-label="Explore" />
                </button>
                <button className="group rounded-full p-1">
                    <ReelsIcon aria-label="Reels" />
                </button>

                <button className="group rounded-full p-1">
                    <MessengerIcon aria-label="Messenger" />
                </button>

                <Link
                    href={`/${currentUser?.uid ?? ''}`}
                    className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                    {currentUser?.photoURL ? (
                        <Image
                            src={currentUser?.photoURL ?? PlaceholderImage.src}
                            alt={currentUser?.displayName ?? ''}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-2xl capitalize">
                            {(currentUser?.displayName ?? 'R').at(0)}
                        </div>
                    )}
                </Link>
            </footer>

            <div className="mt-14 mb-12">{children}</div>
        </Fragment>
    )
}

function HomeMobileNav() {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-y border-y-gray-300 bg-white px-4">
            <Link href="/">
                <InstagramTextIcon />
            </Link>

            <button className="group ml-auto rounded-full p-1">
                <AddPostIcon aria-label="New post" />
            </button>

            <button className="group ml-4 rounded-full p-1">
                <HeartIcon aria-label="activity" />
            </button>
        </nav>
    )
}

function ProfileMobileNav() {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
            <SettingsDialog />

            <button className="flex items-center px-2 py-0.5">
                <b>sunil.panwar.ts</b>
                <HiChevronDown className="text-xl" />
            </button>

            <button className="rounded-full p-1">
                <UserPlusIcon aria-label="Discover People" />
            </button>
        </nav>
    )
}

function EditPageMobileNav({ title }: { title: string }) {
    const router = useRouter()

    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
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
