import {
    AddPostIcon,
    ExploreIcon,
    HeartIcon,
    HomeIcon,
    InstagramTextIcon,
    MessengerIcon,
    ReelsIcon,
    UserPlusIcon,
} from '@/assets'
import UserListDialog from '@/components/Feeds/UserListDialog'
import { UserAvatar } from '@/components/UserAvatar'
import useUser, { useUsers } from '@/requests/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode, useState } from 'react'
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
    return (
        <Fragment>
            <TopNavbar />
            <footer className="fixed inset-x-0 bottom-0 z-40 flex h-12 items-center justify-evenly border-y border-y-gray-300 bg-white">
                <Link href="/" className="group rounded-full p-1">
                    <HomeIcon aria-label="Home" />
                </Link>
                <Link href="/explore" className="group rounded-full p-1">
                    <ExploreIcon aria-label="Explore" />
                </Link>
                <button className="group rounded-full p-1">
                    <ReelsIcon aria-label="Reels" />
                </button>

                <button className="group rounded-full p-1">
                    <MessengerIcon aria-label="Messenger" />
                </button>

                <UserAvatar />
            </footer>

            <div className="mb-12 mt-14">{children}</div>
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
    const { data: currentUser } = useUser()
    const { data: users, isSuccess } = useUsers(currentUser?.username ?? null)
    const [isOpen, setOpen] = useState(false)

    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
            <SettingsDialog />

            <button className="flex items-center px-2 py-0.5">
                <b>{currentUser?.username}</b>
                <HiChevronDown className="text-xl" />
            </button>

            <button onClick={() => setOpen(true)} className="rounded-full p-1">
                <UserPlusIcon aria-label="Discover People" />
            </button>
            {isSuccess ? (
                <UserListDialog
                    list={users?.map((user) => user.docId)}
                    isOpen={isOpen}
                    onClose={() => {
                        setOpen(false)
                    }}
                    title="People"
                />
            ) : null}
        </nav>
    )
}

function EditPageMobileNav({ title }: { title: string }) {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 text-sm xs:px-4">
            <Link href=".." className="rounded-full p-1">
                <HiChevronLeft className="text-2xl" aria-label="back" />
            </Link>

            <button className="px-2 py-0.5">
                <b>{title}</b>
            </button>

            <span aria-hidden></span>
        </nav>
    )
}

export default MobileLayout
