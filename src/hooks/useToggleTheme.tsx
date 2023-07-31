import { useTheme } from 'next-themes'
import { useCallback } from 'react'

export default function useToggleTheme() {
    const { setTheme, theme } = useTheme()
    console.log({ theme })

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }, [setTheme, theme])

    return toggleTheme
}
