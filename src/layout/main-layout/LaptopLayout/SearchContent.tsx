import { CloseIcon } from '@/assets'
import { AlertBadge, Spinner, UserBedge } from '@/components/util'
import { useUserSearchQuery } from '@/requests/useUser'
import { Combobox } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'

function SearchContent() {
    const [selectedPerson, setSelectedPerson] = useState('')
    const [query, setQuery] = useState('')
    const {
        data: users,
        isError,
        isFetching,
        isLoading,
        error,
    } = useUserSearchQuery(query)

    const resetState = () => {
        setQuery('')
        setSelectedPerson('')
    }

    return (
        <div>
            <section className="space-y-4 px-4 py-4">
                <h2 className="text-2xl font-semibold">Search</h2>

                <Combobox value={selectedPerson} onChange={setSelectedPerson}>
                    <Combobox.Label className="group flex items-center rounded-md bg-gray-100 pr-2 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            className="block w-full rounded-sm bg-transparent px-2 leading-8 focus:outline-none"
                            autoCapitalize="off"
                            placeholder="Search"
                            autoFocus
                        />
                        <button
                            className="hidden h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-transparent text-xs text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 group-focus-within:inline-grid"
                            onClick={resetState}
                        >
                            <CloseIcon />
                        </button>
                    </Combobox.Label>

                    <Combobox.Options className="divide-y rounded-sm border border-blue-100 bg-white text-sm ring-2 ring-blue-50">
                        {isLoading || isFetching ? (
                            <Spinner />
                        ) : isError ? (
                            <AlertBadge error={error} renderText />
                        ) : users.length === 0 ? (
                            <div className="px-4 py-2 text-sm font-medium">
                                Sorry, No user found
                            </div>
                        ) : (
                            users.map((user) => (
                                <Combobox.Option
                                    key={user.docId}
                                    value={user.username}
                                    as={Fragment}
                                >
                                    {({ active }) => (
                                        <Link
                                            href={`/${user.docId}`}
                                            className={clsx(
                                                {
                                                    'border-transparent bg-primary-main text-white':
                                                        active,
                                                },
                                                'flex items-center gap-x-2 rounded-sm px-4 py-2',
                                            )}
                                        >
                                            {user.profile.photo ? (
                                                <Image
                                                    src={user.profile.photo}
                                                    alt={user.username}
                                                    width="24"
                                                    height="24"
                                                    className="h-6 w-6 rounded-full"
                                                />
                                            ) : (
                                                <UserBedge className="h-6 w-6 text-base leading-4">
                                                    {user.username.at(0)}
                                                </UserBedge>
                                            )}
                                            {user.username}
                                        </Link>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Combobox>
            </section>
        </div>
    )
}

export default SearchContent
