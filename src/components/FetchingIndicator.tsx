import { useIsFetching } from '@tanstack/react-query'

function FetchingIndicator() {
    const isfetching = useIsFetching()

    if (!isfetching) {
        return null
    }

    return (
        <div
            aria-label="loading"
            className="fixed right-10 top-5 z-50 h-6 w-6 animate-spin rounded-full border border-l-0 border-primary-main"
        ></div>
    )
}
export default FetchingIndicator
