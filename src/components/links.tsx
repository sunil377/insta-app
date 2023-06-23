import { useUser } from '@/context/UserContext'
import Link, { LinkProps } from 'next/link'

function BaseProfileLink(
    props: Omit<LinkProps, 'href'> &
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
    const currentUser = useUser()

    return (
        <Link
            href={{
                pathname: '/[id]',
                query: {
                    id: currentUser.docId,
                },
            }}
            {...props}
        />
    )
}
export { BaseProfileLink }
