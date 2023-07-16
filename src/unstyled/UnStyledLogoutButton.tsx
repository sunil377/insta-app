import Modal, { ModalList, ModalListItem } from '@/components/Modal'
import { IButton } from '@/helpers/types'
import useLogout from '@/hooks/useLogout'
import { Dialog } from '@headlessui/react'
import { Fragment, forwardRef, useState } from 'react'

const UnStyledLogoutButton = forwardRef<
    HTMLButtonElement,
    Omit<IButton, 'onClick' | 'disabled'>
>(function UnStyledLogoutButton(props, ref) {
    const [isOpen, setOpen] = useState(false)
    const handleLogOut = useLogout()

    return (
        <Fragment>
            <button onClick={() => setOpen(true)} ref={ref} {...props} />

            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                className="w-full max-w-sm rounded-xl bg-gray-100 text-sm"
            >
                <ModalList>
                    <section className="space-y-2 py-5">
                        <Dialog.Title className="text-xl">
                            Log Out?
                        </Dialog.Title>
                        <p className="px-5 text-secondary-light">
                            Are you sure that you want to log out of your
                            Account?
                        </p>
                    </section>
                    <ModalListItem>
                        <button
                            className="text-primary-main transition-colors hover:text-primary-dark"
                            onClick={() => handleLogOut.mutate()}
                            disabled={handleLogOut.isLoading}
                        >
                            <b>Log Out</b>
                        </button>
                    </ModalListItem>
                    <ModalListItem>
                        <button onClick={() => setOpen(false)}>Cancel</button>
                    </ModalListItem>
                </ModalList>
            </Modal>
        </Fragment>
    )
})

export default UnStyledLogoutButton
