import { useState } from 'react'

export default function useCaption() {
    const [caption, setCaption] = useState('')
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setCaption((prev) =>
            e.target.value.length <= 2000 ? e.target.value : prev,
        )

    return [caption, handleChange] as const
}
