import { useSyncExternalStore } from 'react'

function subscriber(query: string) {
    return function (callback: () => void) {
        const win = window.matchMedia(query)

        win.addEventListener('change', callback)
        return () => win.removeEventListener('change', callback)
    }
}

export default function useMediaQuery(query: string, initialState: boolean) {
    return useSyncExternalStore(
        subscriber(query),
        () => window.matchMedia(query).matches,
        () => initialState,
    )
}
