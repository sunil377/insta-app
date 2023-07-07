import { MoonIcon, SavedIcon, SettingsIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import useLogout from '@/hooks/useLogout'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'

function SettingMenu() {
    const { mutate, isLoading } = useLogout()
    const currentUser = useAuth()

    return (
        <Transition
            enter="duration-200 ease-in"
            enterFrom="scale-75 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="duration-100 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-75 opacity-0"
            as={Fragment}
        >
            <Menu.Items className="absolute bottom-full z-10 w-56 origin-bottom-left divide-y rounded-md border bg-white text-sm shadow-2xl shadow-gray-300">
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/accounts/edit"
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
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href={`/${currentUser}?search=saved`}
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
                                className="scale-90 transform text-2xl"
                            />
                        </Link>
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
                            onClick={() => mutate()}
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
