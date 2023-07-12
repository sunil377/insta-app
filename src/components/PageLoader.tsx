import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function PageLoader() {
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const onLoadStart = () => setLoading(true)
        const onLoadComplete = () => setLoading(false)
        const onLoadError = () => setLoading(false)

        router.events.on('routeChangeStart', onLoadStart)
        router.events.on('routeChangeComplete', onLoadComplete)

        return () => {
            router.events.off('routeChangeStart', onLoadStart)
            router.events.off('routeChangeComplete', onLoadComplete)
            router.events.off('routeChangeError', onLoadError)
        }
    }, [router.events])

    if (!isLoading) {
        return null
    }

    return (
        <div
            aria-label="page loading"
            className="fixed inset-x-0 top-0 z-[1000] h-[3px] animate-pulse bg-primary-main"
        />
    )
}
export default PageLoader
