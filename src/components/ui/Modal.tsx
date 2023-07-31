import { boolean_dispatch } from '@/helpers/types'
import { cn } from '@/lib/utils'
import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const ModalDescription = Dialog.Description

interface IModal extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    onClose: boolean_dispatch
}

const DialogPanel = motion(Dialog.Panel)

function Modal({ isOpen, onClose, className, ...props }: IModal) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-dialog">
            <motion.div
                animate={{
                    opacity: isOpen ? 1 : 0,
                }}
                className="fixed inset-0 bg-black bg-opacity-75"
            />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center overflow-hidden p-4 sm:p-10">
                    <DialogPanel
                        initial={{ scale: 1.125 }}
                        exit={{ scale: 1.125 }}
                        animate={{ scale: 1 }}
                        className={cn(
                            'w-full overflow-hidden rounded-md bg-modal text-modal-foreground',
                            className,
                        )}
                        {...props}
                    />
                </div>
            </div>
        </Dialog>
    )
}

/* ModalTitle */
const ModalTitle = forwardRef<
    React.ElementRef<typeof Dialog.Title>,
    React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, as = 'h2', ...props }, ref) => (
    <Dialog.Title
        as={as}
        ref={ref}
        className={cn(
            'text-center font-semibold',
            className,
        )}
        {...props}
    />
))

ModalTitle.displayName = 'ModalTitle'

export { Modal, ModalDescription, ModalTitle }

