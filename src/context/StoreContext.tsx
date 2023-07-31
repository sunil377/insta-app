import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import nookies from 'nookies'
import React, { createContext, useContext, useEffect } from 'react'

export interface global_state {
    is_mobile: boolean
}

function useInitalStore(initialState: global_state) {
    const is_mobile = useMediaQuery(SCREEN_SM, initialState.is_mobile)

    useEffect(() => {
        nookies.set(null, 'is_mobile', is_mobile ? 'true' : 'false')
    }, [is_mobile])

    return {
        is_mobile,
    }
}

type context_type = ReturnType<typeof useInitalStore>

const Context = createContext<context_type | null>(null)

function useStore(): context_type {
    const ctx = useContext(Context)
    if (!ctx) {
        throw new Error('useStore Context using outside of its boundary')
    }
    return ctx
}

function StoreProvider({
    children,
    initialState,
}: {
    children: React.ReactNode
    initialState: global_state
}) {
    const state = useInitalStore(initialState)
    return <Context.Provider value={state}>{children}</Context.Provider>
}

export default StoreProvider
export { useStore }
