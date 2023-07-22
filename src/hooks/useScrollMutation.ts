import { useEffect, useRef } from 'react'

function scrollToView(ele: HTMLDivElement) {
    const lastChild = ele.lastElementChild?.lastElementChild
    if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth' })
    }
}

export default function useScrollMutation() {
    const observerRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        const ele = observerRef.current
        if (!ele) {
            return
        }
        scrollToView(ele)

        const callback: MutationCallback = (mutationList) => {
            for (const item of mutationList) {
                if (item.type === 'childList') {
                    scrollToView(ele)
                }
            }
        }
        const observer = new MutationObserver(callback)

        observer.observe(ele, {
            subtree: true,
            childList: true,
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    return observerRef
}
