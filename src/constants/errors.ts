/* Email Error */
export const EMAIL_REQUIRED = required('Email')
export const EMAIL_INVALID = 'Invalid Email.'
export const EMAIL_ALREADY_EXISTS = 'Email Already Exists.'

/* Password Error */
export const PASSWORD_REQUIRED = required('Password')
export const PASSWORD_WRONG = 'Wrong Password.'
export const PASSWORD_MIN_LENGTH = min_length('Password', 6)
export const PASSWORD_DONT_MATCH = "Password Don't match"

/* Fullname Error */
export const FULLNAME_REQUIRED = required('Fullname')
export const FULLNAME_MIN_LENGTH = min_length('Fullname')

/* Username Error */
export const USERNAME_REQUIRED = required('Username')
export const USERNAME_MIN_LENGTH = min_length('Username')
export const USERNAME_ALREADY_EXISTS = 'Username Already Exists.'

/* User id error */
export const USERID_REQUIRED = required('Userid')

export const USER_NOT_FOUND = 'User Not Found.'
export const POP_UP_CLOSED_BY_USER = 'Signin Popup Closed'

export const USER_SIGNIN_WITH_DIFF_PROVIDER =
    "You'r previously login with Google."

//post constants
export const POST_NOT_FOUND = 'Post Not Found.'

/* helpers function */

function required(field: string) {
    return `${field} is Required Field.`
}

function min_length(field: string, num = 3) {
    return `${field} should be minimum ${num} character(s) Long.`
}
