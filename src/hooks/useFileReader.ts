import { BASE64_KEY } from '@/constants/util'
import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

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
    const fileReaderRef = useRef(new FileReader())

    useEffect(() => {
        const fileReader = fileReaderRef.current

        function handleLoadStart() {
            setState({ isloading: true, error: null, dataURL: null })
        }

        function handleError(this: FileReader) {
            setState({
                isloading: false,
                error: this.error?.message ?? null,
                dataURL: null,
            })
        }

        function handleLoad(this: FileReader) {
            const response = this.result

            if (typeof response === 'string') {
                setState({
                    isloading: false,
                    error: null,
                    dataURL: response,
                })
                window.localStorage.setItem(BASE64_KEY, response)
                return
            }

            setState({
                isloading: false,
                error: 'Unknown FileType',
                dataURL: null,
            })
        }

        fileReader.addEventListener('loadstart', handleLoadStart)
        fileReader.addEventListener('error', handleError)
        fileReader.addEventListener('load', handleLoad)

        return () => {
            fileReader.removeEventListener('loadstart', handleLoadStart)
            fileReader.removeEventListener('error', handleError)
            fileReader.removeEventListener('load', handleLoad)
        }
    }, [])

    const handleResetState = useCallback(() => {
        setState(initialState)
    }, [])

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const file = e.target.files && e.target.files[0]
            setFile(file)
            if (!file) return

            fileReaderRef.current.readAsDataURL(file)
        },
        [],
    )

    return { state, handleChange, handleResetState, file }
}

export default useFileReader
