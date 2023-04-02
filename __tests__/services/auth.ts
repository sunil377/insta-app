jest.mock('firebase/auth')
jest.mock('firebase/firestore')

import { USERNAME_ALREADY_EXISTS } from '@/constants/errors'
import { createUserForFirestore } from '@/services/auth'
import { deleteUser } from 'firebase/auth'
import { getDocs } from 'firebase/firestore'

const USER = {
    uid: '1234',
    email: 'test@gmail.com',
}

afterEach(() => {
    // @ts-ignore
    getDocs.mockReset()
    // @ts-ignore
    deleteUser.mockReset()
})

describe('CreateUserForFirestore', () => {
    test('should thorw user already exists', async () => {
        // @ts-ignore
        deleteUser.mockImplementation(() => Promise.resolve())

        const ReturnValueofGetDocs = {
            forEach: (cb: any) => {
                cb({
                    exists: function () {
                        return true
                    },
                    data: function () {
                        return {
                            name: 'sunil',
                        }
                    },
                    id: 'hello sunil',
                })
            },
        }

        // @ts-ignore
        getDocs.mockImplementation(() => Promise.resolve(ReturnValueofGetDocs))

        await expect(
            createUserForFirestore(
                {
                    // @ts-ignore
                    user: USER,
                },
                'test',
                'test kumar',
            ),
        ).rejects.toStrictEqual(
            new ReferenceError(USERNAME_ALREADY_EXISTS, {
                cause: 'username',
            }),
        )
    })

    test('should Not Throw', async () => {
        // @ts-ignore
        deleteUser.mockImplementation(() => Promise.resolve())

        const ReturnValueofGetDocs = {
            forEach: (cb: any) => {
                cb({
                    exists: function () {
                        return false
                    },
                })
            },
        }

        // @ts-ignore
        getDocs.mockImplementation(() => Promise.resolve(ReturnValueofGetDocs))

        await expect(
            createUserForFirestore(
                {
                    // @ts-ignore
                    user: USER,
                },
                'test',
                'test kumar',
            ),
        ).resolves.toStrictEqual({
            success: true,
        })
    })
})

describe('Firebase Backend error', () => {
    test('should Not Throw beacause Deleteuser never hit', async () => {
        // @ts-ignore
        deleteUser.mockImplementation(() => Promise.reject())

        const ReturnValueofGetDocs = {
            forEach: (cb: any) => {
                cb({
                    exists: function () {
                        return false
                    },
                })
            },
        }

        // @ts-ignore
        getDocs.mockImplementation(() => Promise.resolve(ReturnValueofGetDocs))

        await expect(
            createUserForFirestore(
                {
                    // @ts-ignore
                    user: USER,
                },
                'test',
                'test kumar',
            ),
        ).resolves.toStrictEqual({
            success: true,
        })
    })
})
