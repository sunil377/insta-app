import { useEffect, useState } from 'react'

export default function useSuccess() {
    const [isSuccess, setSuccess] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timer | null = null

        if (isSuccess) {
            timer = setTimeout(() => setSuccess(false), 3000)
        }

        return () => {
            if (!timer) return
            clearTimeout(timer)
        }
    }, [isSuccess])

    return [isSuccess, setSuccess] as const
}
