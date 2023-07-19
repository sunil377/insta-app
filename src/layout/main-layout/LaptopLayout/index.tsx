import {
    AddPostIcon,
    ExploreIcon,
    HomeIcon,
    InstagramTextIcon,
    InstaIcon,
    MenuIcon,
    MessengerIcon,
    MoonIcon,
    SavedIcon,
    SearchIcon,
    SettingsIcon,
} from '@/assets'
import CreatePostModalContent from '@/components/CreatePost/CreatePostButton'
import Modal from '@/components/Modal'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import { useTheme } from '@/context/ThemeContext'
import useLogout from '@/hooks/useLogout'
import useUser from '@/requests/useUser'
import { Menu, Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment, ReactNode, useState } from 'react'
import SearchContent from './SearchContent'

function LaptopLayout({ children }: { children: ReactNode }) {
    const { data: currentUser, isError, isLoading, error } = useUser()
    const [isModalOpen, setModal] = useState(false)
    const handleLogOut = useLogout()
    const { setDarkTheme } = useTheme()

    return (
        <>
            <Popover>
                {({ open: isPopoverOpen }) => (
                    <nav
                        className={clsx(
                            { 'lg:w-56': !isPopoverOpen },
                            'fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-r-gray-300 bg-white px-2 py-4 text-gray-800 transition-all dark:border-r-gray-900 dark:bg-black dark:text-white',
                        )}
                    >
                        <Link
                            href="/"
                            className={clsx(
                                {
                                    'lg:w-full lg:justify-start':
                                        !isPopoverOpen,
                                },
                                'group flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                            )}
                            title="Instagram"
                        >
                            <InstaIcon
                                className={clsx(
                                    { 'lg:hidden': !isPopoverOpen },
                                    'transform transition-transform group-hover:scale-110',
                                )}
                            />
                            <InstagramTextIcon
                                className={clsx(
                                    { 'lg:inline-block': !isPopoverOpen },
                                    'ml-3 hidden',
                                )}
                            />
                        </Link>

                        <Transition as={Fragment} show={isPopoverOpen}>
                            <div className="fixed inset-y-0 left-16 z-30">
                                <Transition.Child
                                    enter="duration-300 ease-linear"
                                    enterFrom="-translate-x-80 opacity-50"
                                    enterTo="translate-x-0 opacity-100"
                                    leave="duration-200 ease-linear"
                                    leaveFrom="translate-x-0 opacity-100"
                                    leaveTo="-translate-x-80 opacity-50"
                                    as={Fragment}
                                >
                                    <Popover.Panel
                                        static
                                        className="h-full w-64 origin-left border border-l-0 bg-white dark:border-gray-900 dark:bg-black dark:text-white"
                                    >
                                        <SearchContent />
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition>

                        <div className="mt-5 flex flex-col space-y-2 text-sm">
                            <Link
                                href="/"
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full lg:gap-x-4':
                                            isPopoverOpen,
                                    },
                                    'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Home"
                                >
                                    <HomeIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>
                                <div
                                    className={clsx(
                                        { 'lg:block': !isPopoverOpen },
                                        'hidden',
                                    )}
                                >
                                    Home
                                </div>
                                <div
                                    className={clsx(
                                        { 'lg:hidden': !isPopoverOpen },
                                        'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                    )}
                                >
                                    Home
                                </div>
                            </Link>

                            <Popover.Button
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full lg:gap-x-4':
                                            isPopoverOpen,
                                    },
                                    'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Search"
                                >
                                    <SearchIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>
                                <div
                                    className={clsx(
                                        { 'lg:block': !isPopoverOpen },
                                        'hidden',
                                    )}
                                >
                                    Search
                                </div>
                                <div
                                    className={clsx(
                                        { 'lg:hidden': !isPopoverOpen },
                                        'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                    )}
                                >
                                    Search
                                </div>
                            </Popover.Button>

                            <Link
                                href="/explore"
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full lg:gap-x-4':
                                            isPopoverOpen,
                                    },
                                    'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Explore"
                                >
                                    <ExploreIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>
                                <div
                                    className={clsx(
                                        { 'lg:block': !isPopoverOpen },
                                        'hidden',
                                    )}
                                >
                                    Explore
                                </div>
                                <div
                                    className={clsx(
                                        { 'lg:hidden': !isPopoverOpen },
                                        'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                    )}
                                >
                                    Explore
                                </div>
                            </Link>

                            <Link
                                href="/messenger"
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full lg:gap-x-4':
                                            isPopoverOpen,
                                    },
                                    'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Messenger"
                                >
                                    <MessengerIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>
                                <div
                                    className={clsx(
                                        { 'lg:block': !isPopoverOpen },
                                        'hidden',
                                    )}
                                >
                                    Messenger
                                </div>
                                <div
                                    className={clsx(
                                        { 'lg:hidden': !isPopoverOpen },
                                        'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                    )}
                                >
                                    Messenger
                                </div>
                            </Link>

                            <Fragment>
                                <button
                                    onClick={() => setModal(true)}
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                isPopoverOpen,
                                        },
                                        'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                        title="Create"
                                    >
                                        <AddPostIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                    </i>
                                    <div
                                        className={clsx(
                                            { 'lg:block': !isPopoverOpen },
                                            'hidden',
                                        )}
                                    >
                                        Create
                                    </div>
                                    <div
                                        className={clsx(
                                            { 'lg:hidden': !isPopoverOpen },
                                            'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                        )}
                                    >
                                        Create
                                    </div>
                                </button>
                                <Modal
                                    isOpen={isModalOpen}
                                    onClose={() => setModal(false)}
                                    className="w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-md dark:bg-slate-900 dark:text-slate-100"
                                >
                                    <CreatePostModalContent
                                        onClose={() => setModal(false)}
                                    />
                                </Modal>
                            </Fragment>

                            {isLoading ? (
                                <Spinner />
                            ) : isError ? (
                                <AlertBadge error={error} renderText />
                            ) : (
                                <Link
                                    href={'/' + currentUser.docId}
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                isPopoverOpen,
                                        },
                                        'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="transfrom inline-flex h-12 w-12 flex-none shrink-0 scale-90 items-center justify-center rounded-full text-2xl not-italic leading-none transition-transform group-hover:scale-100"
                                        title={currentUser.username}
                                    >
                                        <Avatar
                                            photo={currentUser.profile.photo}
                                            username={currentUser.username}
                                        />
                                    </i>

                                    <div
                                        className={clsx(
                                            { 'lg:block': !isPopoverOpen },
                                            'hidden',
                                        )}
                                    >
                                        Profile
                                    </div>
                                    <div
                                        className={clsx(
                                            { 'lg:hidden': !isPopoverOpen },
                                            'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                        )}
                                    >
                                        Profile
                                    </div>
                                </Link>
                            )}
                        </div>

                        <Menu as="div" className="relative mt-auto text-sm">
                            <Menu.Button
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full': !isPopoverOpen,
                                    },
                                    'group relative inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Settings"
                                >
                                    <MenuIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>
                                <div
                                    className={clsx(
                                        {
                                            'lg:inline-block': !isPopoverOpen,
                                        },
                                        'hidden',
                                    )}
                                >
                                    Menu
                                </div>
                                <div
                                    className={clsx(
                                        { 'lg:hidden': !isPopoverOpen },
                                        'invisible absolute left-16 z-50 rounded-md border bg-inherit p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1.5 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100 dark:border-gray-950 dark:before:border-gray-950',
                                    )}
                                >
                                    Menu
                                </div>
                            </Menu.Button>

                            <Transition
                                enter="duration-200 ease-in"
                                enterFrom="scale-75 opacity-0"
                                enterTo="scale-100 opacity-100"
                                leave="duration-100 ease-out"
                                leaveFrom="scale-100 opacity-100"
                                leaveTo="scale-75 opacity-0"
                                as={Fragment}
                            >
                                <Menu.Items className="absolute bottom-full z-10 w-56 origin-bottom-left divide-y rounded-md border bg-white fill-current stroke-current text-sm shadow-2xl dark:divide-gray-900 dark:border-gray-800 dark:bg-black">
                                    <Menu.Item as={Fragment}>
                                        {({ active }) => (
                                            <Link
                                                href="/accounts/edit"
                                                className={clsx(
                                                    {
                                                        'bg-gray-100 dark:bg-gray-950':
                                                            active,
                                                    },
                                                    'flex w-full items-center justify-between px-4 py-2 font-normal',
                                                )}
                                            >
                                                <span>Settings</span>
                                                <SettingsIcon
                                                    title="Settings"
                                                    className="text-lg"
                                                />
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item as={Fragment}>
                                        {({ active }) => (
                                            <Link
                                                href={`/${currentUser?.docId}?search=saved`}
                                                className={clsx(
                                                    {
                                                        'bg-gray-100 dark:bg-gray-950':
                                                            active,
                                                    },
                                                    'flex w-full items-center justify-between px-4 py-2 font-normal',
                                                )}
                                            >
                                                <span>Saved</span>
                                                <SavedIcon
                                                    title="saved"
                                                    className="text-lg"
                                                />
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item as={Fragment}>
                                        {({ active }) => (
                                            <button
                                                onClick={() =>
                                                    setDarkTheme(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className={clsx(
                                                    {
                                                        'bg-gray-100 dark:bg-gray-950':
                                                            active,
                                                    },
                                                    'flex w-full items-center justify-between px-4 py-2 font-normal',
                                                )}
                                            >
                                                <span>Switch apperance</span>
                                                <MoonIcon
                                                    title="change Theme"
                                                    className="text-lg"
                                                />
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item as={Fragment}>
                                        {({ active }) => (
                                            <button
                                                onClick={() =>
                                                    handleLogOut.mutate()
                                                }
                                                disabled={
                                                    handleLogOut.isLoading
                                                }
                                                className={clsx(
                                                    {
                                                        'bg-gray-100 dark:bg-gray-950':
                                                            active,
                                                    },
                                                    'flex w-full items-center justify-between px-4 py-2 font-normal',
                                                )}
                                            >
                                                <span>Log out</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </nav>
                )}
            </Popover>
            <main className="ml-16 px-2 lg:ml-56">{children}</main>
        </>
    )
}

export default LaptopLayout
