import MessageLayout from '@/layout/MessageLayout'
import MainLayout from '@/layout/main-layout'
import { protectedRouteWithUser } from '@/routes/routes'
import { NextPageWithLayout } from '../_app'

const Messages: NextPageWithLayout = () => {
    return null
}

Messages.getLayout = (page) => {
    return (
        <MainLayout>
            <MessageLayout>{page}</MessageLayout>
        </MainLayout>
    )
}

export default Messages

export const getServerSideProps = protectedRouteWithUser
