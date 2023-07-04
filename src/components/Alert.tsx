import clsx from 'clsx'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { IoAlertCircle } from 'react-icons/io5'

type IParagraph = React.HTMLAttributes<HTMLParagraphElement>

interface IProps extends IParagraph {
    message: string
    type: 'success' | 'failed'
}

function Alert({ message, type, className, ...rest }: IProps) {
    const defaultProps: IParagraph = {
        role: 'alert',
        'aria-live': 'polite',
        ...rest,
    }
    const icon =
        type === 'success' ? <AiOutlineCheckCircle /> : <IoAlertCircle />

    return (
        <p
            className={clsx(
                'flex w-full items-center gap-2 rounded-md border bg-white px-8 py-3 text-sm font-medium shadow-md sm:max-w-sm',
                type === 'success' ? 'text-green-500' : 'text-red-500',
                className,
            )}
            {...defaultProps}
        >
            <i className="text-2xl">{icon}</i>
            {message}
        </p>
    )
}

export default Alert
