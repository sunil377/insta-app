import { useIsFetching } from '@tanstack/react-query'

function FetchingIndicator() {
    const isfetching = useIsFetching()

    if (!isfetching) {
        return null
    }

    return (
        <div
            aria-label="fetching"
            className="fixed inset-x-0 top-0 z-[1000] h-[3px] animate-pulse bg-primary-main"
        />
    )
}
export default FetchingIndicator
