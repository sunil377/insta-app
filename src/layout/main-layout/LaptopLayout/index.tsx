import {
    ExploreIcon,
    HomeIcon,
    InstagramTextIcon,
    InstaIcon,
    MenuIcon,
    MessengerIcon,
    SearchIcon,
} from '@/assets'
import CreatePost from '@/components/CreatePost/CreatePostButton'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import useUser from '@/requests/useUser'
import { Menu, Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment, ReactNode } from 'react'
import SearchContent from './SearchContent'
import SettingMenu from './SettingMenu'
import ToolTip from './Tooltip'

function LaptopLayout({ children }: { children: ReactNode }) {
    const { data: currentUser, isError, isLoading, error } = useUser()

    return (
        <Popover>
            {({ open: isPopoverOpened }) => (
                <>
                    <nav
                        className={clsx(
                            'fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-r-gray-300 bg-white px-2 py-4 text-gray-800 transition-all',
                            {
                                'lg:w-56': !isPopoverOpened,
                            },
                        )}
                    >
                        <Link
                            href="/"
                            className="group flex h-11 items-center rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100"
                            title="Instagram"
                        >
                            {isPopoverOpened ? (
                                <InstaIcon className="transfrom scale-90 transition-transform group-hover:scale-100" />
                            ) : (
                                <Fragment>
                                    <InstaIcon className="transfrom scale-90 transition-transform group-hover:scale-100 lg:hidden" />
                                    <InstagramTextIcon className="transfrom hidden scale-90 lg:inline" />
                                </Fragment>
                            )}
                        </Link>

                        <Transition
                            show={isPopoverOpened}
                            enter="duration-300 ease-linear"
                            enterFrom="-translate-x-52 opacity-0"
                            enterTo="translate-x-0 opacity-100"
                            leave="duration-200 ease-linear"
                            leaveFrom="translate-x-0 opacity-100"
                            leaveTo="-translate-x-52 opacity-0"
                            as={Fragment}
                        >
                            <Popover.Panel
                                static
                                className="fixed inset-y-0 left-16 z-30 w-64 origin-left border border-l-0 bg-white"
                            >
                                <SearchContent />
                            </Popover.Panel>
                        </Transition>

                        <div className="mt-5 space-y-2 text-sm">
                            <Link
                                href="/"
                                className={clsx(
                                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                                    {
                                        'lg:w-full': !isPopoverOpened,
                                    },
                                )}
                            >
                                <HomeIcon
                                    aria-label="Home"
                                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                />

                                <ToolTip isOpen={isPopoverOpened}>Home</ToolTip>
                            </Link>

                            <Popover.Button
                                className={clsx(
                                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 font-normal transition-colors hover:bg-gray-100',
                                    {
                                        'lg:w-full': !isPopoverOpened,
                                    },
                                )}
                            >
                                <SearchIcon
                                    aria-label="Search"
                                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                />

                                <ToolTip isOpen={isPopoverOpened}>
                                    Search
                                </ToolTip>
                            </Popover.Button>

                            <Link
                                href="/explore"
                                className={clsx(
                                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                                    {
                                        'lg:w-full': !isPopoverOpened,
                                    },
                                )}
                            >
                                <ExploreIcon
                                    aria-label="Explore"
                                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                />

                                <ToolTip isOpen={isPopoverOpened}>
                                    Explore
                                </ToolTip>
                            </Link>

                            <Link
                                href="/"
                                className={clsx(
                                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                                    {
                                        'lg:w-full': !isPopoverOpened,
                                    },
                                )}
                            >
                                <MessengerIcon
                                    aria-label="Messenger"
                                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                />

                                <ToolTip isOpen={isPopoverOpened}>
                                    Messenger
                                </ToolTip>
                            </Link>

                            <CreatePost isDrawerOpen={isPopoverOpened} />

                            {isLoading ? (
                                <Spinner />
                            ) : isError ? (
                                <AlertBadge error={error} renderText />
                            ) : (
                                <Link
                                    href={'/' + currentUser.docId}
                                    className={clsx(
                                        'group relative flex w-auto items-center space-x-3 rounded-full bg-white px-2 py-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                                        {
                                            'lg:w-full': !isPopoverOpened,
                                        },
                                    )}
                                >
                                    <div className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100">
                                        <Avatar
                                            photo={currentUser.profile.photo}
                                            username={currentUser.username}
                                        />
                                    </div>

                                    <ToolTip isOpen={isPopoverOpened}>
                                        Profile
                                    </ToolTip>
                                </Link>
                            )}
                        </div>

                        <Menu as="div" className="relative mt-auto">
                            <Menu.Button
                                className={clsx(
                                    'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                                    {
                                        'lg:w-full': !isPopoverOpened,
                                    },
                                )}
                            >
                                <MenuIcon
                                    aria-label="Settings"
                                    className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                />

                                <ToolTip isOpen={isPopoverOpened}>Menu</ToolTip>
                            </Menu.Button>
                            <SettingMenu />
                        </Menu>
                    </nav>

                    <main className="ml-16 bg-white px-2 lg:ml-56">
                        {children}
                    </main>
                </>
            )}
        </Popover>
    )
}

export default LaptopLayout
