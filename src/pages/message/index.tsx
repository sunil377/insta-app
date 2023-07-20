import { protectedRouteWithUser } from '@/helpers/routes'
import MessageLayout from '@/layout/MessageLayout'
import MainLayout from '@/layout/main-layout'
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
