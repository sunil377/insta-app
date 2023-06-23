import {
    ActivityIcon,
    MoonIcon,
    ProblemIcon,
    SavedIcon,
    SettingsIcon,
} from '@/assets'
import useLogout from '@/hooks/useLogout'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

function SettingMenu() {
    const { handleLogout, isLoading } = useLogout()

    return (
        <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}
        >
            <Menu.Items className="absolute bottom-full z-10 w-56 origin-bottom-left divide-y rounded-md border bg-white text-sm shadow-2xl shadow-gray-300">
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Settings</span>
                            <SettingsIcon
                                aria-label="Settings"
                                className="scale-90 transform"
                            />
                        </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Your activity</span>
                            <ActivityIcon
                                aria-label="Your activity"
                                className="scale-90 transform"
                            />
                        </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Saved</span>
                            <SavedIcon
                                aria-label="saved"
                                className="scale-90 transform"
                            />
                        </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Switch apperance</span>
                            <MoonIcon
                                aria-label="change Theme"
                                className="scale-90 transform"
                            />
                        </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Report a problem</span>
                            <ProblemIcon
                                aria-label="report a problem"
                                className="scale-90 transform"
                            />
                        </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Switch accounts</span>
                        </button>
                    )}
                </Menu.Item>

                <Menu.Item>
                    {({ active }) => (
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className={clsx(
                                'flex w-full items-center justify-between px-4 py-2',
                                {
                                    'bg-gray-100': active,
                                },
                            )}
                        >
                            <span>Log out</span>
                        </button>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Transition>
    )
}
export default SettingMenu
