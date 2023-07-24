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
                onClose={setOpen}
                className="w-full max-w-sm rounded-xl bg-gray-100 text-sm dark:bg-zinc-800 dark:text-zinc-100"
            >
                <ModalList>
                    <section className="space-y-2 py-5">
                        <Dialog.Title className="text-xl">
                            Log Out?
                        </Dialog.Title>
                        <p className="px-5 leading-6 text-secondary-light dark:text-zinc-200 lg:px-10">
                            Are you sure that you want to log out of your
                            Account?
                        </p>
                    </section>
                    <ModalListItem>
                        <button
                            className="text-primary-main hover:text-primary-dark dark:hover:text-primary-main"
                            onClick={() => handleLogOut.mutate()}
                            disabled={handleLogOut.isLoading}
                        >
                            <b>Log Out</b>
                        </button>

                        <button onClick={() => setOpen(false)}>Cancel</button>
                    </ModalListItem>
                </ModalList>
            </Modal>
        </Fragment>
    )
})

export default UnStyledLogoutButton
