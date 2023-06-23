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

export { convertZodErrorToFormikError }
