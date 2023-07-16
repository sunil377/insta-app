import { SettingsIcon } from '@/assets'
import UnStyledLogoutButton from '@/unstyled/UnStyledLogoutButton'
import { Dialog } from '@headlessui/react'
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
                            <UnStyledLogoutButton className="flex w-full justify-between border-y py-2 text-left text-red-500">
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
