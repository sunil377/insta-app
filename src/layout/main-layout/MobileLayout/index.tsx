import {
    ExploreIcon,
    HomeIcon,
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
import HomeNavigation from './HomeNavigation'
import SettingsDialog from './SettingsDialog'

function TopNavbar() {
    const router = useRouter()

    switch (router.pathname) {
        case '/':
            return <HomeNavigation />
        case '/[id]':
            return <ProfileMobileNav />
        case '/accounts/edit':
            return <EditPageMobileNav title="Edit Profile" />
        case '/accounts/password/change':
            return <EditPageMobileNav title="Change Password" />
        default:
            return <HomeNavigation />
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

function ProfileMobileNav() {
    const { data: currentUser } = useUser()
    const { data: users, isSuccess } = useUsers(currentUser?.username ?? null)
    const [isOpen, setOpen] = useState(false)

    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 xs:px-4">
            <SettingsDialog />

            <button className="flex items-center px-2 py-0.5 font-semibold">
                {currentUser?.username}
                <HiChevronDown className="text-2xl" />
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
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 xs:px-4">
            <Link href=".." className="rounded-full">
                <HiChevronLeft className="text-3xl" aria-label="back" />
            </Link>

            <button className="px-2 py-0.5 font-semibold">{title}</button>

            <span aria-hidden></span>
        </nav>
    )
}

export default MobileLayout
