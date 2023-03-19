import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import { ReactNode } from 'react'
import LaptopLayout from './LaptopLayout'
import MobileLayout from './MobileLayout'

function MainLayout({ children }: { children: ReactNode }) {
    const isMobile = useMediaQuery(SCREEN_SM)

    return isMobile ? (
        <MobileLayout>{children}</MobileLayout>
    ) : (
        <LaptopLayout>{children}</LaptopLayout>
    )
}

export default MainLayout
