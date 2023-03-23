import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode } from 'react'
import { BsMeta } from 'react-icons/bs'

function AccountLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const isEditPage = router.pathname === '/accounts/edit'
    const isPasswordChange = router.pathname === '/accounts/password/change'
    

    return (
        <Fragment>
            <div className="mx-auto my-10 border bg-white text-sm lg:max-w-4xl">
                <div className="min-h-[min(500px,calc(100vh-2rem))] sm:grid sm:grid-cols-4">
                    <div className="border-r sm:col-span-1">
                        <section className="space-y-2 border-b px-6 py-4">
                            <h4 className="inline-flex items-center">
                                <BsMeta className="mr-0.5 text-xl text-blue-500" />
                                <b>Meta</b>
                            </h4>
                            <p>
                                <b>Some account settings are moving</b>
                            </p>
                            <p className="leading-4">
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Corporis consectetur pariatur
                                impedit totam, explicabo debitis, quod minima
                                voluptates accusantium dolore itaque.
                            </p>
                            <button className="text-blue-500">
                                Learn More
                            </button>
                        </section>

                        <section className="flex sm:block">
                            <Link
                                href="/accounts/edit"
                                className={clsx(
                                    'relative block w-full py-3 pl-6 text-xs',
                                    {
                                        'font-semibold before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-black':
                                            isEditPage,
                                    },
                                )}
                            >
                                Edit Profile
                            </Link>
                            <Link
                                href="/accounts/password/change"
                                className={clsx(
                                    'relative block w-full py-3 pl-6 text-xs',
                                    {
                                        'font-semibold before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-black':
                                            isPasswordChange,
                                    },
                                )}
                            >
                                Change Password
                            </Link>
                        </section>
                    </div>
                    <div className="sm:col-span-3">{children}</div>
                </div>
            </div>
        </Fragment>
    )
}
export default AccountLayout
