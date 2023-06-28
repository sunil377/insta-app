import {
    ExploreIcon,
    HeartIcon,
    HomeIcon,
    InstagramTextIcon,
    InstaIcon,
    MenuIcon,
    MessengerIcon,
    ReelsIcon,
    SearchIcon,
} from '@/assets'
import { UserAvatarIcon } from '@/components/UserAvatar'
import { useAuth } from '@/context/AuthContext'
import { Menu, Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment, ReactNode, useState } from 'react'
import CreatePost from './CreatePost'
import NotificationContent from './NotificationContent'
import SearchContent from './SearchContent'
import SettingMenu from './SettingMenu'
import ToolTip from './Tooltip'

function LaptopLayout({ children }: { children: ReactNode }) {
    const [isPopoverOpened, setPopoverOpen] = useState(false)
    const currentUser = useAuth()

    return (
        <Fragment>
            <nav
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-r-gray-300 bg-white px-2 py-4 text-gray-800',
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

                    <Popover>
                        <Popover.Button
                            className={clsx(
                                'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                                {
                                    'lg:w-full': !isPopoverOpened,
                                },
                            )}
                        >
                            <SearchIcon
                                aria-label="Search"
                                className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                            />

                            <ToolTip isOpen={isPopoverOpened}>Search</ToolTip>
                        </Popover.Button>

                        <Transition
                            show={isPopoverOpened}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform -translate-x-2 opacity-0"
                            enterTo="transform translate-x-0 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform translate-x-0 opacity-100"
                            leaveTo="transform -translate-x-2 opacity-0"
                            as={Fragment}
                        >
                            <Popover.Panel className="fixed inset-y-0 left-16 z-30 w-64 origin-left border border-l-0 bg-white">
                                <SearchContent />
                            </Popover.Panel>
                        </Transition>
                    </Popover>

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

                        <ToolTip isOpen={isPopoverOpened}>Explore</ToolTip>
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
                        <ReelsIcon
                            aria-label="Reels"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isOpen={isPopoverOpened}>Reels</ToolTip>
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

                        <ToolTip isOpen={isPopoverOpened}>Messenger</ToolTip>
                    </Link>

                    <Popover>
                        <Popover.Button
                            className={clsx(
                                'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                                {
                                    'lg:w-full': !isPopoverOpened,
                                },
                            )}
                        >
                            <HeartIcon
                                aria-label="Notifications"
                                className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                            />

                            <ToolTip isOpen={isPopoverOpened}>
                                Notifications
                            </ToolTip>
                        </Popover.Button>

                        <Transition
                            show={isPopoverOpened}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform -translate-x-2 opacity-0"
                            enterTo="transform translate-x-0 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform translate-x-0 opacity-100"
                            leaveTo="transform -translate-x-2 opacity-0"
                            as={Fragment}
                        >
                            <Popover.Panel className="fixed inset-y-0 left-16 z-30 w-64 origin-left border border-l-0 bg-white">
                                <NotificationContent />
                            </Popover.Panel>
                        </Transition>
                    </Popover>

                    <CreatePost isDrawerOpen={isPopoverOpened} />

                    <Link
                        href={'/' + currentUser}
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                            {
                                'lg:w-full': !isPopoverOpened,
                            },
                        )}
                    >
                        <div className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100">
                            <UserAvatarIcon />
                        </div>

                        <ToolTip isOpen={isPopoverOpened}>Profile</ToolTip>
                    </Link>
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

            <main className="ml-16 bg-white px-2 lg:ml-56">{children}</main>
        </Fragment>
    )
}

export default LaptopLayout
