import clsx from 'clsx'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { IoAlertCircle } from 'react-icons/io5'

interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message: string
    type: 'success' | 'failed'
}

function Alert({ message, type, className, ...rest }: IProps) {
    const defaultProps: React.HtmlHTMLAttributes<HTMLParagraphElement> = {
        role: 'alert',
        'aria-live': 'polite',
        ...rest,
    }

    return (
        <p
            className={clsx(
                'flex w-full items-center gap-2 rounded-md border bg-white px-8 py-3 text-sm font-medium shadow-md sm:max-w-sm',
                type === 'success' ? 'text-green-500' : 'text-red-500',
                className,
            )}
            {...defaultProps}
        >
            <i className="text-2xl">
                {type === 'success' ? (
                    <AiOutlineCheckCircle />
                ) : (
                    <IoAlertCircle />
                )}
            </i>
            {message}
        </p>
    )
}

export default Alert
