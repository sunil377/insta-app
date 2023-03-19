import { SafeParseReturnType } from 'zod'

function parseZodError<T = any>(response: SafeParseReturnType<T, T>) {
    const error = {}
    if (response.success) {
        return error
    }
    const r = response.error.errors[0]
    return {
        [r.path[0]]: r.message,
    }
}

export { parseZodError }
