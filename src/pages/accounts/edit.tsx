import NotFound from '@/components/NotFound'
import { adminAuth, adminDB } from '@/config/firebase-admin'
import { useAuth } from '@/context/AuthContext'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { IUser, user_collection_name } from '@/services/user'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import nookies from 'nookies'
import { useId, useState } from 'react'
import { NextPageWithLayout } from '../_app'

const EditProfile: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = function EditProfile(props) {
    const currentUser = useAuth()
    const id = useId()
    const [user, setUser] = useState(props.user ?? null)

    if (props.statusCode || !user) {
        return <NotFound statusCode={props.statusCode ?? 404} />
    }

    return (
        <div className="space-y-4 p-10 text-sm">
            <section className="grid grid-cols-4 gap-x-6">
                <div className="col-span-1 flex justify-end">
                    <Image
                        src={currentUser?.photoURL ?? ''}
                        alt={currentUser?.displayName ?? ''}
                        className="h-8 w-8 rounded-full border bg-contain"
                        width={32}
                        height={32}
                    />
                </div>
                <div className="col-span-3 leading-4">
                    <h4>{user.username}</h4>
                    <button className="font-semibold text-blue-400">
                        Change profile photo
                    </button>
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`name-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Name
                </label>
                <div className="col-span-3 leading-4">
                    <input
                        id={`name-${id}`}
                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                        value={user.fullname}
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`username-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Username
                </label>
                <div className="col-span-3 leading-4">
                    <input
                        id={`username-${id}`}
                        className="w-full rounded-md border px-4 py-2"
                        value={user.username}
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`bio-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Bio
                </label>
                <div className="col-span-3 leading-4">
                    <textarea
                        id={`bio-${id}`}
                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                        maxLength={150}
                        value={user.bio}
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`email-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Email
                </label>
                <div className="col-span-3 leading-4">
                    <input
                        id={`email-${id}`}
                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                        value={currentUser?.email ?? ''}
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`phone-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Phone Number
                </label>
                <div className="col-span-3 leading-4">
                    <input
                        id={`phone-${id}`}
                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                        type="number"
                        value={currentUser?.phoneNumber ?? ''}
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <label
                    htmlFor={`gender-${id}`}
                    className="col-span-1 flex items-center justify-end font-semibold"
                >
                    Gender
                </label>
                <div className="col-span-3 leading-4">
                    <input
                        id={`gender-${id}`}
                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                        value="Male"
                    />
                </div>
            </section>
            <section className="grid grid-cols-4 gap-x-6">
                <span className="col-span-1" aria-hidden></span>
                <div className="col-span-3 leading-4">
                    <button className="rounded-md bg-blue-400 px-3 py-1.5 text-white">
                        Submit
                    </button>
                </div>
            </section>
        </div>
    )
}

EditProfile.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            <AccountLayout>{page}</AccountLayout>
        </MainLayout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token
    let userid: string

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                parmament: false,
            },
        } as never
    }

    try {
        const response = await adminAuth.verifyIdToken(token)
        userid = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                parmament: false,
            },
        } as never
    }

    try {
        const response = await adminDB
            .doc(user_collection_name + '/' + userid)
            .get()

        if (response.exists) {
            return {
                props: {
                    user: { docId: response.id, ...response.data() } as IUser,
                },
            }
        }

        return {
            props: {
                statusCode: 404,
            },
        }
    } catch (error) {
        return {
            props: {
                statusCode: 500,
            },
        }
    }
}

export default EditProfile
