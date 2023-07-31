import { CircleCheckedIcon, CircleIcon, CloseIcon } from '@/assets'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import { useUserSearchQuery } from '@/requests/useUser'
import { protectedRouteWithUser } from '@/routes/routes'
import { UserServer } from '@/schema/user-schema'
import { Combobox } from '@headlessui/react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'

function NewMessage({ ...props }) {
    const [selectedPerson, setSelectedPerson] = useState<UserServer | null>(
        null,
    )
    const [query, setQuery] = useState('')
    const {
        data: users,
        isError,
        isFetching,
        isLoading,
        error,
    } = useUserSearchQuery(query)
    const router = useRouter()

    useEffect(() => {
        setQuery('')
    }, [selectedPerson])

    return (
        <>
            <header className="flex justify-between px-3 py-2">
                <button
                    className="text-xl"
                    onClick={() => {
                        router.back()
                    }}
                >
                    <HiArrowLeft />
                </button>
                <h2 className="text-lg font-semibold">New message</h2>
                <button
                    className="text-sm text-primary-main transition-colors hover:text-primary-dark"
                    disabled={!selectedPerson}
                    onClick={() => {
                        if (selectedPerson) {
                            router.push(`/message/${selectedPerson?.docId}`)
                        }
                    }}
                >
                    Next
                </button>
            </header>
            <Combobox value={selectedPerson} onChange={setSelectedPerson}>
                <section className="border-y border-y-gray-300 px-4 py-5 dark:border-y-zinc-700">
                    <Combobox.Label className="group flex items-center gap-x-2 text-sm">
                        <Combobox.Label className="font-semibold">
                            To:
                        </Combobox.Label>
                        {selectedPerson ? (
                            <div className="inline-flex gap-x-2 rounded-md px-3 py-1 text-primary-dark dark:bg-zinc-300">
                                <span>{selectedPerson.username}</span>
                                <button onClick={() => setSelectedPerson(null)}>
                                    <CloseIcon className="text-sm" />
                                </button>
                            </div>
                        ) : null}
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            className="block w-full rounded-sm bg-transparent px-2 leading-10 focus:outline-none"
                            autoCapitalize="off"
                            placeholder="Search"
                            autoComplete="off"
                            value={query}
                        />
                    </Combobox.Label>
                </section>

                <section className="h-60 overflow-y-auto">
                    {query === '' ? (
                        <p className="m-5 text-sm text-gray-700 dark:text-zinc-300">
                            no account found
                        </p>
                    ) : isLoading || isFetching ? (
                        <div className="flex h-full items-center justify-center">
                            <Spinner />
                        </div>
                    ) : isError ? (
                        <AlertBadge error={error} renderText />
                    ) : users.length === 0 ? (
                        <p className="m-5 text-sm text-gray-700 dark:text-zinc-300">
                            no account found
                        </p>
                    ) : (
                        <Combobox.Options className="space-y-2 py-4 text-sm">
                            {users.map((user) => (
                                <Combobox.Option
                                    key={user.docId}
                                    value={user}
                                    as={Fragment}
                                >
                                    {({ active, selected }) => (
                                        <div
                                            className={clsx(
                                                {
                                                    'border-transparent bg-gray-300 dark:bg-zinc-800':
                                                        active,
                                                },
                                                'flex w-full cursor-pointer items-center gap-x-4 rounded-sm px-4 py-2 font-normal',
                                            )}
                                        >
                                            <Avatar
                                                photo={user.profile.photo}
                                                username={user.username}
                                                size={40}
                                            />
                                            <div className="text-left">
                                                <h5>{user.profile.fullname}</h5>
                                                <h6 className="text-gray-700 dark:text-zinc-400">
                                                    {user.username}
                                                </h6>
                                            </div>
                                            <i className="ml-auto text-2xl">
                                                {selected ? (
                                                    <CircleCheckedIcon className="fill-primary-dark" />
                                                ) : (
                                                    <CircleIcon />
                                                )}
                                            </i>
                                        </div>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </section>
            </Combobox>
        </>
    )
}

export default NewMessage

export const getServerSideProps = protectedRouteWithUser
