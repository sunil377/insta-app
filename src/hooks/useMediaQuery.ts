import { useEffect, useState } from 'react'

export default function useMediaQuery(query: string) {
    const [isMatch, setMatch] = useState(true)

    useEffect(() => {
        const win = window.matchMedia(query)
        setMatch(win.matches)

        function handleChange(e: Event) {
            setMatch(win.matches)
        }

        win.addEventListener('change', handleChange)
        return () => {
            win.removeEventListener('change', handleChange)
        }
    }, [query])

    return isMatch
}
