import {
    AddPostIcon,
    ExploreIcon,
    HeartIcon,
    HomeIcon,
    InstagramTextIcon,
    InstaIcon,
    MessengerIcon,
    PlaceholderImage,
    ReelsIcon,
    SearchIcon,
} from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import SettingButton from './SettingButton'
import ToolTip from './Tooltip'

function LaptopLayout({ children }: { children: ReactNode }) {
    const [isSpread, setSpread] = useState(true)
    const currentUser = useAuth()

    useEffect(() => {
        if (!currentUser) return
    }, [currentUser])

    return (
        <div>
            <nav
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-r-gray-300 bg-white px-2 py-4 text-gray-800 transition-all duration-300 ease-linear',
                    {
                        'lg:w-56': isSpread,
                    },
                )}
            >
                <div className="h-11">
                    <Link
                        href="/"
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 ',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full lg:px-0 lg:hover:bg-transparent ':
                                    isSpread,
                            },
                        )}
                        title="Instagram"
                    >
                        {isSpread ? (
                            <Fragment>
                                <InstaIcon className="transfrom scale-90 transition-transform group-hover:scale-100 lg:hidden" />
                                <InstagramTextIcon className="transfrom hidden scale-90 lg:inline" />
                            </Fragment>
                        ) : (
                            <InstaIcon className="transfrom scale-90 transition-transform group-hover:scale-100 " />
                        )}
                    </Link>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                    <Link
                        href="/"
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <HomeIcon
                            aria-label="Home"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isSpread={isSpread}>Home</ToolTip>
                    </Link>
                    <Popover>
                        {({ open }) => (
                            <Fragment>
                                <Popover.Button
                                    className={clsx(
                                        'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-all hover:bg-gray-100',
                                        {
                                            'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                                isSpread,
                                        },
                                    )}
                                    onClick={() => {
                                        setSpread(open)
                                    }}
                                >
                                    <SearchIcon
                                        aria-label="Search"
                                        className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                    />

                                    <ToolTip isSpread={isSpread}>
                                        Search
                                    </ToolTip>
                                </Popover.Button>
                                <Transition
                                    enter="transition duration-300 ease-linear"
                                    enterFrom="transform -translate-x-10 opacity-0"
                                    enterTo="transform translate-x-0 opacity-100"
                                    leave="transition duration-300 ease-linear"
                                    leaveFrom="transform translate-x-0 opacity-100"
                                    leaveTo="transform -translate-x-10 opacity-0"
                                    as={Fragment}
                                >
                                    <Popover.Panel className="fixed inset-y-0 left-16 z-30 w-64 origin-left border border-l-0 bg-white">
                                        <h4>Search</h4>
                                    </Popover.Panel>
                                </Transition>
                            </Fragment>
                        )}
                    </Popover>

                    <button
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <ExploreIcon
                            aria-label="Explore"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isSpread={isSpread}>Explore</ToolTip>
                    </button>
                    <button
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <ReelsIcon
                            aria-label="Reels"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isSpread={isSpread}>Reels</ToolTip>
                    </button>
                    <button
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <MessengerIcon
                            aria-label="Messenger"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isSpread={isSpread}>Messenger</ToolTip>
                    </button>

                    <Popover>
                        {({ close, open }) => (
                            <Fragment>
                                <Popover.Button
                                    className={clsx(
                                        'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                                        {
                                            'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                                isSpread,
                                        },
                                    )}
                                    onClick={() => {
                                        setSpread(open)
                                    }}
                                >
                                    <HeartIcon
                                        aria-label="Notifications"
                                        className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                                    />

                                    <ToolTip isSpread={isSpread}>
                                        Notifications
                                    </ToolTip>
                                </Popover.Button>
                                <Transition
                                    enter="transition duration-300 ease-linear"
                                    enterFrom="transform -translate-x-10 opacity-0"
                                    enterTo="transform translate-x-0 opacity-100"
                                    leave="transition duration-300 ease-linear"
                                    leaveFrom="transform translate-x-0 opacity-100"
                                    leaveTo="transform -translate-x-10 opacity-0"
                                    as={Fragment}
                                >
                                    <Popover.Panel className="fixed inset-y-0 left-16 z-30 w-64 origin-left border border-l-0 bg-white">
                                        <h4> Notification </h4>
                                    </Popover.Panel>
                                </Transition>
                            </Fragment>
                        )}
                    </Popover>

                    <button
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <AddPostIcon
                            aria-label="Create"
                            className="transfrom shrink-0 scale-90 transition-transform group-hover:scale-100"
                        />

                        <ToolTip isSpread={isSpread}>Create</ToolTip>
                    </button>
                    <Link
                        href={{
                            pathname: '/[id]',
                            query: {
                                id: currentUser?.uid,
                            },
                        }}
                        className={clsx(
                            'group relative flex w-auto items-center space-x-4 rounded-full bg-white p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
                            {
                                'lg:w-full lg:rounded-l-full lg:rounded-r-full':
                                    isSpread,
                            },
                        )}
                    >
                        <div className="shrink-0">
                            <Image
                                src={currentUser?.photoURL ?? PlaceholderImage}
                                width={24}
                                height={24}
                                alt="username"
                                className="h-6 w-6 rounded-full object-cover"
                            />
                        </div>

                        <ToolTip isSpread={isSpread}>Profile</ToolTip>
                    </Link>
                </div>

                <div className="relative mt-auto">
                    <SettingButton isSpread={isSpread} />
                </div>
            </nav>
            <main className="ml-16 bg-white px-2 lg:ml-56">{children}</main>
        </div>
    )
}
export default LaptopLayout
