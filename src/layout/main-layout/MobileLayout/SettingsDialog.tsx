import { MoonIcon, SettingsIcon } from '@/assets'
import UnStyledLogoutButton from '@/unstyled/UnStyledLogoutButton'
import { Dialog, Disclosure } from '@headlessui/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { BsMeta } from 'react-icons/bs'
import { HiChevronRight } from 'react-icons/hi'
import { MdClose, MdSunny } from 'react-icons/md'

function SettingsDialog() {
    const [isOpen, setOpen] = useState(false)
    const { setTheme } = useTheme()

    return (
        <Fragment>
            <button
                className="rounded-full p-1 text-2xl"
                onClick={() => setOpen((prev) => !prev)}
            >
                <SettingsIcon aria-label="settings" />
            </button>
            <Dialog open={isOpen} onClose={setOpen}>
                <Dialog.Panel className="fixed inset-0 z-50 bg-white dark:bg-black">
                    <nav className="flex items-center justify-between border-b px-2 py-1 dark:border-b-zinc-700">
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-full p-0.5 align-middle text-3xl"
                        >
                            <MdClose />
                        </button>
                        <Dialog.Title className="text-sm font-bold">
                            Options
                        </Dialog.Title>
                        <span aria-hidden></span>
                    </nav>

                    <div className="text-sm">
                        <section className="space-y-2 border-b border-b-gray-300 bg-gray-50 px-3 py-4 dark:border-b-zinc-700 dark:bg-zinc-800">
                            <h4 className="inline-flex items-center">
                                <BsMeta className="mr-0.5 text-xl text-blue-500" />
                                <b>Meta</b>
                            </h4>
                            <p>
                                <b>Some account settings are moving</b>
                            </p>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Corporis consectetur pariatur
                                impedit totam, explicabo debitis, quod minima
                                voluptates accusantium dolore itaque.
                            </p>
                            <button className="text-blue-500">
                                Learn More
                            </button>
                        </section>

                        <section className="divide-y text-sm dark:divide-zinc-800">
                            <h2 className="px-3 py-2 font-bold text-gray-500 dark:text-zinc-300 xs:font-semibold">
                                ACCOUNT
                            </h2>
                            <Link
                                className="block px-3 py-2"
                                href="/accounts/edit"
                            >
                                Edit Profile
                            </Link>
                            <Link
                                className="block px-3 py-2"
                                href="/accounts/password/change"
                            >
                                Change Password
                            </Link>
                        </section>

                        <section className="mt-8 divide-y divide-gray-300 dark:divide-zinc-800">
                            <Disclosure>
                                <Disclosure.Button className="flex w-full justify-between px-3 py-2 text-left">
                                    <span>Switch apperance</span>
                                </Disclosure.Button>
                                <Disclosure.Panel>
                                    <button
                                        onClick={() => setTheme('system')}
                                        className="flex w-full justify-between px-3 py-2 text-left"
                                    >
                                        <span>System</span>
                                        <SettingsIcon
                                            title="system"
                                            className="text-lg"
                                        />
                                    </button>

                                    <button
                                        onClick={() => setTheme('dark')}
                                        className="flex w-full justify-between px-3 py-2 text-left"
                                    >
                                        <span>Dark</span>
                                        <MoonIcon
                                            title="dark"
                                            className="text-lg"
                                        />
                                    </button>

                                    <button
                                        onClick={() => setTheme('light')}
                                        className="flex w-full justify-between px-3 py-2 text-left"
                                    >
                                        <span>Light</span>
                                        <MdSunny
                                            title="light"
                                            className="text-lg"
                                        />
                                    </button>
                                </Disclosure.Panel>
                            </Disclosure>
                            <UnStyledLogoutButton className="flex w-full justify-between px-3 py-2 text-left text-red-500">
                                <span>Log Out</span>
                                <HiChevronRight className="text-2xl text-gray-500" />
                            </UnStyledLogoutButton>
                        </section>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </Fragment>
    )
}

export default SettingsDialog
