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
import useLogout from '@/hooks/useLogout'
import useUser from '@/requests/useUser'
import { Menu, Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, ReactNode, useState } from 'react'
import SearchContent from './SearchContent'

function Tooltip({
    isPopoverOpen,
    children,
}: {
    isPopoverOpen: boolean
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isMessagePageActive = pathname.startsWith('/message')

    return (
        <>
            <div
                className={clsx(
                    {
                        'lg:inline-block':
                            !isPopoverOpen && !isMessagePageActive,
                    },
                    'hidden',
                )}
            >
                {children}
            </div>

            <div
                className={clsx(
                    { 'lg:hidden': !isPopoverOpen && !isMessagePageActive },
                    'invisible absolute left-16 top-1/2 z-50 -translate-y-1/2 rounded-md border bg-gray-50 px-2.5 py-2 align-middle text-xs opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900',
                )}
            >
                <span className="absolute left-0 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 transform border-b border-l border-inherit bg-inherit"></span>
                {children}
            </div>
        </>
    )
}

function LaptopLayout({ children }: { children: ReactNode }) {
    const { data: currentUser, isError, isLoading, error } = useUser()
    const [isModalOpen, setModal] = useState(false)
    const handleLogOut = useLogout()
    const { setTheme } = useTheme()
    const pathname = usePathname()
    const isMessagePageActive = pathname.startsWith('/message')

    return (
        <>
            <Popover>
                {({ open: isPopoverOpen }) => (
                    <nav
                        className={clsx(
                            {
                                'lg:w-56':
                                    !isPopoverOpen && !isMessagePageActive,
                            },
                            'fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-r-gray-300 bg-white px-2 py-4 text-gray-800 transition-all dark:border-r-zinc-700 dark:bg-black dark:text-white',
                        )}
                    >
                        <Link
                            href="/"
                            className={clsx(
                                {
                                    'lg:w-full lg:justify-start':
                                        !isPopoverOpen && !isMessagePageActive,
                                },
                                'group flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                            )}
                            title="Instagram"
                        >
                            <InstaIcon
                                className={clsx(
                                    {
                                        'lg:hidden':
                                            !isPopoverOpen &&
                                            !isMessagePageActive,
                                    },
                                    'transform transition-transform group-hover:scale-110',
                                )}
                            />
                            <InstagramTextIcon
                                className={clsx(
                                    {
                                        'lg:inline-block':
                                            !isPopoverOpen &&
                                            !isMessagePageActive,
                                    },
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
                                        className="h-full w-96 origin-left rounded-r-xl border border-l-0 bg-white dark:border-gray-900 dark:bg-black dark:text-white"
                                    >
                                        <SearchContent />
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition>

                        <div className="mt-5 flex flex-col space-y-2 text-sm">
                            <div className="group relative">
                                <Link
                                    href="/"
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                !isPopoverOpen &&
                                                !isMessagePageActive,
                                        },
                                        'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                        aria-label="Home"
                                    >
                                        <HomeIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                    </i>
                                    <Tooltip isPopoverOpen={isPopoverOpen}>
                                        Home
                                    </Tooltip>
                                </Link>
                            </div>
                            <div className="group relative">
                                <Popover.Button
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                !isPopoverOpen &&
                                                !isMessagePageActive,
                                        },
                                        'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100  dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                        aria-label="Search"
                                    >
                                        <SearchIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                    </i>

                                    <Tooltip isPopoverOpen={isPopoverOpen}>
                                        Search
                                    </Tooltip>
                                </Popover.Button>
                            </div>

                            <div className="group relative">
                                <Link
                                    href="/explore"
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                !isPopoverOpen &&
                                                !isMessagePageActive,
                                        },
                                        'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                        title="Explore"
                                    >
                                        <ExploreIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                    </i>

                                    <Tooltip isPopoverOpen={isPopoverOpen}>
                                        Explore
                                    </Tooltip>
                                </Link>
                            </div>

                            <div className="group relative">
                                <Link
                                    href="/message"
                                    className={clsx(
                                        {
                                            'lg:flex lg:w-full lg:gap-x-4':
                                                !isPopoverOpen &&
                                                !isMessagePageActive,
                                        },
                                        'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                    )}
                                >
                                    <i
                                        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                        title="Messenger"
                                    >
                                        <MessengerIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                    </i>

                                    <Tooltip isPopoverOpen={isPopoverOpen}>
                                        Messenger
                                    </Tooltip>
                                </Link>
                            </div>

                            <Fragment>
                                <div className="group relative">
                                    <button
                                        onClick={() => setModal(true)}
                                        className={clsx(
                                            {
                                                'lg:flex lg:w-full lg:gap-x-4':
                                                    !isPopoverOpen &&
                                                    !isMessagePageActive,
                                            },
                                            'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                        )}
                                    >
                                        <i
                                            className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                            title="Create"
                                        >
                                            <AddPostIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                        </i>

                                        <Tooltip isPopoverOpen={isPopoverOpen}>
                                            Create
                                        </Tooltip>
                                    </button>
                                </div>
                                <Modal
                                    isOpen={isModalOpen}
                                    onClose={setModal}
                                    className="w-full max-w-3xl overflow-hidden rounded-md border bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                >
                                    <CreatePostModalContent
                                        onClose={setModal}
                                    />
                                </Modal>
                            </Fragment>

                            {isLoading ? (
                                <Spinner />
                            ) : isError ? (
                                <AlertBadge error={error} renderText />
                            ) : (
                                <div className="group relative">
                                    <Link
                                        href={'/' + currentUser.docId}
                                        className={clsx(
                                            {
                                                'lg:flex lg:w-full lg:gap-x-4':
                                                    !isPopoverOpen &&
                                                    !isMessagePageActive,
                                            },
                                            'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                        )}
                                    >
                                        <i
                                            className="transfrom inline-flex h-12 w-12 flex-none shrink-0 scale-90 items-center justify-center rounded-full text-2xl not-italic leading-none transition-transform group-hover:scale-100"
                                            title={currentUser.username}
                                        >
                                            <Avatar
                                                photo={
                                                    currentUser.profile.photo
                                                }
                                                username={currentUser.username}
                                            />
                                        </i>

                                        <Tooltip isPopoverOpen={isPopoverOpen}>
                                            Profile
                                        </Tooltip>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Menu as="div" className="relative mt-auto text-sm">
                            <Menu.Button
                                className={clsx(
                                    {
                                        'lg:flex lg:w-full lg:gap-x-4':
                                            !isPopoverOpen &&
                                            !isMessagePageActive,
                                    },
                                    'inline-flex items-center rounded-full font-normal transition-all hover:bg-gray-100 dark:hover:bg-gray-900',
                                )}
                            >
                                <i
                                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl leading-none"
                                    title="Settings"
                                >
                                    <MenuIcon className="transfrom flex-none transition-transform group-hover:scale-110" />
                                </i>

                                <Tooltip isPopoverOpen={isPopoverOpen}>
                                    Menu
                                </Tooltip>
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
                                            <Menu as="div" className="relative">
                                                <Menu.Button
                                                    className={clsx(
                                                        {
                                                            'bg-gray-100 dark:bg-gray-950':
                                                                active,
                                                        },
                                                        'flex w-full items-center justify-between px-4 py-2 font-normal',
                                                    )}
                                                >
                                                    <span>
                                                        Switch apperance
                                                    </span>
                                                    <MoonIcon
                                                        title="change Theme"
                                                        className="text-lg"
                                                    />
                                                </Menu.Button>
                                                <Menu.Items className="absolute bottom-full left-full z-10 w-56 origin-bottom-left divide-y rounded-md border bg-white fill-current stroke-current text-sm shadow-2xl dark:divide-gray-900 dark:border-gray-800 dark:bg-black">
                                                    <Menu.Item
                                                        as="button"
                                                        className="black w-full px-2 py-1.5 data-[headlessui-state=active]:bg-gray-100 data-[headlessui-state=active]:dark:bg-gray-950"
                                                        onClick={() =>
                                                            setTheme('system')
                                                        }
                                                    >
                                                        System
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        as="button"
                                                        className="black w-full px-2 py-1.5 data-[headlessui-state=active]:bg-gray-100 data-[headlessui-state=active]:dark:bg-gray-950"
                                                        onClick={() =>
                                                            setTheme('dark')
                                                        }
                                                    >
                                                        Dark
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        as="button"
                                                        className="black w-full px-2 py-1.5 data-[headlessui-state=active]:bg-gray-100 data-[headlessui-state=active]:dark:bg-gray-950"
                                                        onClick={() =>
                                                            setTheme('light')
                                                        }
                                                    >
                                                        Light
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Menu>
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
