import { protectedRouteWithUser } from '@/helpers/routes'
import MessageLayout from '@/layout/MessageLayout'
import MainLayout from '@/layout/main-layout'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '../_app'

const ChatRoom: NextPageWithLayout = ({ ...props }) => {
    const router = useRouter()

    return (
        <div className="flex h-full w-full items-center justify-center">
            <h2>{router.query.id}</h2>
        </div>
    )
}

ChatRoom.getLayout = (page) => {
    return (
        <MainLayout>
            <MessageLayout>{page}</MessageLayout>
        </MainLayout>
    )
}

export default ChatRoom

export const getServerSideProps = protectedRouteWithUser
