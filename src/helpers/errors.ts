function handleLoginError(error: unknown): [string, string] {
    const errMessage = (error as Error).message
    if (errMessage.toLowerCase().includes('password')) {
        return ['password', errMessage]
    }
    return ['email', errMessage]
}

const handleSignupError = function (error: unknown): [string, string] {
    const errMessage = (error as Error).message
    switch (true) {
        case errMessage.toLowerCase().includes('password'):
            return ['password', errMessage]
        case errMessage.toLowerCase().includes('username'):
            return ['username', errMessage]
        default:
            return ['email', errMessage]
    }
}

export { handleLoginError, handleSignupError }
