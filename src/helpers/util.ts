import { z } from 'zod'

function convertZodErrorToFormikError<A, B extends z.Schema>(
    values: A,
    schema: B,
) {
    const response = schema.safeParse(values)
    if (response.success) return {}
    const { path, message } = response.error.errors[0]
    return {
        [path[0]]: message,
    }
}

function parseUnkownErrorToString(error: unknown): string {
    return error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'something went wrong'
}

export { convertZodErrorToFormikError, parseUnkownErrorToString }
