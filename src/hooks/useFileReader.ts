import { ChangeEventHandler, useCallback, useState } from 'react'

interface IState {
    dataURL: string | null
    isloading: boolean
    error: string | null
}

const initialState = {
    dataURL: null,
    isloading: false,
    error: null,
}

function useFileReader() {
    const [state, setState] = useState<IState>(initialState)
    const [file, setFile] = useState<null | File>(null)

    const handleResetState = useCallback(() => {
        setState(initialState)
    }, [])

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const file = e.target.files && e.target.files[0]
            setFile(file)
            if (!file) return

            const fileReader = new FileReader()

            fileReader.addEventListener('loadstart', () => {
                setState({ isloading: true, error: null, dataURL: null })
            })

            fileReader.addEventListener('error', (err) => {
                setState({
                    isloading: false,
                    error: err.target?.error?.message ?? null,
                    dataURL: null,
                })
            })

            fileReader.addEventListener('load', (fileReaderEvent) => {
                const response = fileReaderEvent.target?.result ?? null

                if (typeof response === 'string') {
                    // setStep('Crop')
                    setState({
                        isloading: false,
                        error: null,
                        dataURL: response,
                    })
                    return
                }

                setState({
                    isloading: false,
                    error: 'Unknown FileType',
                    dataURL: null,
                })
            })

            fileReader.readAsDataURL(file)
        },
        [],
    )

    return { state, handleChange, handleResetState, file }
}

export default useFileReader
