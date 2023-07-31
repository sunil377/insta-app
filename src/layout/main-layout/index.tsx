import { useStore } from '@/context/StoreContext'
import { ReactNode } from 'react'
import LaptopLayout from './LaptopLayout'
import MobileLayout from './MobileLayout'

function MainLayout({ children }: { children: ReactNode }) {
    const { is_mobile } = useStore()

    return is_mobile ? (
        <MobileLayout>{children}</MobileLayout>
    ) : (
        <LaptopLayout>{children}</LaptopLayout>
    )
}

export default MainLayout
