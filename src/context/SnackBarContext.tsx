import { Transition } from '@headlessui/react'
import { Fragment, createContext, useContext, useState } from 'react'

type contextType = null | {
    dismiss: () => void
    setMessage: (msg: string) => void
}

const Context = createContext<contextType>(null)

export function useSnackBar() {
    const conx = useContext(Context)
    if (!conx) {
        throw new Error("useSnackBar hook is used outside of it's boundary")
    }
    return conx
}

function SnackBarProvider({ children }: { children: React.ReactNode }) {
    const [msg, setMsg] = useState('')

    const dismiss = () => {
        setMsg('')
    }

    const setMessage = (arg: string) => {
        setMsg(arg)
        setTimeout(dismiss, 3000)
    }

    return (
        <Context.Provider
            value={{
                dismiss,
                setMessage,
            }}
        >
            <Transition
                show={!!msg}
                enter="duration-200 ease-linear sm:duration-500"
                enterFrom="scale-90 opacity-0 sm:translate-x-[1000px]"
                enterTo="scale-100 opacity-100 sm:translate-x-0"
                leave="duration-100 ease-in"
                leaveFrom="scale-100 opacity-100 sm:translate-x-0"
                leaveTo="scale-90 opacity-0 sm:translate-x-[1000px]"
                as={Fragment}
            >
                <div
                    className="fixed inset-x-0 bottom-0 z-snackbar mb-12 border border-b-0 bg-white p-4 text-center text-xsm font-medium capitalize dark:border-gray-700 dark:bg-black sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:mb-0 sm:w-full sm:max-w-xs sm:rounded-md sm:border-b sm:py-3 sm:shadow-sm"
                    role="alert"
                    aria-live="polite"
                >
                    {msg}
                </div>
            </Transition>

            {children}
        </Context.Provider>
    )
}

export default SnackBarProvider
