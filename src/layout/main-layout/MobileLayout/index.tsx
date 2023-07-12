import { ExploreIcon, HomeIcon, MessengerIcon, UserPlusIcon } from '@/assets'
import { AlertBadge, Spinner, UserBedge } from '@/components/util'
import useUser from '@/requests/useUser'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import BackButton from './BackButton'
import HomeNavigation from './HomeNavigation'
import SettingsDialog from './SettingsDialog'

function TopNavbar() {
    const router = useRouter()

    switch (router.pathname) {
        case '/':
            return <HomeNavigation />
        case '/[id]':
            return <ProfileMobileNav />
        case '/post/[id]':
            return <EditPageMobileNav title="Post" />
        case '/post/[id]/likes':
            return <EditPageMobileNav title="Likes" />
        case '/post/[id]/comments':
            return <EditPageMobileNav title="Comments" />
        case '/accounts/edit':
            return <EditPageMobileNav title="Edit Profile" />
        case '/accounts/password/change':
            return <EditPageMobileNav title="Change Password" />
        default:
            return <HomeNavigation />
    }
}

function MobileLayout({ children }: { children: ReactNode }) {
    const { data: currentUser, isLoading, isError, error } = useUser()

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
                    <MessengerIcon aria-label="Messenger" />
                </button>

                {isLoading ? (
                    <Spinner />
                ) : isError ? (
                    <AlertBadge error={error} renderText />
                ) : (
                    <Link href={`/${currentUser.docId}`}>
                        {currentUser.profile.photo ? (
                            <Image
                                src={currentUser.profile.photo}
                                alt={currentUser.username}
                                width="24"
                                height="24"
                                className="h-6 w-6 rounded-full"
                            />
                        ) : (
                            <UserBedge className="h-6 w-6 text-base">
                                {currentUser.username.at(0)}
                            </UserBedge>
                        )}
                    </Link>
                )}
            </footer>

            <div className="mt-12 pb-12">{children}</div>
        </Fragment>
    )
}

function ProfileMobileNav() {
    const { data: currentUser } = useUser()

    return (
        <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 xs:px-4">
            <SettingsDialog />

            <button className="flex items-center px-2 py-0.5 font-semibold">
                {currentUser?.username}
                <HiChevronDown className="text-2xl" />
            </button>

            <button className="rounded-full p-1">
                <UserPlusIcon aria-label="Discover People" />
            </button>
        </nav>
    )
}

function EditPageMobileNav({ title }: { title: string }) {
    return (
        <nav className="fixed inset-x-0 top-0 z-40 h-12 border-y border-y-gray-300 bg-white px-2 xs:px-4">
            <div className="relative flex h-full items-center">
                <BackButton />
                <h2 className="mx-auto text-lg font-medium">{title}</h2>
            </div>
        </nav>
    )
}

export default MobileLayout
