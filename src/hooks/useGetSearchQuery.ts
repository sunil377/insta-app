import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

function getParams(router: Pick<NextRouter, 'query'>) {
    const response = z
        .object({
            search: z.enum(['saved', 'posts', 'tagged']),
        })
        .safeParse(router.query)

    if (!response.success) {
        return 0
    }

    switch (response.data.search) {
        case 'posts':
            return 0
        case 'saved':
            return 1
        case 'tagged':
            return 2
    }
}

function useGetSearchQuery() {
    const router = useRouter()
    const [state, setState] = useState(() => getParams({ query: router.query }))

    useEffect(() => {
        const params = getParams({ query: router.query })
        setState(params)
    }, [router.query])

    return state
}

export default useGetSearchQuery
