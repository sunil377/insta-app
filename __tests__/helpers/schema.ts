import {
    EMAIL_INVALID,
    EMAIL_REQUIRED,
    FULLNAME_MIN_LENGTH,
    FULLNAME_REQUIRED,
    PASSWORD_MIN_LENGTH,
    PASSWORD_REQUIRED,
    USERNAME_MIN_LENGTH,
    USERNAME_REQUIRED,
} from '@/constants/errors'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { LoginSchema, SignupSchema } from '@/schema/user-schema'

describe('LoginSchema Email Schema', () => {
    test('No Email Field', () => {
        expect(
            convertZodErrorToFormikError({ password: '123456' }, LoginSchema),
        ).toStrictEqual({ email: EMAIL_REQUIRED })
    })

    test('Empty string Email Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: '', password: '123456' },
                LoginSchema,
            ),
        ).toStrictEqual({ email: EMAIL_REQUIRED })
    })

    test('non empty spaced Email Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: '   ', password: '123456' },
                LoginSchema,
            ),
        ).toStrictEqual({ email: EMAIL_REQUIRED })
    })

    test('invalid Email Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil', password: '123456' },
                LoginSchema,
            ),
        ).toStrictEqual({ email: EMAIL_INVALID })
    })
})

describe('LoginSchema Password Schema', () => {
    test('No Password Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil@gmail.com' },
                LoginSchema,
            ),
        ).toStrictEqual({ password: PASSWORD_REQUIRED })
    })

    test('Empty string Password Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil@gmail.com', password: '' },
                LoginSchema,
            ),
        ).toStrictEqual({ password: PASSWORD_REQUIRED })
    })

    test('non empty spaced Password Field', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil@gmail.com', password: '  ' },
                LoginSchema,
            ),
        ).toStrictEqual({ password: PASSWORD_REQUIRED })
    })

    test('invalid Password Field.short character', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil@gmail.com', password: '1235' },
                LoginSchema,
            ),
        ).toStrictEqual({ password: PASSWORD_MIN_LENGTH })
    })

    test('Valid data', () => {
        expect(
            convertZodErrorToFormikError(
                { email: 'sunil@gmail.com', password: '123456' },
                LoginSchema,
            ),
        ).toStrictEqual({})
    })
})

describe('Signup Schema FullName Field', () => {
    test('Field Not Passed should required', () => {
        const data = { email: 'sunil@gmail.com' }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            fullname: FULLNAME_REQUIRED,
        })
    })

    test('Empty Field should Required', () => {
        const data = { email: 'sunil@gmail.com', fullname: '' }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            fullname: FULLNAME_REQUIRED,
        })
    })

    test('Empty Spaced Field should Required', () => {
        const data = { email: 'sunil@gmail.com', fullname: '  ' }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            fullname: FULLNAME_REQUIRED,
        })
    })

    test('Field should have min 3 character', () => {
        const data = { email: 'sunil@gmail.com', fullname: '  su' }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            fullname: FULLNAME_MIN_LENGTH,
        })
    })

    test('Valid Data', () => {
        const data = {
            email: 'sunil@gmail.com',
            fullname: 'sunil panwar',
            username: 'sunil123',
            password: '123456',
        }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual(
            {},
        )
    })
})

describe('Signup Schema Username Field', () => {
    test('Field Not Passed should be required', () => {
        const data = { email: 'sunil@gmail.com', fullname: 'sunil panwar' }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            username: USERNAME_REQUIRED,
        })
    })

    test('Empty Field should be required', () => {
        const data = {
            email: 'sunil@gmail.com',
            fullname: 'sunil panwar',
            username: '',
        }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            username: USERNAME_REQUIRED,
        })
    })

    test('spaced Empty Field be required', () => {
        const data = {
            email: 'sunil@gmail.com',
            fullname: 'sunil panwar',
            username: '  ',
        }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            username: USERNAME_REQUIRED,
        })
    })

    test('username Field should be min 3 charecter', () => {
        const data = {
            email: 'sunil@gmail.com',
            fullname: 'sunil panwar',
            username: '   s',
        }
        expect(convertZodErrorToFormikError(data, SignupSchema)).toStrictEqual({
            username: USERNAME_MIN_LENGTH,
        })
    })
})
