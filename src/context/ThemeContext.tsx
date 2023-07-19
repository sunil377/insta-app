import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import nookies from 'nookies'
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface initial_state_of_theme {
    is_dark: boolean
    is_mobile: boolean
}

function useStore(initialState: initial_state_of_theme) {
    const is_mobile = useMediaQuery(SCREEN_SM, initialState.is_mobile)
    const [isDarkThemeActive, setDarkTheme] = useState(initialState.is_dark)

    useEffect(() => {
        nookies.set(null, 'is_mobile', is_mobile ? 'true' : 'false')
    }, [is_mobile])

    useEffect(() => {
        const ele = document.documentElement
        isDarkThemeActive
            ? ele.classList.add('dark')
            : ele.classList.remove('dark')
        nookies.set(null, 'is_dark', isDarkThemeActive ? 'true' : 'false')
    }, [isDarkThemeActive])

    return {
        is_mobile,
        is_dark: isDarkThemeActive,
        setDarkTheme,
    }
}

type context_type = ReturnType<typeof useStore>

const Context = createContext<context_type | null>(null)

export function useTheme(): context_type {
    const ctx = useContext(Context)
    if (!ctx) {
        throw new Error('useTheme Context using outside of its boundary')
    }
    return ctx
}

export default function ThemeProvider({
    children,
    initialState,
}: {
    children: React.ReactNode
    initialState: initial_state_of_theme
}) {
    const state = useStore(initialState)
    return <Context.Provider value={state}>{children}</Context.Provider>
}
