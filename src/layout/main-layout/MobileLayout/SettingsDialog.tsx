import { SettingsIcon } from '@/assets'
import { logout } from '@/services/auth'
import { Dialog, Transition } from '@headlessui/react'
import { FirebaseError } from 'firebase-admin'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { BsMeta } from 'react-icons/bs'
import { HiChevronRight } from 'react-icons/hi'
import { MdClose } from 'react-icons/md'

function SettingsDialog() {
    const [isOpen, setOpen] = useState(false)

    return (
        <Fragment>
            <button
                className="rounded-full p-1"
                onClick={() => setOpen((prev) => !prev)}
            >
                <SettingsIcon aria-label="settings" />
            </button>
            <Dialog open={isOpen} onClose={setOpen}>
                <Dialog.Panel className="fixed inset-0 z-50 bg-white">
                    <nav className="flex items-center justify-between border-b bg-white px-2 py-1">
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

                    <div className="bg-white text-sm">
                        <section className="space-y-2 bg-gray-50 px-3 py-4">
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

                        <section className="divide-y px-3 text-sm">
                            <h2 className="bg-gray-50 py-2 font-bold text-gray-500 xs:font-semibold">
                                ACCOUNT
                            </h2>
                            <Link className="block py-2" href="/accounts/edit">
                                Edit Profile
                            </Link>
                            <Link
                                className="block py-2"
                                href="/accounts/password/change"
                            >
                                Change Password
                            </Link>
                        </section>

                        <section className="mt-2 px-3">
                            <LogOutDialog />
                        </section>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </Fragment>
    )
}

function LogOutDialog() {
    const [isOpen, setOpen] = useState(false)

    return (
        <Fragment>
            <button
                className="flex w-full justify-between border-y py-2 text-left text-red-500"
                onClick={() => setOpen(true)}
            >
                <span>Log Out</span>
                <HiChevronRight className="text-2xl text-gray-500" />
            </button>

            <Transition
                show={isOpen}
                enter="transition duration-100 ease-linear"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-linear"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog
                    onClose={setOpen}
                    className="fixed inset-0 z-50 grid place-items-center"
                >
                    <div className="absolute inset-0 z-10 bg-gray-700/70"></div>
                    <Dialog.Panel className="relative z-20 w-full max-w-[min(250px,calc(100%-2rem))] rounded-xl bg-gray-100 text-sm">
                        <section className="space-y-2 py-5 text-center">
                            <Dialog.Title className="text-xl">
                                Log Out?
                            </Dialog.Title>
                            <p className="px-5 text-gray-400">
                                Are you sure that you want to log out of your
                                Account?
                            </p>
                        </section>
                        <section>
                            <button
                                className="block w-full border-y py-3 font-bold text-blue-500"
                                onClick={async function () {
                                    try {
                                        await logout()
                                    } catch (error) {
                                        alert((error as Error | FirebaseError).message)
                                    }
                                }}
                            >
                                Log Out
                            </button>
                            <button
                                className="block w-full py-3"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </section>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </Fragment>
    )
}

export default SettingsDialog
